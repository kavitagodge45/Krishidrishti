/**
 * KrishiDrishti Official Agmarknet / Data.gov.in Real Mandi Integration Service
 * Queries official Government of India daily APMC market price records.
 * Zero Fake Data Policy: strictly prohibits simulated or invented mandi rates.
 *
 * Official data.gov.in resource:
 * https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
 */

import https from 'https';

/**
 * Fetch a URL via Node.js native https module with timeout & TLS tolerance.
 * Bypasses corporate/proxy/cloud TLS handshake issues while connecting to api.data.gov.in.
 */
function httpsGetJson(url: string, timeoutMs: number = 15000): Promise<any> {
  return new Promise((resolve, reject) => {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const req = https.get(url, { agent }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode && res.statusCode >= 400) {
            if (res.statusCode === 401 || res.statusCode === 403) {
              reject(new Error(`UNAUTHORIZED_API_KEY: HTTP ${res.statusCode} from data.gov.in. Please verify DATA_GOV_API_KEY.`));
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
            }
          } else {
            resolve(JSON.parse(body));
          }
        } catch (e) {
          reject(new Error(`JSON parse error: ${(e as Error).message}`));
        }
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request timed out after ${timeoutMs / 1000}s connecting to data.gov.in`));
    });
  });
}

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
  minimum: number;
  maximum: number;
  modal: number;
  unit: string;
  arrivalDate: string;
  date: string;
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

/**
 * Normalizes user-facing crop labels to official Agmarknet commodity nomenclature
 */
const normalizeAgmarknetCommodity = (input: string): string => {
  const clean = input.split('(')[0].split('/')[0].trim().toLowerCase();
  const COMMODITY_MAP: Record<string, string> = {
    'soybean': 'Soyabean',
    'soyabean': 'Soyabean',
    'cotton': 'Cotton',
    'wheat': 'Wheat',
    'onion': 'Onion',
    'gram': 'Gram',
    'chana': 'Gram',
    'tomato': 'Tomato',
    'grapes': 'Grapes',
    'pomegranate': 'Pomegranate',
    'maize': 'Maize',
    'potato': 'Potato',
    'bajra': 'Bajra',
    'rice': 'Paddy(Dhan)',
    'paddy': 'Paddy(Dhan)',
    'tur': 'Arhar (Tur/Red Gram)',
    'arhar': 'Arhar (Tur/Red Gram)'
  };

  for (const [key, officialName] of Object.entries(COMMODITY_MAP)) {
    if (clean.includes(key)) {
      return officialName;
    }
  }
  return input.split('(')[0].trim();
};

export const fetchRealMandiPrices = async (
  commodityFilter?: string,
  stateFilter?: string,
  searchQuery?: string
): Promise<MandiFetchResult> => {
  // Read the API key only from process.env.DATA_GOV_API_KEY
  const apiKey = (process.env.DATA_GOV_API_KEY || '').trim();

  if (!apiKey || apiKey.includes('your-data-gov-in-key') || apiKey.length < 10) {
    return {
      isConfigured: false,
      success: false,
      message: 'Official Agmarknet API key is not configured. Set DATA_GOV_API_KEY in the backend environment with your verified key from https://data.gov.in to enable live APMC market prices. Under KrishiDrishti’s strict Zero Fake Data policy, simulated rates are prohibited.',
      records: [],
      dataSource: 'National Agmarknet Portal (data.gov.in / e-NAM)',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
    let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${encodeURIComponent(apiKey)}&format=json&limit=100`;

    // Default to Maharashtra if not specified, unless explicitly requested as 'All'
    const targetState = stateFilter && stateFilter !== 'All' 
      ? stateFilter 
      : (stateFilter === 'All' ? '' : 'Maharashtra');

    if (targetState) {
      url += `&filters[state]=${encodeURIComponent(targetState)}`;
    }

    if (commodityFilter && commodityFilter !== 'All') {
      const normalizedCommodity = normalizeAgmarknetCommodity(commodityFilter);
      url += `&filters[commodity]=${encodeURIComponent(normalizedCommodity)}`;
    }

    const data = await httpsGetJson(url);

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
    let mappedRecords: MandiRecord[] = rawRecords.map((r: any, idx: number) => {
      const minPrice = parseFloat(r.min_price) || 0;
      const maxPrice = parseFloat(r.max_price) || 0;
      const modalPrice = parseFloat(r.modal_price) || 0;
      const arrivalDate = r.arrival_date || new Date().toISOString().split('T')[0];

      return {
        id: `mandi-${r.state || 'MH'}-${(r.market || idx).toString().replace(/\s+/g, '_')}-${arrivalDate}-${idx}`,
        commodity: r.commodity || 'Standard',
        variety: r.variety || 'Local',
        market: (r.market || 'APMC Yard').trim(),
        district: (r.district || '').trim(),
        state: (r.state || targetState || 'Maharashtra').trim(),
        minPrice,
        maxPrice,
        modalPrice,
        minimum: minPrice,
        maximum: maxPrice,
        modal: modalPrice,
        unit: '₹ / Quintal',
        arrivalDate,
        date: arrivalDate
      };
    });

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      mappedRecords = mappedRecords.filter(
        m => m.market.toLowerCase().includes(q) ||
             m.commodity.toLowerCase().includes(q) ||
             m.district.toLowerCase().includes(q) ||
             m.variety.toLowerCase().includes(q)
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
    const isAuthError = err.message && err.message.includes('UNAUTHORIZED_API_KEY');
    return {
      isConfigured: !isAuthError,
      success: false,
      message: isAuthError
        ? 'Invalid or unauthorized DATA_GOV_API_KEY. Please verify your API key at https://data.gov.in.'
        : `Failed to query official Agmarknet portal: ${err.message}.`,
      records: [],
      dataSource: 'data.gov.in API',
      timestamp: new Date().toISOString()
    };
  }
};
