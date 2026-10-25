/**
 * KrishiDrishti — All-India Agro-Climatic Geographical Registry
 * Comprehensive hierarchy of Indian States, Agricultural Districts, and Talukas / Blocks
 * with accurate coordinates for Open-Meteo hyper-local weather telemetry.
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
  // 1. MAHARASHTRA (Maharashtra-First Agricultural Hub)
  {
    name: 'Maharashtra',
    code: 'MH',
    districts: [
      {
        name: 'Nashik',
        lat: 19.9975,
        lon: 73.7898,
        talukas: [
          { name: 'Dindori', lat: 20.2033, lon: 73.8317, pincode: '422202' },
          { name: 'Niphad', lat: 20.0766, lon: 74.1100, pincode: '422303' },
          { name: 'Yeola', lat: 20.0422, lon: 74.4883, pincode: '423401' },
          { name: 'Sinnar', lat: 19.8519, lon: 73.9961, pincode: '422103' },
          { name: 'Malegaon', lat: 20.5539, lon: 74.5298, pincode: '423203' },
          { name: 'Kalwan', lat: 20.4878, lon: 73.9922, pincode: '423501' },
          { name: 'Satana (Baglan)', lat: 20.5900, lon: 74.2000, pincode: '423301' },
          { name: 'Trimbakeshwar', lat: 19.9381, lon: 73.5333, pincode: '422212' },
          { name: 'Chandwad', lat: 20.3294, lon: 74.2403, pincode: '423101' },
          { name: 'Nashik Taluka', lat: 20.0000, lon: 73.7800, pincode: '422001' }
        ]
      },
      {
        name: 'Pune',
        lat: 18.5204,
        lon: 73.8567,
        talukas: [
          { name: 'Baramati', lat: 18.1519, lon: 74.5772, pincode: '413102' },
          { name: 'Indapur', lat: 18.1158, lon: 75.0286, pincode: '413106' },
          { name: 'Daund', lat: 18.4631, lon: 74.5828, pincode: '413801' },
          { name: 'Shirur', lat: 18.8286, lon: 74.3758, pincode: '412210' },
          { name: 'Haveli', lat: 18.5000, lon: 73.9000, pincode: '411028' },
          { name: 'Khed (Rajgurunagar)', lat: 18.8500, lon: 73.9167, pincode: '410505' },
          { name: 'Junnar', lat: 19.2086, lon: 73.8767, pincode: '410502' },
          { name: 'Purandar (Saswad)', lat: 18.3439, lon: 74.0306, pincode: '412301' }
        ]
      },
      {
        name: 'Ahmednagar (Ahilyanagar)',
        lat: 19.0952,
        lon: 74.7480,
        talukas: [
          { name: 'Sangamner', lat: 19.5769, lon: 74.2122, pincode: '422605' },
          { name: 'Kopargaon', lat: 19.8833, lon: 74.4833, pincode: '423601' },
          { name: 'Rahata (Shirdi)', lat: 19.6917, lon: 74.4833, pincode: '423107' },
          { name: 'Shrirampur', lat: 19.6200, lon: 74.6500, pincode: '413709' },
          { name: 'Rahuri', lat: 19.3900, lon: 74.6500, pincode: '413705' },
          { name: 'Newasa', lat: 19.5500, lon: 74.9200, pincode: '414603' },
          { name: 'Shevgaon', lat: 19.3500, lon: 75.2200, pincode: '414502' },
          { name: 'Nagar Taluka', lat: 19.1000, lon: 74.7400, pincode: '414001' }
        ]
      },
      {
        name: 'Nanded',
        lat: 19.1383,
        lon: 77.3210,
        talukas: [
          { name: 'Nanded City', lat: 19.1500, lon: 77.3100, pincode: '431601' },
          { name: 'Umri', lat: 19.0391, lon: 77.6454, pincode: '431807' },
          { name: 'Mudkhed', lat: 19.1667, lon: 77.5167, pincode: '431806' },
          { name: 'Loha', lat: 18.9500, lon: 77.1200, pincode: '431708' },
          { name: 'Kandhar', lat: 18.9000, lon: 77.2000, pincode: '431714' },
          { name: 'Degloor', lat: 18.5500, lon: 77.5800, pincode: '431717' },
          { name: 'Kinwat', lat: 19.6300, lon: 78.2000, pincode: '431804' },
          { name: 'Hadgaon', lat: 19.5000, lon: 77.6700, pincode: '431712' },
          { name: 'Bhokar', lat: 19.2200, lon: 77.6700, pincode: '431801' },
          { name: 'Biloli', lat: 18.7700, lon: 77.7300, pincode: '431710' }
        ]
      },
      {
        name: 'Chhatrapati Sambhajinagar (Aurangabad)',
        lat: 19.8762,
        lon: 75.3433,
        talukas: [
          { name: 'Aurangabad Central', lat: 19.8800, lon: 75.3300, pincode: '431001' },
          { name: 'Paithan', lat: 19.4800, lon: 75.3800, pincode: '431107' },
          { name: 'Gangapur', lat: 19.7000, lon: 75.0000, pincode: '431109' },
          { name: 'Vaijapur', lat: 19.9200, lon: 74.7300, pincode: '423701' },
          { name: 'Kannad', lat: 20.2700, lon: 75.1300, pincode: '431103' },
          { name: 'Sillod', lat: 20.3000, lon: 75.6500, pincode: '431112' }
        ]
      },
      {
        name: 'Amravati',
        lat: 20.9374,
        lon: 77.7796,
        talukas: [
          { name: 'Amravati Block', lat: 20.9374, lon: 77.7796, pincode: '444601' },
          { name: 'Warud (Rajura Bazar)', lat: 21.4667, lon: 78.2667, pincode: '444906' },
          { name: 'Morshi', lat: 21.3200, lon: 78.0100, pincode: '444905' },
          { name: 'Achalpur', lat: 21.2600, lon: 77.5100, pincode: '444806' },
          { name: 'Chandur Railway', lat: 20.8200, lon: 77.9800, pincode: '444904' },
          { name: 'Daryapur', lat: 20.9300, lon: 77.3200, pincode: '444803' },
          { name: 'Anjangaon Surji', lat: 21.1600, lon: 77.3100, pincode: '444705' }
        ]
      },
      {
        name: 'Solapur',
        lat: 17.6599,
        lon: 75.9064,
        talukas: [
          { name: 'Pandharpur', lat: 17.6778, lon: 75.3283, pincode: '413304' },
          { name: 'Barshi', lat: 18.2333, lon: 75.6833, pincode: '413401' },
          { name: 'Malshiras', lat: 17.8200, lon: 74.9000, pincode: '413107' },
          { name: 'Karmala', lat: 18.4200, lon: 75.2000, pincode: '413203' },
          { name: 'Sangola', lat: 17.4300, lon: 75.2000, pincode: '413307' },
          { name: 'Mohol', lat: 17.8200, lon: 75.6500, pincode: '413213' },
          { name: 'Solapur North', lat: 17.6600, lon: 75.9100, pincode: '413001' }
        ]
      },
      {
        name: 'Kolhapur',
        lat: 16.7050,
        lon: 74.2433,
        talukas: [
          { name: 'Karvir (Kolhapur)', lat: 16.7000, lon: 74.2300, pincode: '416003' },
          { name: 'Hatkangale', lat: 16.7400, lon: 74.4400, pincode: '416109' },
          { name: 'Shirol', lat: 16.7100, lon: 74.6000, pincode: '416103' },
          { name: 'Radhanagari', lat: 16.4200, lon: 74.0000, pincode: '416211' },
          { name: 'Panhala', lat: 16.8100, lon: 74.1100, pincode: '416201' },
          { name: 'Kagal', lat: 16.5800, lon: 74.3200, pincode: '416216' }
        ]
      },
      {
        name: 'Sangli',
        lat: 16.8524,
        lon: 74.5815,
        talukas: [
          { name: 'Miraj', lat: 16.8300, lon: 74.6400, pincode: '416410' },
          { name: 'Tasgaon', lat: 17.0300, lon: 74.6000, pincode: '416312' },
          { name: 'Walwa (Islampur)', lat: 17.0500, lon: 74.2700, pincode: '415409' },
          { name: 'Khanapur (Vita)', lat: 17.2700, lon: 74.5300, pincode: '415311' },
          { name: 'Jat', lat: 17.0500, lon: 75.3300, pincode: '416404' }
        ]
      },
      {
        name: 'Satara',
        lat: 17.6805,
        lon: 73.9997,
        talukas: [
          { name: 'Satara Sadar', lat: 17.6800, lon: 74.0000, pincode: '415001' },
          { name: 'Karad', lat: 17.2800, lon: 74.2000, pincode: '415110' },
          { name: 'Phaltan', lat: 17.9800, lon: 74.4300, pincode: '415523' },
          { name: 'Wai', lat: 17.9500, lon: 73.8800, pincode: '412803' },
          { name: 'Koregaon', lat: 17.7000, lon: 74.1700, pincode: '415501' }
        ]
      },
      {
        name: 'Jalgaon',
        lat: 21.0077,
        lon: 75.5626,
        talukas: [
          { name: 'Jalgaon City', lat: 21.0000, lon: 75.5600, pincode: '425001' },
          { name: 'Bhusawal', lat: 21.0500, lon: 75.7700, pincode: '425201' },
          { name: 'Raver', lat: 21.2500, lon: 76.0300, pincode: '425508' },
          { name: 'Chopda', lat: 21.2500, lon: 75.3000, pincode: '425107' },
          { name: 'Amalner', lat: 21.0500, lon: 75.0500, pincode: '425401' },
          { name: 'Chalisgaon', lat: 20.4700, lon: 75.0100, pincode: '424101' },
          { name: 'Pachora', lat: 20.6700, lon: 75.3500, pincode: '424201' }
        ]
      },
      {
        name: 'Nagpur',
        lat: 21.1458,
        lon: 79.0882,
        talukas: [
          { name: 'Nagpur Rural', lat: 21.1500, lon: 79.0900, pincode: '440001' },
          { name: 'Katol', lat: 21.2700, lon: 78.5800, pincode: '441302' },
          { name: 'Narkhed', lat: 21.3600, lon: 78.5300, pincode: '441304' },
          { name: 'Saoner', lat: 21.3800, lon: 78.9200, pincode: '441107' },
          { name: 'Umred', lat: 20.8500, lon: 79.3300, pincode: '441203' },
          { name: 'Ramtek', lat: 21.4000, lon: 79.3300, pincode: '441106' }
        ]
      },
      {
        name: 'Latur',
        lat: 18.4088,
        lon: 76.5604,
        talukas: [
          { name: 'Latur Block', lat: 18.4100, lon: 76.5600, pincode: '413512' },
          { name: 'Ausa', lat: 18.2500, lon: 76.5000, pincode: '413520' },
          { name: 'Nilanga', lat: 18.1300, lon: 76.7500, pincode: '413521' },
          { name: 'Udgir', lat: 18.3900, lon: 77.1200, pincode: '413517' },
          { name: 'Ahmedpur', lat: 18.7000, lon: 76.9300, pincode: '413515' }
        ]
      },
      {
        name: 'Yavatmal',
        lat: 20.3888,
        lon: 78.1204,
        talukas: [
          { name: 'Yavatmal Sadar', lat: 20.3900, lon: 78.1200, pincode: '445001' },
          { name: 'Pusad', lat: 19.9100, lon: 77.5800, pincode: '445204' },
          { name: 'Umarkhed', lat: 19.6000, lon: 77.7000, pincode: '445206' },
          { name: 'Darwha', lat: 20.3200, lon: 77.7700, pincode: '445202' },
          { name: 'Wani', lat: 20.0700, lon: 78.9500, pincode: '445304' }
        ]
      },
      {
        name: 'Buldhana',
        lat: 20.5300,
        lon: 76.1800,
        talukas: [
          { name: 'Buldhana City', lat: 20.5300, lon: 76.1800, pincode: '443001' },
          { name: 'Khamgaon', lat: 20.6800, lon: 76.5700, pincode: '444303' },
          { name: 'Malkapur', lat: 20.8800, lon: 76.2000, pincode: '443101' },
          { name: 'Shegaon', lat: 20.7900, lon: 76.6900, pincode: '444203' },
          { name: 'Chikhli', lat: 20.3500, lon: 76.2500, pincode: '443201' }
        ]
      }
    ]
  },

  // 2. PUNJAB (Granary of India)
  {
    name: 'Punjab',
    code: 'PB',
    districts: [
      {
        name: 'Ludhiana',
        lat: 30.9010,
        lon: 75.8573,
        talukas: [
          { name: 'Khanna', lat: 30.7073, lon: 76.2167, pincode: '141401' },
          { name: 'Jagraon', lat: 30.7800, lon: 75.4800, pincode: '142026' },
          { name: 'Samrala', lat: 30.8300, lon: 76.1800, pincode: '141114' },
          { name: 'Ludhiana West', lat: 30.9100, lon: 75.8500, pincode: '141001' }
        ]
      },
      {
        name: 'Bathinda',
        lat: 30.2110,
        lon: 74.9455,
        talukas: [
          { name: 'Bathinda Urban', lat: 30.2100, lon: 74.9500, pincode: '151001' },
          { name: 'Rampura Phul', lat: 30.2700, lon: 75.2300, pincode: '151103' },
          { name: 'Talwandi Sabo', lat: 29.9800, lon: 75.0800, pincode: '151302' },
          { name: 'Maur Mandi', lat: 30.0800, lon: 75.2300, pincode: '151509' }
        ]
      },
      {
        name: 'Amritsar',
        lat: 31.6340,
        lon: 74.8723,
        talukas: [
          { name: 'Amritsar I', lat: 31.6300, lon: 74.8700, pincode: '143001' },
          { name: 'Ajnala', lat: 31.8400, lon: 74.7600, pincode: '143102' },
          { name: 'Baba Bakala', lat: 31.5500, lon: 75.2500, pincode: '143201' }
        ]
      },
      {
        name: 'Patiala',
        lat: 30.3398,
        lon: 76.3869,
        talukas: [
          { name: 'Patiala Block', lat: 30.3400, lon: 76.3900, pincode: '147001' },
          { name: 'Nabha', lat: 30.3700, lon: 76.1500, pincode: '147201' },
          { name: 'Samana', lat: 30.1500, lon: 76.1900, pincode: '147101' },
          { name: 'Rajpura', lat: 30.4800, lon: 76.5900, pincode: '140401' }
        ]
      },
      {
        name: 'Sangrur',
        lat: 30.2458,
        lon: 75.8421,
        talukas: [
          { name: 'Sangrur Sadar', lat: 30.2500, lon: 75.8400, pincode: '148001' },
          { name: 'Sunam', lat: 30.1300, lon: 75.8000, pincode: '148028' },
          { name: 'Dhuri', lat: 30.3700, lon: 75.8700, pincode: '148024' },
          { name: 'Malerkotla', lat: 30.5200, lon: 75.8800, pincode: '148023' }
        ]
      }
    ]
  },

  // 3. MADHYA PRADESH (Soybean & Wheat Capital)
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    districts: [
      {
        name: 'Indore',
        lat: 22.7196,
        lon: 75.8577,
        talukas: [
          { name: 'Indore Central', lat: 22.7200, lon: 75.8600, pincode: '452001' },
          { name: 'Mhow (Ambedkar Nagar)', lat: 22.5500, lon: 75.7600, pincode: '453441' },
          { name: 'Sanwer', lat: 22.9700, lon: 75.8300, pincode: '453551' },
          { name: 'Depalpur', lat: 22.8500, lon: 75.5500, pincode: '453115' }
        ]
      },
      {
        name: 'Ujjain',
        lat: 23.1765,
        lon: 75.7885,
        talukas: [
          { name: 'Ujjain Block', lat: 23.1800, lon: 75.7900, pincode: '456001' },
          { name: 'Badnagar', lat: 23.0600, lon: 75.3800, pincode: '456771' },
          { name: 'Nagda', lat: 23.4500, lon: 75.4200, pincode: '456335' },
          { name: 'Mahidpur', lat: 23.4800, lon: 75.6500, pincode: '456443' },
          { name: 'Tarana', lat: 23.2000, lon: 76.0400, pincode: '456665' }
        ]
      },
      {
        name: 'Dhar',
        lat: 22.5978,
        lon: 75.2985,
        talukas: [
          { name: 'Dhar City', lat: 22.6000, lon: 75.3000, pincode: '454001' },
          { name: 'Badnawar', lat: 23.0200, lon: 75.2200, pincode: '454660' },
          { name: 'Sardarput', lat: 22.6800, lon: 74.9800, pincode: '454111' },
          { name: 'Manawar', lat: 22.2300, lon: 75.0800, pincode: '454446' }
        ]
      },
      {
        name: 'Hoshangabad (Narmadapuram)',
        lat: 22.7519,
        lon: 77.7289,
        talukas: [
          { name: 'Narmadapuram Block', lat: 22.7500, lon: 77.7300, pincode: '461001' },
          { name: 'Itarsi', lat: 22.6100, lon: 77.7600, pincode: '461111' },
          { name: 'Pipariya', lat: 22.7600, lon: 78.3500, pincode: '461775' },
          { name: 'Sohagpur', lat: 22.7000, lon: 78.2000, pincode: '461771' }
        ]
      }
    ]
  },

  // 4. GUJARAT (Cotton & Groundnut Zone)
  {
    name: 'Gujarat',
    code: 'GJ',
    districts: [
      {
        name: 'Rajkot',
        lat: 22.3039,
        lon: 70.8022,
        talukas: [
          { name: 'Rajkot Taluka', lat: 22.3000, lon: 70.8000, pincode: '360001' },
          { name: 'Gondal', lat: 21.9600, lon: 70.8000, pincode: '360311' },
          { name: 'Jetpur', lat: 21.7500, lon: 70.6200, pincode: '360370' },
          { name: 'Dhoraji', lat: 21.7300, lon: 70.4500, pincode: '360410' },
          { name: 'Jasdan', lat: 22.0300, lon: 71.2000, pincode: '360050' }
        ]
      },
      {
        name: 'Junagadh',
        lat: 21.5222,
        lon: 70.4579,
        talukas: [
          { name: 'Junagadh City', lat: 21.5200, lon: 70.4600, pincode: '362001' },
          { name: 'Keshod', lat: 21.3000, lon: 70.2500, pincode: '362220' },
          { name: 'Mangrol', lat: 21.1200, lon: 70.1200, pincode: '362225' },
          { name: 'Visavadar', lat: 21.3500, lon: 70.7000, pincode: '362130' }
        ]
      },
      {
        name: 'Surat',
        lat: 21.1702,
        lon: 72.8311,
        talukas: [
          { name: 'Bardoli', lat: 21.1200, lon: 73.1100, pincode: '394601' },
          { name: 'Mandvi', lat: 21.2500, lon: 73.3000, pincode: '394160' },
          { name: 'Kamrej', lat: 21.2700, lon: 72.9600, pincode: '394185' }
        ]
      }
    ]
  },

  // 5. HARYANA (Wheat & Basmati Hub)
  {
    name: 'Haryana',
    code: 'HR',
    districts: [
      {
        name: 'Karnal',
        lat: 29.6857,
        lon: 76.9905,
        talukas: [
          { name: 'Karnal Block', lat: 29.6900, lon: 76.9900, pincode: '132001' },
          { name: 'Gharaunda', lat: 29.5400, lon: 76.9700, pincode: '132114' },
          { name: 'Assandh', lat: 29.5200, lon: 76.6000, pincode: '132039' },
          { name: 'Indri', lat: 29.8800, lon: 77.0600, pincode: '132041' }
        ]
      },
      {
        name: 'Hisar',
        lat: 29.1492,
        lon: 75.7217,
        talukas: [
          { name: 'Hisar Sadar', lat: 29.1500, lon: 75.7200, pincode: '125001' },
          { name: 'Hansi', lat: 29.1000, lon: 75.9600, pincode: '125033' },
          { name: 'Barwala', lat: 29.3800, lon: 75.9100, pincode: '125121' },
          { name: 'Narnaund', lat: 29.2200, lon: 76.1400, pincode: '125039' }
        ]
      },
      {
        name: 'Sirsa',
        lat: 29.5349,
        lon: 75.0298,
        talukas: [
          { name: 'Sirsa City', lat: 29.5300, lon: 75.0300, pincode: '125055' },
          { name: 'Ellenabad', lat: 29.4500, lon: 74.6500, pincode: '125102' },
          { name: 'Dabwali', lat: 29.9500, lon: 74.7200, pincode: '125104' },
          { name: 'Rania', lat: 29.5200, lon: 74.8300, pincode: '125076' }
        ]
      }
    ]
  },

  // 6. RAJASTHAN (Mustard & Pulses)
  {
    name: 'Rajasthan',
    code: 'RJ',
    districts: [
      {
        name: 'Kota',
        lat: 25.2138,
        lon: 75.8648,
        talukas: [
          { name: 'Kota Ladpura', lat: 25.2100, lon: 75.8600, pincode: '324001' },
          { name: 'Ramganj Mandi', lat: 24.6500, lon: 75.9500, pincode: '326519' },
          { name: 'Sangod', lat: 24.9200, lon: 76.2800, pincode: '325601' },
          { name: 'Digod', lat: 25.1700, lon: 76.1000, pincode: '325201' }
        ]
      },
      {
        name: 'Sri Ganganagar',
        lat: 29.9038,
        lon: 73.8772,
        talukas: [
          { name: 'Ganganagar Sadar', lat: 29.9000, lon: 73.8800, pincode: '335001' },
          { name: 'Suratgarh', lat: 29.3200, lon: 73.9000, pincode: '335804' },
          { name: 'Raisinghnagar', lat: 29.5300, lon: 73.4500, pincode: '335051' },
          { name: 'Anupgarh', lat: 29.1900, lon: 73.2100, pincode: '335701' }
        ]
      },
      {
        name: 'Jaipur',
        lat: 26.9124,
        lon: 75.7873,
        talukas: [
          { name: 'Chomu', lat: 27.1700, lon: 75.7200, pincode: '303702' },
          { name: 'Kotputli', lat: 27.7000, lon: 76.2000, pincode: '303108' },
          { name: 'Basssi', lat: 26.8300, lon: 76.0400, pincode: '303301' },
          { name: 'Chaksu', lat: 26.6000, lon: 75.9500, pincode: '303901' }
        ]
      }
    ]
  },

  // 7. KARNATAKA (Sugarcane & Coffee & Cotton)
  {
    name: 'Karnataka',
    code: 'KA',
    districts: [
      {
        name: 'Belagavi (Belgaum)',
        lat: 15.8497,
        lon: 74.4977,
        talukas: [
          { name: 'Belagavi Sadar', lat: 15.8500, lon: 74.5000, pincode: '590001' },
          { name: 'Chikkodi', lat: 16.4300, lon: 74.6000, pincode: '591201' },
          { name: 'Athani', lat: 16.7300, lon: 75.0500, pincode: '591304' },
          { name: 'Gokak', lat: 16.1700, lon: 74.8300, pincode: '591307' },
          { name: 'Bailhongal', lat: 15.8200, lon: 74.8500, pincode: '591102' }
        ]
      },
      {
        name: 'Dharwad',
        lat: 15.4589,
        lon: 75.0078,
        talukas: [
          { name: 'Hubballi', lat: 15.3600, lon: 75.1200, pincode: '580020' },
          { name: 'Dharwad Rural', lat: 15.4600, lon: 75.0100, pincode: '580001' },
          { name: 'Navalgund', lat: 15.5600, lon: 75.3600, pincode: '582208' },
          { name: 'Kalghatgi', lat: 15.1800, lon: 74.9700, pincode: '581114' }
        ]
      }
    ]
  },

  // 8. UTTAR PRADESH (Sugarcane & Paddy & Potato)
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    districts: [
      {
        name: 'Varanasi',
        lat: 25.3176,
        lon: 82.9739,
        talukas: [
          { name: 'Varanasi Sadar', lat: 25.3200, lon: 82.9700, pincode: '221001' },
          { name: 'Pindra', lat: 25.4800, lon: 82.8500, pincode: '221206' },
          { name: 'Raja Talab', lat: 25.2700, lon: 82.8700, pincode: '221311' }
        ]
      },
      {
        name: 'Agra',
        lat: 27.1767,
        lon: 78.0081,
        talukas: [
          { name: 'Agra Sadar', lat: 27.1800, lon: 78.0100, pincode: '282001' },
          { name: 'Fatehabad', lat: 27.0200, lon: 78.3000, pincode: '283111' },
          { name: 'Kheragarh', lat: 26.9500, lon: 77.8200, pincode: '283121' },
          { name: 'Bah', lat: 26.8700, lon: 78.6000, pincode: '283104' }
        ]
      },
      {
        name: 'Meerut',
        lat: 28.9845,
        lon: 77.7064,
        talukas: [
          { name: 'Meerut Sadar', lat: 28.9800, lon: 77.7100, pincode: '250001' },
          { name: 'Mawana', lat: 29.1000, lon: 77.9200, pincode: '250401' },
          { name: 'Sardhana', lat: 29.1500, lon: 77.6200, pincode: '250342' }
        ]
      }
    ]
  }
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
