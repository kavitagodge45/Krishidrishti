/**
 * KrishiDrishti Official Agmarknet / Data.gov.in Real Mandi Integration Service
 * Queries official Government of India daily market price records.
 * Zero Fake Data Policy: strictly prohibits simulated or invented mandi rates.
 */

export interface MandiRecord {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: string;
}

export interface MandiFetchResult {
  isConfigured: boolean;
  success: boolean;
  message: string;
  records: MandiRecord[];
  totalRecords?: number;
  dataSource: string;
  timestamp: string;
}

export const fetchRealMandiPrices = async (
  commodityFilter?: string,
  stateFilter?: string,
  searchQuery?: string
): Promise<MandiFetchResult> => {
  const apiKey = process.env.DATA_GOV_IN_API_KEY;

  if (!apiKey || apiKey.includes('your-data-gov-in-key') || apiKey.trim().length < 10) {
    return {
      isConfigured: false,
      success: false,
      message: 'Official Agmarknet API key is not configured. Set DATA_GOV_IN_API_KEY in server/.env with your verified key from https://data.gov.in to enable live APMC market prices. Under our Zero Fake Data policy, simulated rates are prohibited.',
      records: [],
      dataSource: 'National Agmarknet Portal (data.gov.in / e-NAM)',
      timestamp: new Date().toISOString()
    };
  }

  try {
    let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(apiKey)}&format=json&limit=50`;

    if (stateFilter && stateFilter !== 'All') {
      url += `&filters[state]=${encodeURIComponent(stateFilter)}`;
    }
    if (commodityFilter && commodityFilter !== 'All') {
      const cleanCommodity = commodityFilter.split('(')[0].trim();
      url += `&filters[commodity]=${encodeURIComponent(cleanCommodity)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          isConfigured: true,
          success: false,
          message: 'Invalid or unauthorized DATA_GOV_IN_API_KEY. Please verify your API key at https://data.gov.in.',
          records: [],
          dataSource: 'data.gov.in API',
          timestamp: new Date().toISOString()
        };
      }
      throw new Error(`Data.gov.in API returned HTTP ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any;

    if (data.error) {
      return {
        isConfigured: true,
        success: false,
        message: `Official data.gov.in API notice: ${data.error}`,
        records: [],
        dataSource: 'data.gov.in API',
        timestamp: new Date().toISOString()
      };
    }

    const rawRecords = data.records || [];
    let mappedRecords: MandiRecord[] = rawRecords.map((r: any, idx: number) => ({
      id: `mandi-${r.state || 'IN'}-${r.market || idx}-${r.arrival_date || Date.now()}-${idx}`,
      commodity: r.commodity || 'Standard',
      variety: r.variety || 'Local',
      market: r.market || 'APMC Yard',
      district: r.district || '',
      state: r.state || '',
      minPrice: parseFloat(r.min_price) || 0,
      maxPrice: parseFloat(r.max_price) || 0,
      modalPrice: parseFloat(r.modal_price) || 0,
      unit: '₹ / Quintal',
      arrivalDate: r.arrival_date || new Date().toISOString().split('T')[0]
    }));

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      mappedRecords = mappedRecords.filter(
        m => m.market.toLowerCase().includes(q) ||
             m.commodity.toLowerCase().includes(q) ||
             m.district.toLowerCase().includes(q)
      );
    }

    return {
      isConfigured: true,
      success: true,
      message: mappedRecords.length > 0
        ? `Successfully fetched ${mappedRecords.length} live APMC mandi records from Agmarknet.`
        : 'Official Agmarknet query succeeded, but no matching commodity arrivals were found for the chosen filters today.',
      records: mappedRecords,
      totalRecords: data.total || mappedRecords.length,
      dataSource: 'Ministry of Agriculture Agmarknet (data.gov.in)',
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      success: false,
      message: `Failed to query official Agmarknet portal: ${err.message}.`,
      records: [],
      dataSource: 'data.gov.in API',
      timestamp: new Date().toISOString()
    };
  }
};
