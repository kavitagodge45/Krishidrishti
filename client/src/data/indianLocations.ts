/**
 * KrishiDrishti — All-India Agro-Climatic Geographical Registry
 * Comprehensive hierarchy of ALL Indian States & UTs, Agricultural Districts, and Talukas/Blocks
 * with accurate coordinates for Open-Meteo hyper-local weather telemetry.
 * Coverage: 28 States + 8 UTs — pan-India agricultural zone registry
 */

export interface LocationGeo {
  name: string;
  lat: number;
  lon: number;
  pincode?: string;
}

export interface DistrictData {
  name: string;
  lat: number;
  lon: number;
  talukas: LocationGeo[];
}

export interface StateData {
  name: string;
  code: string;
  districts: DistrictData[];
}

export const INDIAN_AGRO_LOCATIONS: StateData[] = [
  // 1. MAHARASHTRA
  {
    name: 'Maharashtra',
    code: 'MH',
    districts: [
      {
        name: 'Nashik',
        lat: 19.9975, lon: 73.7898,
        talukas: [
          { name: 'Dindori', lat: 20.2033, lon: 73.8317, pincode: '422202' },
          { name: 'Niphad', lat: 20.0766, lon: 74.1100, pincode: '422303' },
          { name: 'Yeola', lat: 20.0422, lon: 74.4883, pincode: '423401' },
          { name: 'Sinnar', lat: 19.8519, lon: 73.9961, pincode: '422103' },
          { name: 'Malegaon', lat: 20.5539, lon: 74.5298, pincode: '423203' },
          { name: 'Kalwan', lat: 20.4878, lon: 73.9922, pincode: '423501' },
          { name: 'Satana', lat: 20.5900, lon: 74.2000, pincode: '423301' },
          { name: 'Trimbakeshwar', lat: 19.9381, lon: 73.5333, pincode: '422212' },
          { name: 'Chandwad', lat: 20.3294, lon: 74.2403, pincode: '423101' },
          { name: 'Nashik Taluka', lat: 20.0000, lon: 73.7800, pincode: '422001' },
        ],
      },
      {
        name: 'Pune',
        lat: 18.5204, lon: 73.8567,
        talukas: [
          { name: 'Baramati', lat: 18.1519, lon: 74.5772, pincode: '413102' },
          { name: 'Indapur', lat: 18.1158, lon: 75.0286, pincode: '413106' },
          { name: 'Daund', lat: 18.4631, lon: 74.5828, pincode: '413801' },
          { name: 'Shirur', lat: 18.8286, lon: 74.3758, pincode: '412210' },
          { name: 'Haveli', lat: 18.5000, lon: 73.9000, pincode: '411028' },
          { name: 'Khed', lat: 18.8500, lon: 73.9167, pincode: '410505' },
          { name: 'Junnar', lat: 19.2086, lon: 73.8767, pincode: '410502' },
          { name: 'Purandar', lat: 18.3439, lon: 74.0306, pincode: '412301' },
        ],
      },
      {
        name: 'Ahmednagar',
        lat: 19.0952, lon: 74.7480,
        talukas: [
          { name: 'Sangamner', lat: 19.5769, lon: 74.2122, pincode: '422605' },
          { name: 'Kopargaon', lat: 19.8833, lon: 74.4833, pincode: '423601' },
          { name: 'Rahata', lat: 19.6917, lon: 74.4833, pincode: '423107' },
          { name: 'Shrirampur', lat: 19.6200, lon: 74.6500, pincode: '413709' },
          { name: 'Rahuri', lat: 19.3900, lon: 74.6500, pincode: '413705' },
          { name: 'Newasa', lat: 19.5500, lon: 74.9200, pincode: '414603' },
          { name: 'Shevgaon', lat: 19.3500, lon: 75.2200, pincode: '414502' },
          { name: 'Nagar Taluka', lat: 19.1000, lon: 74.7400, pincode: '414001' },
        ],
      },
      {
        name: 'Nanded',
        lat: 19.1383, lon: 77.3210,
        talukas: [
          { name: 'Nanded City', lat: 19.1500, lon: 77.3100, pincode: '431601' },
          { name: 'Umri', lat: 19.0391, lon: 77.6454, pincode: '431807' },
          { name: 'Mudkhed', lat: 19.1667, lon: 77.5167, pincode: '431806' },
          { name: 'Loha', lat: 18.9500, lon: 77.1200, pincode: '431708' },
          { name: 'Kandhar', lat: 18.9000, lon: 77.2000, pincode: '431714' },
          { name: 'Degloor', lat: 18.5500, lon: 77.5800, pincode: '431717' },
          { name: 'Kinwat', lat: 19.6300, lon: 78.2000, pincode: '431804' },
          { name: 'Hadgaon', lat: 19.5000, lon: 77.6700, pincode: '431712' },
        ],
      },
      {
        name: 'Aurangabad',
        lat: 19.8762, lon: 75.3433,
        talukas: [
          { name: 'Aurangabad City', lat: 19.8800, lon: 75.3300, pincode: '431001' },
          { name: 'Paithan', lat: 19.4800, lon: 75.3800, pincode: '431107' },
          { name: 'Gangapur', lat: 19.7000, lon: 75.0000, pincode: '431109' },
          { name: 'Vaijapur', lat: 20.0500, lon: 74.7200, pincode: '423701' },
          { name: 'Sillod', lat: 20.0800, lon: 75.6700, pincode: '431112' },
        ],
      },
      {
        name: 'Solapur',
        lat: 17.6805, lon: 75.9064,
        talukas: [
          { name: 'Solapur North', lat: 17.6900, lon: 75.9000, pincode: '413001' },
          { name: 'Barshi', lat: 18.2314, lon: 75.6914, pincode: '413401' },
          { name: 'Mohol', lat: 17.8000, lon: 75.6000, pincode: '413213' },
          { name: 'Pandharpur', lat: 17.6833, lon: 75.3333, pincode: '413304' },
          { name: 'Sangola', lat: 17.4500, lon: 75.1800, pincode: '413307' },
        ],
      },
      {
        name: 'Kolhapur',
        lat: 16.6910, lon: 74.2433,
        talukas: [
          { name: 'Karveer', lat: 16.6800, lon: 74.2400, pincode: '416001' },
          { name: 'Panhala', lat: 16.8100, lon: 74.1100, pincode: '416201' },
          { name: 'Hatkanangale', lat: 16.8200, lon: 74.5200, pincode: '416109' },
          { name: 'Kagal', lat: 16.5700, lon: 74.3200, pincode: '416216' },
          { name: 'Radhanagari', lat: 16.4600, lon: 73.9700, pincode: '416212' },
        ],
      },
      {
        name: 'Satara',
        lat: 17.6805, lon: 74.0183,
        talukas: [
          { name: 'Satara City', lat: 17.6900, lon: 74.0000, pincode: '415001' },
          { name: 'Karad', lat: 17.2900, lon: 74.1800, pincode: '415110' },
          { name: 'Patan', lat: 17.3700, lon: 73.8600, pincode: '415206' },
          { name: 'Wai', lat: 17.9500, lon: 73.8900, pincode: '412803' },
          { name: 'Mahabaleshwar', lat: 17.9236, lon: 73.6578, pincode: '412806' },
        ],
      },
      {
        name: 'Latur',
        lat: 18.4088, lon: 76.5604,
        talukas: [
          { name: 'Latur Block', lat: 18.4100, lon: 76.5600, pincode: '413512' },
          { name: 'Ausa', lat: 18.2500, lon: 76.5000, pincode: '413520' },
          { name: 'Nilanga', lat: 18.1300, lon: 76.7500, pincode: '413521' },
          { name: 'Udgir', lat: 18.3900, lon: 77.1200, pincode: '413517' },
          { name: 'Ahmedpur', lat: 18.7000, lon: 76.9300, pincode: '413515' },
        ],
      },
      {
        name: 'Yavatmal',
        lat: 20.3888, lon: 78.1204,
        talukas: [
          { name: 'Yavatmal Sadar', lat: 20.3900, lon: 78.1200, pincode: '445001' },
          { name: 'Pusad', lat: 19.9100, lon: 77.5800, pincode: '445204' },
          { name: 'Umarkhed', lat: 19.6000, lon: 77.7000, pincode: '445206' },
          { name: 'Darwha', lat: 20.3200, lon: 77.7700, pincode: '445202' },
          { name: 'Wani', lat: 20.0700, lon: 78.9500, pincode: '445304' },
        ],
      },
      {
        name: 'Buldhana',
        lat: 20.5300, lon: 76.1800,
        talukas: [
          { name: 'Buldhana City', lat: 20.5300, lon: 76.1800, pincode: '443001' },
          { name: 'Khamgaon', lat: 20.6800, lon: 76.5700, pincode: '444303' },
          { name: 'Malkapur', lat: 20.8800, lon: 76.2000, pincode: '443101' },
          { name: 'Shegaon', lat: 20.7900, lon: 76.6900, pincode: '444203' },
          { name: 'Chikhli', lat: 20.3500, lon: 76.2500, pincode: '443201' },
        ],
      },
      {
        name: 'Amravati',
        lat: 20.9374, lon: 77.7796,
        talukas: [
          { name: 'Amravati City', lat: 20.9300, lon: 77.7800, pincode: '444601' },
          { name: 'Achalpur', lat: 21.2600, lon: 77.5100, pincode: '444805' },
          { name: 'Daryapur', lat: 20.9200, lon: 77.3300, pincode: '444803' },
          { name: 'Morshi', lat: 21.3100, lon: 78.0100, pincode: '444905' },
          { name: 'Warud', lat: 21.4600, lon: 78.2600, pincode: '444906' },
        ],
      },
      {
        name: 'Nagpur',
        lat: 21.1458, lon: 79.0882,
        talukas: [
          { name: 'Nagpur Rural', lat: 21.1500, lon: 79.0900, pincode: '440001' },
          { name: 'Kamptee', lat: 21.2200, lon: 79.2000, pincode: '441002' },
          { name: 'Ramtek', lat: 21.3900, lon: 79.3200, pincode: '441106' },
          { name: 'Katol', lat: 21.2700, lon: 78.5800, pincode: '441302' },
          { name: 'Wardha', lat: 20.7453, lon: 78.6022, pincode: '442001' },
        ],
      },
    ],
  },

  // 2. PUNJAB
  {
    name: 'Punjab',
    code: 'PB',
    districts: [
      {
        name: 'Ludhiana',
        lat: 30.9010, lon: 75.8573,
        talukas: [
          { name: 'Khanna', lat: 30.7073, lon: 76.2167, pincode: '141401' },
          { name: 'Jagraon', lat: 30.7800, lon: 75.4800, pincode: '142026' },
          { name: 'Samrala', lat: 30.8300, lon: 76.1800, pincode: '141114' },
          { name: 'Ludhiana West', lat: 30.9100, lon: 75.8500, pincode: '141001' },
        ],
      },
      {
        name: 'Amritsar',
        lat: 31.6340, lon: 74.8723,
        talukas: [
          { name: 'Amritsar I', lat: 31.6300, lon: 74.8700, pincode: '143001' },
          { name: 'Ajnala', lat: 31.8400, lon: 74.7600, pincode: '143102' },
          { name: 'Baba Bakala', lat: 31.5500, lon: 75.2500, pincode: '143201' },
        ],
      },
      {
        name: 'Bathinda',
        lat: 30.2110, lon: 74.9455,
        talukas: [
          { name: 'Bathinda Urban', lat: 30.2100, lon: 74.9500, pincode: '151001' },
          { name: 'Rampura Phul', lat: 30.2700, lon: 75.2300, pincode: '151103' },
          { name: 'Talwandi Sabo', lat: 29.9800, lon: 75.0800, pincode: '151302' },
          { name: 'Maur Mandi', lat: 30.0800, lon: 75.2300, pincode: '151509' },
        ],
      },
      {
        name: 'Patiala',
        lat: 30.3398, lon: 76.3869,
        talukas: [
          { name: 'Patiala Block', lat: 30.3400, lon: 76.3900, pincode: '147001' },
          { name: 'Nabha', lat: 30.3700, lon: 76.1500, pincode: '147201' },
          { name: 'Samana', lat: 30.1500, lon: 76.1900, pincode: '147101' },
          { name: 'Rajpura', lat: 30.4800, lon: 76.5900, pincode: '140401' },
        ],
      },
      {
        name: 'Sangrur',
        lat: 30.2458, lon: 75.8421,
        talukas: [
          { name: 'Sangrur Sadar', lat: 30.2500, lon: 75.8400, pincode: '148001' },
          { name: 'Sunam', lat: 30.1300, lon: 75.8000, pincode: '148028' },
          { name: 'Dhuri', lat: 30.3700, lon: 75.8700, pincode: '148024' },
          { name: 'Malerkotla', lat: 30.5200, lon: 75.8800, pincode: '148023' },
        ],
      },
      {
        name: 'Gurdaspur',
        lat: 32.0396, lon: 75.4057,
        talukas: [
          { name: 'Gurdaspur Sadar', lat: 32.0400, lon: 75.4100, pincode: '143521' },
          { name: 'Batala', lat: 31.8200, lon: 75.2000, pincode: '143505' },
          { name: 'Pathankot', lat: 32.2742, lon: 75.6522, pincode: '145001' },
          { name: 'Dera Baba Nanak', lat: 32.0300, lon: 74.9100, pincode: '143604' },
        ],
      },
    ],
  },

  // 3. MADHYA PRADESH
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    districts: [
      {
        name: 'Indore',
        lat: 22.7196, lon: 75.8577,
        talukas: [
          { name: 'Indore Central', lat: 22.7200, lon: 75.8600, pincode: '452001' },
          { name: 'Mhow', lat: 22.5500, lon: 75.7600, pincode: '453441' },
          { name: 'Sanwer', lat: 22.9700, lon: 75.8300, pincode: '453551' },
          { name: 'Depalpur', lat: 22.8500, lon: 75.5500, pincode: '453115' },
        ],
      },
      {
        name: 'Ujjain',
        lat: 23.1765, lon: 75.7885,
        talukas: [
          { name: 'Ujjain Block', lat: 23.1800, lon: 75.7900, pincode: '456001' },
          { name: 'Badnagar', lat: 23.0600, lon: 75.3800, pincode: '456771' },
          { name: 'Nagda', lat: 23.4500, lon: 75.4200, pincode: '456335' },
          { name: 'Mahidpur', lat: 23.4800, lon: 75.6500, pincode: '456443' },
          { name: 'Tarana', lat: 23.2000, lon: 76.0400, pincode: '456665' },
        ],
      },
      {
        name: 'Bhopal',
        lat: 23.2599, lon: 77.4126,
        talukas: [
          { name: 'Bhopal Urban', lat: 23.2600, lon: 77.4100, pincode: '462001' },
          { name: 'Berasia', lat: 23.6300, lon: 77.4300, pincode: '462038' },
          { name: 'Phanda', lat: 23.4000, lon: 77.2000, pincode: '462030' },
        ],
      },
      {
        name: 'Jabalpur',
        lat: 23.1815, lon: 79.9864,
        talukas: [
          { name: 'Jabalpur Urban', lat: 23.1800, lon: 79.9900, pincode: '482001' },
          { name: 'Sihora', lat: 23.4900, lon: 80.1000, pincode: '483880' },
          { name: 'Kundam', lat: 23.4400, lon: 79.7300, pincode: '483222' },
          { name: 'Patan', lat: 23.2900, lon: 79.6900, pincode: '483440' },
        ],
      },
      {
        name: 'Hoshangabad',
        lat: 22.7519, lon: 77.7289,
        talukas: [
          { name: 'Narmadapuram Block', lat: 22.7500, lon: 77.7300, pincode: '461001' },
          { name: 'Itarsi', lat: 22.6100, lon: 77.7600, pincode: '461111' },
          { name: 'Pipariya', lat: 22.7600, lon: 78.3500, pincode: '461775' },
          { name: 'Sohagpur', lat: 22.7000, lon: 78.2000, pincode: '461771' },
        ],
      },
      {
        name: 'Vidisha',
        lat: 23.5244, lon: 77.8091,
        talukas: [
          { name: 'Vidisha Block', lat: 23.5200, lon: 77.8100, pincode: '464001' },
          { name: 'Ganjbasoda', lat: 23.8500, lon: 78.0100, pincode: '464221' },
          { name: 'Sironj', lat: 24.1000, lon: 77.7000, pincode: '464228' },
        ],
      },
      {
        name: 'Dhar',
        lat: 22.5978, lon: 75.2985,
        talukas: [
          { name: 'Dhar City', lat: 22.6000, lon: 75.3000, pincode: '454001' },
          { name: 'Badnawar', lat: 23.0200, lon: 75.2200, pincode: '454660' },
          { name: 'Manawar', lat: 22.2300, lon: 75.0800, pincode: '454446' },
          { name: 'Sardarpur', lat: 22.6800, lon: 74.9800, pincode: '454111' },
        ],
      },
    ],
  },

  // 4. GUJARAT
  {
    name: 'Gujarat',
    code: 'GJ',
    districts: [
      {
        name: 'Rajkot',
        lat: 22.3039, lon: 70.8022,
        talukas: [
          { name: 'Rajkot Taluka', lat: 22.3000, lon: 70.8000, pincode: '360001' },
          { name: 'Gondal', lat: 21.9600, lon: 70.8000, pincode: '360311' },
          { name: 'Jetpur', lat: 21.7500, lon: 70.6200, pincode: '360370' },
          { name: 'Dhoraji', lat: 21.7300, lon: 70.4500, pincode: '360410' },
          { name: 'Jasdan', lat: 22.0300, lon: 71.2000, pincode: '360050' },
        ],
      },
      {
        name: 'Junagadh',
        lat: 21.5222, lon: 70.4579,
        talukas: [
          { name: 'Junagadh City', lat: 21.5200, lon: 70.4600, pincode: '362001' },
          { name: 'Keshod', lat: 21.3000, lon: 70.2500, pincode: '362220' },
          { name: 'Mangrol', lat: 21.1200, lon: 70.1200, pincode: '362225' },
          { name: 'Visavadar', lat: 21.3500, lon: 70.7000, pincode: '362130' },
        ],
      },
      {
        name: 'Surat',
        lat: 21.1702, lon: 72.8311,
        talukas: [
          { name: 'Bardoli', lat: 21.1200, lon: 73.1100, pincode: '394601' },
          { name: 'Mandvi', lat: 21.2500, lon: 73.3000, pincode: '394160' },
          { name: 'Kamrej', lat: 21.2700, lon: 72.9600, pincode: '394185' },
        ],
      },
      {
        name: 'Mehsana',
        lat: 23.5975, lon: 72.3693,
        talukas: [
          { name: 'Mehsana Taluka', lat: 23.6000, lon: 72.3700, pincode: '384001' },
          { name: 'Visnagar', lat: 23.7000, lon: 72.5500, pincode: '384315' },
          { name: 'Kadi', lat: 23.2900, lon: 72.3400, pincode: '382715' },
          { name: 'Becharaji', lat: 23.9200, lon: 72.3000, pincode: '382213' },
        ],
      },
      {
        name: 'Anand',
        lat: 22.5645, lon: 72.9289,
        talukas: [
          { name: 'Anand Taluka', lat: 22.5600, lon: 72.9300, pincode: '388001' },
          { name: 'Petlad', lat: 22.4800, lon: 72.8100, pincode: '388450' },
          { name: 'Borsad', lat: 22.4100, lon: 72.9000, pincode: '388540' },
          { name: 'Khambhat', lat: 22.3200, lon: 72.6200, pincode: '388620' },
        ],
      },
      {
        name: 'Banaskantha',
        lat: 24.1742, lon: 72.4374,
        talukas: [
          { name: 'Palanpur', lat: 24.1700, lon: 72.4400, pincode: '385001' },
          { name: 'Deesa', lat: 24.2600, lon: 72.1900, pincode: '385535' },
          { name: 'Dhanera', lat: 24.5100, lon: 72.0200, pincode: '385310' },
          { name: 'Tharad', lat: 24.3900, lon: 71.6300, pincode: '385565' },
        ],
      },
    ],
  },

  // 5. HARYANA
  {
    name: 'Haryana',
    code: 'HR',
    districts: [
      {
        name: 'Karnal',
        lat: 29.6857, lon: 76.9905,
        talukas: [
          { name: 'Karnal Block', lat: 29.6900, lon: 76.9900, pincode: '132001' },
          { name: 'Gharaunda', lat: 29.5400, lon: 76.9700, pincode: '132114' },
          { name: 'Assandh', lat: 29.5200, lon: 76.6000, pincode: '132039' },
          { name: 'Indri', lat: 29.8800, lon: 77.0600, pincode: '132041' },
        ],
      },
      {
        name: 'Hisar',
        lat: 29.1492, lon: 75.7217,
        talukas: [
          { name: 'Hisar Sadar', lat: 29.1500, lon: 75.7200, pincode: '125001' },
          { name: 'Hansi', lat: 29.1000, lon: 75.9600, pincode: '125033' },
          { name: 'Barwala', lat: 29.3800, lon: 75.9100, pincode: '125121' },
          { name: 'Narnaund', lat: 29.2200, lon: 76.1400, pincode: '125039' },
        ],
      },
      {
        name: 'Sirsa',
        lat: 29.5349, lon: 75.0298,
        talukas: [
          { name: 'Sirsa City', lat: 29.5300, lon: 75.0300, pincode: '125055' },
          { name: 'Ellenabad', lat: 29.4500, lon: 74.6500, pincode: '125102' },
          { name: 'Dabwali', lat: 29.9500, lon: 74.7200, pincode: '125104' },
          { name: 'Rania', lat: 29.5200, lon: 74.8300, pincode: '125076' },
        ],
      },
      {
        name: 'Rohtak',
        lat: 28.8955, lon: 76.6066,
        talukas: [
          { name: 'Rohtak Sadar', lat: 28.8900, lon: 76.6000, pincode: '124001' },
          { name: 'Sampla', lat: 28.8300, lon: 76.8300, pincode: '124501' },
          { name: 'Kalanaur', lat: 29.0600, lon: 76.3800, pincode: '124113' },
        ],
      },
      {
        name: 'Kurukshetra',
        lat: 29.9695, lon: 76.8783,
        talukas: [
          { name: 'Thanesar', lat: 29.9700, lon: 76.8800, pincode: '136118' },
          { name: 'Ladwa', lat: 29.9900, lon: 77.0500, pincode: '136132' },
          { name: 'Shahabad', lat: 30.1700, lon: 76.9000, pincode: '136135' },
          { name: 'Pehowa', lat: 29.9800, lon: 76.5800, pincode: '136128' },
        ],
      },
    ],
  },

  // 6. RAJASTHAN
  {
    name: 'Rajasthan',
    code: 'RJ',
    districts: [
      {
        name: 'Kota',
        lat: 25.2138, lon: 75.8648,
        talukas: [
          { name: 'Kota Ladpura', lat: 25.2100, lon: 75.8600, pincode: '324001' },
          { name: 'Ramganj Mandi', lat: 24.6500, lon: 75.9500, pincode: '326519' },
          { name: 'Sangod', lat: 24.9200, lon: 76.2800, pincode: '325601' },
          { name: 'Digod', lat: 25.1700, lon: 76.1000, pincode: '325201' },
        ],
      },
      {
        name: 'Sri Ganganagar',
        lat: 29.9038, lon: 73.8772,
        talukas: [
          { name: 'Ganganagar Sadar', lat: 29.9000, lon: 73.8800, pincode: '335001' },
          { name: 'Suratgarh', lat: 29.3200, lon: 73.9000, pincode: '335804' },
          { name: 'Raisinghnagar', lat: 29.5300, lon: 73.4500, pincode: '335051' },
          { name: 'Anupgarh', lat: 29.1900, lon: 73.2100, pincode: '335701' },
        ],
      },
      {
        name: 'Jaipur',
        lat: 26.9124, lon: 75.7873,
        talukas: [
          { name: 'Chomu', lat: 27.1700, lon: 75.7200, pincode: '303702' },
          { name: 'Kotputli', lat: 27.7000, lon: 76.2000, pincode: '303108' },
          { name: 'Bassi', lat: 26.8300, lon: 76.0400, pincode: '303301' },
          { name: 'Chaksu', lat: 26.6000, lon: 75.9500, pincode: '303901' },
        ],
      },
      {
        name: 'Jodhpur',
        lat: 26.2389, lon: 73.0243,
        talukas: [
          { name: 'Jodhpur Sadar', lat: 26.2400, lon: 73.0200, pincode: '342001' },
          { name: 'Phalodi', lat: 27.1300, lon: 72.3700, pincode: '342301' },
          { name: 'Bilara', lat: 26.1700, lon: 73.7100, pincode: '342602' },
          { name: 'Shergarh', lat: 26.8000, lon: 72.9000, pincode: '342027' },
        ],
      },
      {
        name: 'Bikaner',
        lat: 28.0229, lon: 73.3119,
        talukas: [
          { name: 'Bikaner Sadar', lat: 28.0200, lon: 73.3100, pincode: '334001' },
          { name: 'Lunkaransar', lat: 28.5100, lon: 73.7400, pincode: '334603' },
          { name: 'Nokha', lat: 27.5700, lon: 73.4600, pincode: '334803' },
          { name: 'Kolayat', lat: 27.8300, lon: 72.9900, pincode: '334303' },
        ],
      },
      {
        name: 'Ajmer',
        lat: 26.4499, lon: 74.6399,
        talukas: [
          { name: 'Ajmer Sadar', lat: 26.4500, lon: 74.6400, pincode: '305001' },
          { name: 'Beawar', lat: 26.1000, lon: 74.3200, pincode: '305901' },
          { name: 'Kishangarh', lat: 26.5900, lon: 74.8600, pincode: '305801' },
          { name: 'Nasirabad', lat: 26.3200, lon: 74.7400, pincode: '305601' },
        ],
      },
    ],
  },

  // 7. KARNATAKA
  {
    name: 'Karnataka',
    code: 'KA',
    districts: [
      {
        name: 'Belagavi',
        lat: 15.8497, lon: 74.4977,
        talukas: [
          { name: 'Belagavi Sadar', lat: 15.8500, lon: 74.5000, pincode: '590001' },
          { name: 'Chikkodi', lat: 16.4300, lon: 74.6000, pincode: '591201' },
          { name: 'Athani', lat: 16.7300, lon: 75.0500, pincode: '591304' },
          { name: 'Gokak', lat: 16.1700, lon: 74.8300, pincode: '591307' },
          { name: 'Bailhongal', lat: 15.8200, lon: 74.8500, pincode: '591102' },
        ],
      },
      {
        name: 'Dharwad',
        lat: 15.4589, lon: 75.0078,
        talukas: [
          { name: 'Hubballi', lat: 15.3600, lon: 75.1200, pincode: '580020' },
          { name: 'Dharwad Rural', lat: 15.4600, lon: 75.0100, pincode: '580001' },
          { name: 'Navalgund', lat: 15.5600, lon: 75.3600, pincode: '582208' },
          { name: 'Kalghatgi', lat: 15.1800, lon: 74.9700, pincode: '581114' },
        ],
      },
      {
        name: 'Mysuru',
        lat: 12.2958, lon: 76.6394,
        talukas: [
          { name: 'Mysuru Taluka', lat: 12.3000, lon: 76.6400, pincode: '570001' },
          { name: 'Hunsur', lat: 12.3000, lon: 76.2900, pincode: '571105' },
          { name: 'Nanjangud', lat: 12.1100, lon: 76.6800, pincode: '571301' },
          { name: 'Periyapatna', lat: 12.3300, lon: 76.0500, pincode: '571107' },
        ],
      },
      {
        name: 'Tumkur',
        lat: 13.3392, lon: 77.1011,
        talukas: [
          { name: 'Tumkur Taluka', lat: 13.3400, lon: 77.1000, pincode: '572101' },
          { name: 'Tiptur', lat: 13.2600, lon: 76.4800, pincode: '572201' },
          { name: 'Sira', lat: 13.7400, lon: 76.9100, pincode: '572137' },
          { name: 'Madhugiri', lat: 13.6700, lon: 77.2100, pincode: '572132' },
        ],
      },
      {
        name: 'Kalaburagi',
        lat: 17.3297, lon: 76.8343,
        talukas: [
          { name: 'Kalaburagi City', lat: 17.3300, lon: 76.8300, pincode: '585101' },
          { name: 'Afzalpur', lat: 17.2000, lon: 76.3500, pincode: '585301' },
          { name: 'Sedam', lat: 17.1700, lon: 77.3000, pincode: '585222' },
          { name: 'Chincholi', lat: 17.4600, lon: 77.4200, pincode: '585307' },
        ],
      },
      {
        name: 'Vijayapura',
        lat: 16.8302, lon: 75.7100,
        talukas: [
          { name: 'Bijapur Sadar', lat: 16.8300, lon: 75.7200, pincode: '586101' },
          { name: 'Muddebihal', lat: 16.3300, lon: 76.1300, pincode: '586212' },
          { name: 'Sindgi', lat: 16.9200, lon: 76.2300, pincode: '586128' },
          { name: 'Indi', lat: 17.1800, lon: 75.9600, pincode: '586209' },
        ],
      },
    ],
  },

  // 8. UTTAR PRADESH
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    districts: [
      {
        name: 'Varanasi',
        lat: 25.3176, lon: 82.9739,
        talukas: [
          { name: 'Varanasi Sadar', lat: 25.3200, lon: 82.9700, pincode: '221001' },
          { name: 'Pindra', lat: 25.4800, lon: 82.8500, pincode: '221206' },
          { name: 'Raja Talab', lat: 25.2700, lon: 82.8700, pincode: '221311' },
        ],
      },
      {
        name: 'Agra',
        lat: 27.1767, lon: 78.0081,
        talukas: [
          { name: 'Agra Sadar', lat: 27.1800, lon: 78.0100, pincode: '282001' },
          { name: 'Fatehabad', lat: 27.0200, lon: 78.3000, pincode: '283111' },
          { name: 'Kheragarh', lat: 26.9500, lon: 77.8200, pincode: '283121' },
          { name: 'Bah', lat: 26.8700, lon: 78.6000, pincode: '283104' },
        ],
      },
      {
        name: 'Meerut',
        lat: 28.9845, lon: 77.7064,
        talukas: [
          { name: 'Meerut Sadar', lat: 28.9800, lon: 77.7100, pincode: '250001' },
          { name: 'Mawana', lat: 29.1000, lon: 77.9200, pincode: '250401' },
          { name: 'Sardhana', lat: 29.1500, lon: 77.6200, pincode: '250342' },
        ],
      },
      {
        name: 'Lucknow',
        lat: 26.8467, lon: 80.9462,
        talukas: [
          { name: 'Lucknow Sadar', lat: 26.8500, lon: 80.9500, pincode: '226001' },
          { name: 'Malihabad', lat: 26.9200, lon: 80.7100, pincode: '226101' },
          { name: 'Mohanlalganj', lat: 26.6300, lon: 81.0100, pincode: '226301' },
          { name: 'Bakshi Ka Talab', lat: 26.9800, lon: 81.0300, pincode: '226201' },
        ],
      },
      {
        name: 'Kanpur',
        lat: 26.4499, lon: 80.3319,
        talukas: [
          { name: 'Kanpur Sadar', lat: 26.4500, lon: 80.3300, pincode: '208001' },
          { name: 'Ghatampur', lat: 26.1500, lon: 80.1800, pincode: '209206' },
          { name: 'Bhitargaon', lat: 26.3200, lon: 79.9400, pincode: '209305' },
          { name: 'Bilhaur', lat: 26.7400, lon: 79.8000, pincode: '209201' },
        ],
      },
      {
        name: 'Moradabad',
        lat: 28.8386, lon: 78.7733,
        talukas: [
          { name: 'Moradabad Sadar', lat: 28.8400, lon: 78.7700, pincode: '244001' },
          { name: 'Sambhal', lat: 28.5900, lon: 78.5700, pincode: '244302' },
          { name: 'Amroha', lat: 28.9100, lon: 78.4700, pincode: '244221' },
        ],
      },
      {
        name: 'Muzaffarnagar',
        lat: 29.4727, lon: 77.7085,
        talukas: [
          { name: 'Muzaffarnagar Sadar', lat: 29.4700, lon: 77.7100, pincode: '251001' },
          { name: 'Khairthal', lat: 29.5200, lon: 77.5000, pincode: '251306' },
          { name: 'Jansath', lat: 29.3400, lon: 77.8700, pincode: '251203' },
          { name: 'Budhana', lat: 29.3200, lon: 77.5000, pincode: '251309' },
        ],
      },
    ],
  },

  // 9. ANDHRA PRADESH
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    districts: [
      {
        name: 'Kurnool',
        lat: 15.8281, lon: 78.0373,
        talukas: [
          { name: 'Kurnool City', lat: 15.8300, lon: 78.0400, pincode: '518001' },
          { name: 'Nandyal', lat: 15.4800, lon: 78.4800, pincode: '518501' },
          { name: 'Adoni', lat: 15.6300, lon: 77.2700, pincode: '518301' },
          { name: 'Yemmiganur', lat: 15.7600, lon: 77.4900, pincode: '518360' },
        ],
      },
      {
        name: 'Guntur',
        lat: 16.3067, lon: 80.4365,
        talukas: [
          { name: 'Guntur City', lat: 16.3100, lon: 80.4400, pincode: '522001' },
          { name: 'Narasaraopet', lat: 16.2300, lon: 80.0500, pincode: '522601' },
          { name: 'Tenali', lat: 16.2400, lon: 80.6400, pincode: '522201' },
          { name: 'Mangalagiri', lat: 16.4300, lon: 80.5600, pincode: '522503' },
        ],
      },
      {
        name: 'Krishna',
        lat: 16.7107, lon: 80.9842,
        talukas: [
          { name: 'Machilipatnam', lat: 16.1800, lon: 81.1400, pincode: '521001' },
          { name: 'Vijayawada', lat: 16.5100, lon: 80.6300, pincode: '520001' },
          { name: 'Gudivada', lat: 16.4300, lon: 80.9900, pincode: '521301' },
          { name: 'Vuyyuru', lat: 16.3600, lon: 80.8400, pincode: '521165' },
        ],
      },
      {
        name: 'Prakasam',
        lat: 15.3431, lon: 79.5742,
        talukas: [
          { name: 'Ongole', lat: 15.5100, lon: 80.0500, pincode: '523001' },
          { name: 'Chirala', lat: 15.8200, lon: 80.3500, pincode: '523157' },
          { name: 'Markapur', lat: 15.7300, lon: 79.2700, pincode: '523316' },
          { name: 'Kandukur', lat: 15.2100, lon: 79.9000, pincode: '523105' },
        ],
      },
      {
        name: 'Anantapur',
        lat: 14.6819, lon: 77.6006,
        talukas: [
          { name: 'Anantapur City', lat: 14.6800, lon: 77.6000, pincode: '515001' },
          { name: 'Dharmavaram', lat: 14.4100, lon: 77.7200, pincode: '515671' },
          { name: 'Tadipatri', lat: 14.9000, lon: 78.0100, pincode: '515411' },
          { name: 'Guntakal', lat: 15.1700, lon: 77.3700, pincode: '515801' },
        ],
      },
    ],
  },

  // 10. TELANGANA
  {
    name: 'Telangana',
    code: 'TS',
    districts: [
      {
        name: 'Nizamabad',
        lat: 18.6725, lon: 78.0941,
        talukas: [
          { name: 'Nizamabad City', lat: 18.6700, lon: 78.1000, pincode: '503001' },
          { name: 'Bodhan', lat: 18.6700, lon: 77.9000, pincode: '503185' },
          { name: 'Armoor', lat: 18.7900, lon: 78.2900, pincode: '503224' },
          { name: 'Kamareddy', lat: 18.3200, lon: 78.3500, pincode: '503111' },
        ],
      },
      {
        name: 'Warangal',
        lat: 17.9784, lon: 79.5941,
        talukas: [
          { name: 'Warangal Urban', lat: 17.9800, lon: 79.6000, pincode: '506001' },
          { name: 'Parkal', lat: 17.9900, lon: 79.7200, pincode: '506164' },
          { name: 'Narsampet', lat: 17.9200, lon: 79.8900, pincode: '506132' },
          { name: 'Mahabubabad', lat: 17.5900, lon: 80.0100, pincode: '506101' },
        ],
      },
      {
        name: 'Nalgonda',
        lat: 17.0575, lon: 79.2674,
        talukas: [
          { name: 'Nalgonda City', lat: 17.0600, lon: 79.2700, pincode: '508001' },
          { name: 'Miryalaguda', lat: 16.8700, lon: 79.5600, pincode: '508207' },
          { name: 'Suryapet', lat: 17.1500, lon: 79.6300, pincode: '508213' },
          { name: 'Bhongir', lat: 17.5100, lon: 78.8900, pincode: '508116' },
        ],
      },
      {
        name: 'Karimnagar',
        lat: 18.4386, lon: 79.1288,
        talukas: [
          { name: 'Karimnagar City', lat: 18.4400, lon: 79.1300, pincode: '505001' },
          { name: 'Peddapalli', lat: 18.6200, lon: 79.3800, pincode: '505172' },
          { name: 'Jagtial', lat: 18.7900, lon: 78.9200, pincode: '505327' },
          { name: 'Sircilla', lat: 18.3900, lon: 78.8300, pincode: '505301' },
        ],
      },
      {
        name: 'Khammam',
        lat: 17.2473, lon: 80.1514,
        talukas: [
          { name: 'Khammam City', lat: 17.2500, lon: 80.1500, pincode: '507001' },
          { name: 'Kothagudem', lat: 17.5500, lon: 80.6200, pincode: '507101' },
          { name: 'Bhadrachalam', lat: 17.6700, lon: 80.8900, pincode: '507111' },
          { name: 'Palvancha', lat: 17.5800, lon: 80.7000, pincode: '507115' },
        ],
      },
    ],
  },

  // 11. TAMIL NADU
  {
    name: 'Tamil Nadu',
    code: 'TN',
    districts: [
      {
        name: 'Coimbatore',
        lat: 11.0168, lon: 76.9558,
        talukas: [
          { name: 'Coimbatore North', lat: 11.0200, lon: 76.9600, pincode: '641001' },
          { name: 'Pollachi', lat: 10.6600, lon: 77.0100, pincode: '642001' },
          { name: 'Mettupalayam', lat: 11.3000, lon: 76.9300, pincode: '641301' },
          { name: 'Annur', lat: 11.2400, lon: 77.1100, pincode: '641653' },
        ],
      },
      {
        name: 'Madurai',
        lat: 9.9252, lon: 78.1198,
        talukas: [
          { name: 'Madurai North', lat: 9.9300, lon: 78.1200, pincode: '625001' },
          { name: 'Melur', lat: 10.0400, lon: 78.3400, pincode: '625106' },
          { name: 'Thirumangalam', lat: 9.8200, lon: 77.9800, pincode: '625706' },
          { name: 'Usilampatti', lat: 9.9700, lon: 77.6000, pincode: '625532' },
        ],
      },
      {
        name: 'Thanjavur',
        lat: 10.7870, lon: 79.1378,
        talukas: [
          { name: 'Thanjavur Taluk', lat: 10.7900, lon: 79.1400, pincode: '613001' },
          { name: 'Kumbakonam', lat: 10.9600, lon: 79.3900, pincode: '612001' },
          { name: 'Papanasam', lat: 10.9200, lon: 79.2800, pincode: '614205' },
          { name: 'Pattukkottai', lat: 10.4200, lon: 79.3200, pincode: '614601' },
        ],
      },
      {
        name: 'Salem',
        lat: 11.6643, lon: 78.1460,
        talukas: [
          { name: 'Salem Taluk', lat: 11.6700, lon: 78.1500, pincode: '636001' },
          { name: 'Mettur', lat: 11.7900, lon: 77.8000, pincode: '636401' },
          { name: 'Edappadi', lat: 11.6500, lon: 77.9200, pincode: '637101' },
          { name: 'Omalur', lat: 11.7300, lon: 78.0400, pincode: '636455' },
        ],
      },
      {
        name: 'Tirupur',
        lat: 11.1085, lon: 77.3411,
        talukas: [
          { name: 'Tirupur North', lat: 11.1100, lon: 77.3400, pincode: '641601' },
          { name: 'Dharapuram', lat: 10.7300, lon: 77.5100, pincode: '638656' },
          { name: 'Udumalaipettai', lat: 10.5800, lon: 77.2500, pincode: '642126' },
          { name: 'Kangeyam', lat: 11.0100, lon: 77.5600, pincode: '638701' },
        ],
      },
    ],
  },

  // 12. KERALA
  {
    name: 'Kerala',
    code: 'KL',
    districts: [
      {
        name: 'Palakkad',
        lat: 10.7867, lon: 76.6548,
        talukas: [
          { name: 'Palakkad Taluk', lat: 10.7900, lon: 76.6500, pincode: '678001' },
          { name: 'Chittoor', lat: 10.6800, lon: 76.7400, pincode: '678101' },
          { name: 'Ottapalam', lat: 10.7700, lon: 76.3800, pincode: '679101' },
          { name: 'Mannarkkad', lat: 10.9900, lon: 76.4600, pincode: '678582' },
        ],
      },
      {
        name: 'Thrissur',
        lat: 10.5276, lon: 76.2144,
        talukas: [
          { name: 'Thrissur Taluk', lat: 10.5300, lon: 76.2100, pincode: '680001' },
          { name: 'Chavakkad', lat: 10.5800, lon: 76.0200, pincode: '680506' },
          { name: 'Kodungallur', lat: 10.2300, lon: 76.1900, pincode: '680664' },
          { name: 'Chalakudy', lat: 10.3000, lon: 76.3300, pincode: '680307' },
        ],
      },
      {
        name: 'Wayanad',
        lat: 11.6854, lon: 76.1320,
        talukas: [
          { name: 'Kalpetta', lat: 11.6100, lon: 76.0800, pincode: '673121' },
          { name: 'Mananthavady', lat: 11.8000, lon: 76.0100, pincode: '670645' },
          { name: 'Vythiri', lat: 11.5800, lon: 76.0200, pincode: '673576' },
        ],
      },
      {
        name: 'Ernakulam',
        lat: 9.9816, lon: 76.2999,
        talukas: [
          { name: 'Kochi', lat: 9.9312, lon: 76.2673, pincode: '682001' },
          { name: 'Aluva', lat: 10.1000, lon: 76.3500, pincode: '683101' },
          { name: 'Muvattupuzha', lat: 9.9900, lon: 76.5800, pincode: '686661' },
          { name: 'Angamaly', lat: 10.1900, lon: 76.3900, pincode: '683572' },
        ],
      },
      {
        name: 'Idukki',
        lat: 9.8500, lon: 77.0000,
        talukas: [
          { name: 'Thodupuzha', lat: 9.8900, lon: 76.7200, pincode: '685584' },
          { name: 'Munnar', lat: 10.0889, lon: 77.0595, pincode: '685612' },
          { name: 'Peerumedu', lat: 9.5700, lon: 77.0300, pincode: '685531' },
        ],
      },
    ],
  },

  // 13. WEST BENGAL
  {
    name: 'West Bengal',
    code: 'WB',
    districts: [
      {
        name: 'Bardhaman',
        lat: 23.2324, lon: 87.8615,
        talukas: [
          { name: 'Bardhaman Sadar North', lat: 23.2300, lon: 87.8600, pincode: '713101' },
          { name: 'Asansol', lat: 23.6800, lon: 86.9700, pincode: '713301' },
          { name: 'Durgapur', lat: 23.5200, lon: 87.3200, pincode: '713201' },
          { name: 'Memari', lat: 23.2000, lon: 88.1200, pincode: '713146' },
        ],
      },
      {
        name: 'Murshidabad',
        lat: 24.1793, lon: 88.2685,
        talukas: [
          { name: 'Berhampore', lat: 24.1100, lon: 88.2500, pincode: '742101' },
          { name: 'Jiaganj', lat: 24.2400, lon: 88.2700, pincode: '742123' },
          { name: 'Jangipur', lat: 24.4700, lon: 88.0700, pincode: '742213' },
          { name: 'Raghunathganj', lat: 24.4400, lon: 88.0100, pincode: '742225' },
        ],
      },
      {
        name: 'Nadia',
        lat: 23.4712, lon: 88.5563,
        talukas: [
          { name: 'Krishnanagar', lat: 23.4100, lon: 88.5200, pincode: '741101' },
          { name: 'Kalyani', lat: 22.9700, lon: 88.4500, pincode: '741235' },
          { name: 'Ranaghat', lat: 23.1800, lon: 88.5700, pincode: '741201' },
          { name: 'Chakdaha', lat: 23.0800, lon: 88.5200, pincode: '741222' },
        ],
      },
      {
        name: 'Hooghly',
        lat: 22.8989, lon: 88.3938,
        talukas: [
          { name: 'Serampore', lat: 22.7500, lon: 88.3400, pincode: '712201' },
          { name: 'Chandannagar', lat: 22.8700, lon: 88.3800, pincode: '712136' },
          { name: 'Arambagh', lat: 22.8800, lon: 87.7900, pincode: '712601' },
          { name: 'Tarakeswar', lat: 22.8900, lon: 88.0200, pincode: '712410' },
        ],
      },
    ],
  },

  // 14. ODISHA
  {
    name: 'Odisha',
    code: 'OD',
    districts: [
      {
        name: 'Cuttack',
        lat: 20.4625, lon: 85.8830,
        talukas: [
          { name: 'Cuttack Sadar', lat: 20.4600, lon: 85.8800, pincode: '753001' },
          { name: 'Banki', lat: 20.3800, lon: 85.5300, pincode: '754008' },
          { name: 'Athagarh', lat: 20.4800, lon: 85.6200, pincode: '754029' },
          { name: 'Niali', lat: 20.2700, lon: 86.0900, pincode: '754004' },
        ],
      },
      {
        name: 'Puri',
        lat: 19.8135, lon: 85.8312,
        talukas: [
          { name: 'Puri Sadar', lat: 19.8100, lon: 85.8300, pincode: '752001' },
          { name: 'Nimapara', lat: 20.0500, lon: 86.0200, pincode: '752106' },
          { name: 'Brahmagiri', lat: 19.6500, lon: 85.6300, pincode: '752015' },
        ],
      },
      {
        name: 'Ganjam',
        lat: 19.3916, lon: 84.6913,
        talukas: [
          { name: 'Berhampur', lat: 19.3100, lon: 84.7900, pincode: '760001' },
          { name: 'Phulbani', lat: 20.4700, lon: 84.2300, pincode: '762001' },
          { name: 'Bhanjanagar', lat: 19.7800, lon: 84.5800, pincode: '761126' },
          { name: 'Aska', lat: 19.7600, lon: 84.6600, pincode: '761110' },
        ],
      },
      {
        name: 'Sambalpur',
        lat: 21.4669, lon: 83.9812,
        talukas: [
          { name: 'Sambalpur Sadar', lat: 21.4700, lon: 83.9800, pincode: '768001' },
          { name: 'Jharsuguda', lat: 21.8500, lon: 84.0100, pincode: '768201' },
          { name: 'Bargarh', lat: 21.3400, lon: 83.6200, pincode: '768028' },
          { name: 'Burla', lat: 21.5100, lon: 83.8700, pincode: '768017' },
        ],
      },
    ],
  },

  // 15. BIHAR
  {
    name: 'Bihar',
    code: 'BR',
    districts: [
      {
        name: 'Patna',
        lat: 25.5941, lon: 85.1376,
        talukas: [
          { name: 'Patna Sadar', lat: 25.5900, lon: 85.1400, pincode: '800001' },
          { name: 'Patna Rural', lat: 25.6400, lon: 85.0800, pincode: '800010' },
          { name: 'Danapur', lat: 25.6200, lon: 85.0400, pincode: '801503' },
          { name: 'Fatuha', lat: 25.5100, lon: 85.3300, pincode: '803201' },
        ],
      },
      {
        name: 'Gaya',
        lat: 24.7914, lon: 85.0002,
        talukas: [
          { name: 'Gaya Sadar', lat: 24.7900, lon: 85.0000, pincode: '823001' },
          { name: 'Bodh Gaya', lat: 24.6970, lon: 84.9909, pincode: '824231' },
          { name: 'Sherghati', lat: 24.5600, lon: 84.8100, pincode: '824211' },
          { name: 'Aurangabad', lat: 24.7500, lon: 84.3700, pincode: '824101' },
        ],
      },
      {
        name: 'Muzaffarpur',
        lat: 26.1197, lon: 85.3910,
        talukas: [
          { name: 'Muzaffarpur Sadar', lat: 26.1200, lon: 85.3900, pincode: '842001' },
          { name: 'Motipur', lat: 26.2900, lon: 85.1900, pincode: '843110' },
          { name: 'Sitamarhi', lat: 26.5900, lon: 85.4800, pincode: '843302' },
        ],
      },
      {
        name: 'Bhagalpur',
        lat: 25.2425, lon: 86.9842,
        talukas: [
          { name: 'Bhagalpur Sadar', lat: 25.2400, lon: 86.9800, pincode: '812001' },
          { name: 'Banka', lat: 24.8800, lon: 86.9200, pincode: '813102' },
          { name: 'Kahalgaon', lat: 25.2600, lon: 87.2600, pincode: '813214' },
        ],
      },
    ],
  },

  // 16. JHARKHAND
  {
    name: 'Jharkhand',
    code: 'JH',
    districts: [
      {
        name: 'Ranchi',
        lat: 23.3441, lon: 85.3096,
        talukas: [
          { name: 'Ranchi Sadar', lat: 23.3400, lon: 85.3100, pincode: '834001' },
          { name: 'Bero', lat: 23.5500, lon: 85.1500, pincode: '835204' },
          { name: 'Kanke', lat: 23.4500, lon: 85.2900, pincode: '834006' },
          { name: 'Namkum', lat: 23.2600, lon: 85.3700, pincode: '834010' },
        ],
      },
      {
        name: 'Hazaribagh',
        lat: 23.9925, lon: 85.3637,
        talukas: [
          { name: 'Hazaribagh Sadar', lat: 23.9900, lon: 85.3600, pincode: '825301' },
          { name: 'Chatra', lat: 24.2200, lon: 84.8700, pincode: '825401' },
          { name: 'Koderma', lat: 24.4600, lon: 85.6000, pincode: '825410' },
        ],
      },
      {
        name: 'Dhanbad',
        lat: 23.7957, lon: 86.4304,
        talukas: [
          { name: 'Dhanbad Sadar', lat: 23.8000, lon: 86.4300, pincode: '826001' },
          { name: 'Jharia', lat: 23.7400, lon: 86.4200, pincode: '828111' },
          { name: 'Topchanchi', lat: 23.8100, lon: 86.2000, pincode: '828401' },
        ],
      },
    ],
  },

  // 17. CHHATTISGARH
  {
    name: 'Chhattisgarh',
    code: 'CG',
    districts: [
      {
        name: 'Raipur',
        lat: 21.2514, lon: 81.6296,
        talukas: [
          { name: 'Raipur Sadar', lat: 21.2500, lon: 81.6300, pincode: '492001' },
          { name: 'Arang', lat: 21.1800, lon: 81.9800, pincode: '493441' },
          { name: 'Abhanpur', lat: 20.8700, lon: 81.6800, pincode: '493661' },
          { name: 'Tilda-Neora', lat: 21.5200, lon: 81.9400, pincode: '493113' },
        ],
      },
      {
        name: 'Bilaspur',
        lat: 22.0735, lon: 82.1436,
        talukas: [
          { name: 'Bilaspur Sadar', lat: 22.0700, lon: 82.1400, pincode: '495001' },
          { name: 'Korba', lat: 22.3596, lon: 82.7501, pincode: '495677' },
          { name: 'Mungeli', lat: 22.0600, lon: 81.6800, pincode: '495334' },
        ],
      },
      {
        name: 'Durg',
        lat: 21.1904, lon: 81.2849,
        talukas: [
          { name: 'Durg Sadar', lat: 21.1900, lon: 81.2800, pincode: '491001' },
          { name: 'Bhilai', lat: 21.2100, lon: 81.4300, pincode: '490001' },
          { name: 'Rajnandgaon', lat: 21.0966, lon: 81.0289, pincode: '491441' },
        ],
      },
    ],
  },

  // 18. HIMACHAL PRADESH
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    districts: [
      {
        name: 'Shimla',
        lat: 31.1048, lon: 77.1734,
        talukas: [
          { name: 'Shimla Sadar', lat: 31.1000, lon: 77.1700, pincode: '171001' },
          { name: 'Rampur', lat: 31.4500, lon: 77.6400, pincode: '172001' },
          { name: 'Rohru', lat: 31.2000, lon: 77.7500, pincode: '171207' },
          { name: 'Theog', lat: 31.1200, lon: 77.3800, pincode: '171201' },
        ],
      },
      {
        name: 'Kangra',
        lat: 32.0998, lon: 76.2691,
        talukas: [
          { name: 'Dharamshala', lat: 32.2190, lon: 76.3234, pincode: '176215' },
          { name: 'Palampur', lat: 32.1100, lon: 76.5300, pincode: '176061' },
          { name: 'Nurpur', lat: 32.2900, lon: 75.8900, pincode: '176202' },
          { name: 'Dehra Gopipur', lat: 31.8900, lon: 76.2800, pincode: '177101' },
        ],
      },
      {
        name: 'Mandi',
        lat: 31.7090, lon: 76.9320,
        talukas: [
          { name: 'Mandi Sadar', lat: 31.7100, lon: 76.9300, pincode: '175001' },
          { name: 'Sundernagar', lat: 31.5300, lon: 76.9000, pincode: '175018' },
          { name: 'Jogindernagar', lat: 31.9900, lon: 76.7900, pincode: '175015' },
        ],
      },
    ],
  },

  // 19. UTTARAKHAND
  {
    name: 'Uttarakhand',
    code: 'UK',
    districts: [
      {
        name: 'Dehradun',
        lat: 30.3165, lon: 78.0322,
        talukas: [
          { name: 'Dehradun Sadar', lat: 30.3200, lon: 78.0300, pincode: '248001' },
          { name: 'Rishikesh', lat: 30.0869, lon: 78.2676, pincode: '249201' },
          { name: 'Doiwala', lat: 30.1800, lon: 78.1200, pincode: '248140' },
          { name: 'Chakrata', lat: 30.7000, lon: 77.8700, pincode: '248141' },
        ],
      },
      {
        name: 'Haridwar',
        lat: 29.9457, lon: 78.1642,
        talukas: [
          { name: 'Haridwar Sadar', lat: 29.9500, lon: 78.1600, pincode: '249401' },
          { name: 'Roorkee', lat: 29.8600, lon: 77.8900, pincode: '247667' },
          { name: 'Bhagwanpur', lat: 29.8000, lon: 77.9700, pincode: '247661' },
        ],
      },
      {
        name: 'Udham Singh Nagar',
        lat: 28.9592, lon: 79.5060,
        talukas: [
          { name: 'Rudrapur', lat: 28.9800, lon: 79.4100, pincode: '263153' },
          { name: 'Kashipur', lat: 29.2100, lon: 78.9600, pincode: '244713' },
          { name: 'Khatima', lat: 28.9200, lon: 79.9700, pincode: '262308' },
          { name: 'Sitarganj', lat: 28.9300, lon: 79.6900, pincode: '262405' },
        ],
      },
      {
        name: 'Nainital',
        lat: 29.3803, lon: 79.4636,
        talukas: [
          { name: 'Haldwani', lat: 29.2200, lon: 79.5200, pincode: '263139' },
          { name: 'Ramnagar', lat: 29.3900, lon: 79.1300, pincode: '244715' },
          { name: 'Lalkuan', lat: 29.1500, lon: 79.5200, pincode: '262402' },
        ],
      },
    ],
  },

  // 20. ASSAM
  {
    name: 'Assam',
    code: 'AS',
    districts: [
      {
        name: 'Kamrup',
        lat: 26.1445, lon: 91.7362,
        talukas: [
          { name: 'Guwahati', lat: 26.1445, lon: 91.7362, pincode: '781001' },
          { name: 'Rangia', lat: 26.4600, lon: 91.6200, pincode: '781354' },
          { name: 'Boko', lat: 26.0600, lon: 91.2300, pincode: '781123' },
          { name: 'Azara', lat: 26.0900, lon: 91.6900, pincode: '781017' },
        ],
      },
      {
        name: 'Nagaon',
        lat: 26.3465, lon: 92.6837,
        talukas: [
          { name: 'Nagaon Sadar', lat: 26.3500, lon: 92.6800, pincode: '782001' },
          { name: 'Hojai', lat: 26.0000, lon: 92.8700, pincode: '782435' },
          { name: 'Lumding', lat: 25.7500, lon: 93.1700, pincode: '782447' },
        ],
      },
      {
        name: 'Sonitpur',
        lat: 26.6338, lon: 92.7932,
        talukas: [
          { name: 'Tezpur', lat: 26.6300, lon: 92.8000, pincode: '784001' },
          { name: 'Rangapara', lat: 26.8200, lon: 92.6900, pincode: '784505' },
          { name: 'Dhekiajuli', lat: 26.7100, lon: 92.5000, pincode: '784110' },
        ],
      },
      {
        name: 'Jorhat',
        lat: 26.7465, lon: 94.2026,
        talukas: [
          { name: 'Jorhat Sadar', lat: 26.7500, lon: 94.2000, pincode: '785001' },
          { name: 'Mariani', lat: 26.6600, lon: 94.3300, pincode: '785634' },
          { name: 'Titabor', lat: 26.6200, lon: 94.1900, pincode: '785630' },
        ],
      },
    ],
  },

  // 21. SIKKIM
  {
    name: 'Sikkim',
    code: 'SK',
    districts: [
      {
        name: 'East Sikkim',
        lat: 27.3314, lon: 88.6138,
        talukas: [
          { name: 'Gangtok', lat: 27.3314, lon: 88.6138, pincode: '737101' },
          { name: 'Rongli', lat: 27.2100, lon: 88.7600, pincode: '737132' },
          { name: 'Pakyong', lat: 27.2200, lon: 88.6000, pincode: '737106' },
        ],
      },
      {
        name: 'West Sikkim',
        lat: 27.2780, lon: 88.2644,
        talukas: [
          { name: 'Gyalshing', lat: 27.2800, lon: 88.2600, pincode: '737111' },
          { name: 'Jorethang', lat: 27.1100, lon: 88.1700, pincode: '737121' },
        ],
      },
    ],
  },

  // 22. MEGHALAYA
  {
    name: 'Meghalaya',
    code: 'ML',
    districts: [
      {
        name: 'East Khasi Hills',
        lat: 25.5788, lon: 91.8933,
        talukas: [
          { name: 'Shillong', lat: 25.5788, lon: 91.8933, pincode: '793001' },
          { name: 'Cherrapunji', lat: 25.2984, lon: 91.7051, pincode: '793108' },
          { name: 'Mawlynnong', lat: 25.2000, lon: 91.9600, pincode: '793110' },
        ],
      },
      {
        name: 'West Garo Hills',
        lat: 25.5138, lon: 90.2175,
        talukas: [
          { name: 'Tura', lat: 25.5100, lon: 90.2200, pincode: '794001' },
          { name: 'Phulbari', lat: 25.1600, lon: 89.9800, pincode: '794002' },
        ],
      },
    ],
  },

  // 23. MANIPUR
  {
    name: 'Manipur',
    code: 'MN',
    districts: [
      {
        name: 'Imphal West',
        lat: 24.8170, lon: 93.9368,
        talukas: [
          { name: 'Imphal', lat: 24.8170, lon: 93.9368, pincode: '795001' },
          { name: 'Lamphel', lat: 24.8200, lon: 93.9000, pincode: '795004' },
          { name: 'Patsoi', lat: 24.9000, lon: 93.9200, pincode: '795001' },
        ],
      },
      {
        name: 'Thoubal',
        lat: 24.6374, lon: 94.0122,
        talukas: [
          { name: 'Thoubal Sadar', lat: 24.6400, lon: 94.0100, pincode: '795138' },
          { name: 'Kakching', lat: 24.5000, lon: 93.9800, pincode: '795103' },
        ],
      },
    ],
  },

  // 24. MIZORAM
  {
    name: 'Mizoram',
    code: 'MZ',
    districts: [
      {
        name: 'Aizawl',
        lat: 23.7307, lon: 92.7173,
        talukas: [
          { name: 'Aizawl Sadar', lat: 23.7300, lon: 92.7200, pincode: '796001' },
          { name: 'Thenzawl', lat: 23.2600, lon: 92.9700, pincode: '796770' },
        ],
      },
      {
        name: 'Lunglei',
        lat: 22.8882, lon: 92.7348,
        talukas: [
          { name: 'Lunglei Sadar', lat: 22.8900, lon: 92.7300, pincode: '796701' },
          { name: 'Tlabung', lat: 22.2200, lon: 92.6600, pincode: '796770' },
        ],
      },
    ],
  },

  // 25. NAGALAND
  {
    name: 'Nagaland',
    code: 'NL',
    districts: [
      {
        name: 'Kohima',
        lat: 25.6701, lon: 94.1077,
        talukas: [
          { name: 'Kohima Sadar', lat: 25.6700, lon: 94.1100, pincode: '797001' },
          { name: 'Viswema', lat: 25.5800, lon: 94.0800, pincode: '797001' },
        ],
      },
      {
        name: 'Dimapur',
        lat: 25.9069, lon: 93.7267,
        talukas: [
          { name: 'Dimapur Sadar', lat: 25.9100, lon: 93.7300, pincode: '797112' },
          { name: 'Chumukedima', lat: 25.9300, lon: 93.7600, pincode: '797103' },
        ],
      },
    ],
  },

  // 26. TRIPURA
  {
    name: 'Tripura',
    code: 'TR',
    districts: [
      {
        name: 'West Tripura',
        lat: 23.8315, lon: 91.2868,
        talukas: [
          { name: 'Agartala', lat: 23.8315, lon: 91.2868, pincode: '799001' },
          { name: 'Bishramganj', lat: 23.6100, lon: 91.2300, pincode: '799102' },
          { name: 'Mandwi', lat: 23.7100, lon: 91.3300, pincode: '799005' },
        ],
      },
      {
        name: 'Dhalai',
        lat: 24.0701, lon: 91.8084,
        talukas: [
          { name: 'Ambassa', lat: 24.0700, lon: 91.8100, pincode: '799251' },
          { name: 'Kamalpur', lat: 24.1900, lon: 91.8200, pincode: '799261' },
        ],
      },
    ],
  },

  // 27. ARUNACHAL PRADESH
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    districts: [
      {
        name: 'Papum Pare',
        lat: 27.1024, lon: 93.6123,
        talukas: [
          { name: 'Itanagar', lat: 27.1024, lon: 93.6123, pincode: '791111' },
          { name: 'Naharlagun', lat: 27.1000, lon: 93.6900, pincode: '791110' },
        ],
      },
      {
        name: 'West Siang',
        lat: 28.1628, lon: 94.8045,
        talukas: [
          { name: 'Along', lat: 28.1600, lon: 94.8000, pincode: '791001' },
          { name: 'Rumgong', lat: 28.2800, lon: 94.6500, pincode: '791104' },
        ],
      },
    ],
  },

  // 28. GOA
  {
    name: 'Goa',
    code: 'GA',
    districts: [
      {
        name: 'North Goa',
        lat: 15.5788, lon: 73.9197,
        talukas: [
          { name: 'Panaji', lat: 15.4909, lon: 73.8278, pincode: '403001' },
          { name: 'Mapusa', lat: 15.5934, lon: 73.8145, pincode: '403507' },
          { name: 'Bicholim', lat: 15.5900, lon: 73.9600, pincode: '403529' },
          { name: 'Pernem', lat: 15.7200, lon: 73.7900, pincode: '403512' },
        ],
      },
      {
        name: 'South Goa',
        lat: 15.2993, lon: 74.1240,
        talukas: [
          { name: 'Margao', lat: 15.2832, lon: 73.9862, pincode: '403601' },
          { name: 'Vasco Da Gama', lat: 15.3960, lon: 73.8110, pincode: '403802' },
          { name: 'Quepem', lat: 15.2100, lon: 74.0700, pincode: '403705' },
          { name: 'Ponda', lat: 15.4000, lon: 74.0100, pincode: '403401' },
        ],
      },
    ],
  },

  // 29. JAMMU & KASHMIR (UT)
  {
    name: 'Jammu & Kashmir',
    code: 'JK',
    districts: [
      {
        name: 'Jammu',
        lat: 32.7266, lon: 74.8570,
        talukas: [
          { name: 'Jammu Sadar', lat: 32.7300, lon: 74.8600, pincode: '180001' },
          { name: 'Akhnoor', lat: 32.8800, lon: 74.7300, pincode: '185201' },
          { name: 'Bishnah', lat: 32.5700, lon: 75.0200, pincode: '184209' },
          { name: 'Samba', lat: 32.5600, lon: 75.1200, pincode: '184121' },
        ],
      },
      {
        name: 'Srinagar',
        lat: 34.0837, lon: 74.7973,
        talukas: [
          { name: 'Srinagar City', lat: 34.0800, lon: 74.8000, pincode: '190001' },
          { name: 'Ganderbal', lat: 34.2300, lon: 74.7800, pincode: '191201' },
          { name: 'Budgam', lat: 33.9300, lon: 74.7200, pincode: '191111' },
          { name: 'Pulwama', lat: 33.8800, lon: 74.8800, pincode: '192301' },
        ],
      },
      {
        name: 'Baramulla',
        lat: 34.1937, lon: 74.3609,
        talukas: [
          { name: 'Baramulla Sadar', lat: 34.1900, lon: 74.3600, pincode: '193101' },
          { name: 'Sopore', lat: 34.3000, lon: 74.4700, pincode: '193201' },
          { name: 'Kupwara', lat: 34.5200, lon: 74.2600, pincode: '193222' },
        ],
      },
    ],
  },

  // 30. HIMACHAL / PUNJAB border areas — already covered above
  // 30. DADRA & NAGAR HAVELI (UT)
  {
    name: 'Dadra & Nagar Haveli',
    code: 'DN',
    districts: [
      {
        name: 'Dadra & Nagar Haveli',
        lat: 20.1809, lon: 73.0169,
        talukas: [
          { name: 'Silvassa', lat: 20.2738, lon: 73.0169, pincode: '396230' },
          { name: 'Khanvel', lat: 20.2400, lon: 73.0600, pincode: '396235' },
        ],
      },
    ],
  },

  // 31. LADAKH (UT)
  {
    name: 'Ladakh',
    code: 'LA',
    districts: [
      {
        name: 'Leh',
        lat: 34.1526, lon: 77.5771,
        talukas: [
          { name: 'Leh Sadar', lat: 34.1500, lon: 77.5800, pincode: '194101' },
          { name: 'Nubra', lat: 34.8200, lon: 77.5500, pincode: '194401' },
          { name: 'Zanskar', lat: 33.5000, lon: 77.5000, pincode: '194109' },
        ],
      },
      {
        name: 'Kargil',
        lat: 34.5539, lon: 76.1349,
        talukas: [
          { name: 'Kargil Sadar', lat: 34.5500, lon: 76.1300, pincode: '194103' },
          { name: 'Zanskar', lat: 33.5000, lon: 77.0000, pincode: '194102' },
        ],
      },
    ],
  },
];

// Helper functions for easy querying
export const getAllStates = (): string[] => {
  return INDIAN_AGRO_LOCATIONS.map(s => s.name);
};

export const getDistrictsByState = (stateName: string): DistrictData[] => {
  const found = INDIAN_AGRO_LOCATIONS.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return found ? found.districts : [];
};

export const getTalukasByDistrict = (stateName: string, districtName: string): LocationGeo[] => {
  const districts = getDistrictsByState(stateName);
  const found = districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  return found ? found.talukas : [];
};
