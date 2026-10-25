// ==============================================================================
// KRISHIDRISHTI — AUTHENTIC CROP VISUALS & SOWN CROP PHOTO REGISTRY
// Verified high-definition crop photography corresponding to Indian agriculture.
// Strictly adheres to Zero Fake Data: maps crops to authentic, real visuals.
// ==============================================================================

export interface CropVisualMeta {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  aliases: string[];
  category: 'Oilseeds' | 'Cash Crops' | 'Cereals' | 'Pulses' | 'Vegetables' | 'Horticulture' | 'Spices';
  imageUrl: string;
  popularVarieties: string[];
  defaultHarvestDays: number;
  defaultWaterNeed: string;
  defaultStage: string;
}

export const CROP_VISUALS_REGISTRY: CropVisualMeta[] = [
  {
    id: 'soybean',
    name: 'Soybean',
    marathiName: 'सोयाबीन',
    hindiName: 'सोयाबीन',
    aliases: ['soya', 'soyabean', 'glycine max', 'सोयाबीन', 'सोया'],
    category: 'Oilseeds',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/A_field_of_Soy_beans_%28Glycine_max%29_%286160141423%29.jpg',
    popularVarieties: ['JS-335', 'JS-9305', 'Phule Kalyani (DS-228)', 'MACS 1407', 'NRC 37'],
    defaultHarvestDays: 95,
    defaultWaterNeed: 'Moderate (Critical at flowering/podding)',
    defaultStage: 'Vegetative'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    marathiName: 'कापूस',
    hindiName: 'कपास',
    aliases: ['kapas', 'bt cotton', 'gossypium', 'कापूस', 'कपास'],
    category: 'Cash Crops',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Ajit-155', 'Rasi Neo', 'Bhakti (Bt)', 'Suraj', 'Phule Anmol'],
    defaultHarvestDays: 160,
    defaultWaterNeed: 'Moderate to High (Drip recommended)',
    defaultStage: 'Squaring / Vegetative'
  },
  {
    id: 'onion',
    name: 'Onion',
    marathiName: 'कांदा',
    hindiName: 'प्याज',
    aliases: ['kanda', 'pyaj', 'allium cepa', 'कांदा', 'प्याज'],
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Gavran Red', 'Bhima Super', 'Bhima Shakti', 'Phule Samarth', 'AgriFound Dark Red'],
    defaultHarvestDays: 120,
    defaultWaterNeed: 'Regular / Frequent Light Irrigation',
    defaultStage: 'Bulb Formation'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    marathiName: 'गहू',
    hindiName: 'गेहूं',
    aliases: ['gehu', 'gahu', 'triticum', 'गहू', 'गेहूं'],
    category: 'Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Lokwan', 'GW-322', 'Sharbati', 'MACS 6222', 'Phule Samadhan'],
    defaultHarvestDays: 115,
    defaultWaterNeed: 'High (Critical at CRI and grain fill)',
    defaultStage: 'Tillering'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    marathiName: 'ऊस',
    hindiName: 'गन्ना',
    aliases: ['us', 'ganna', 'saccharum', 'ऊस', 'गन्ना'],
    category: 'Cash Crops',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Co 86032 (Nira)', 'CoM 0265 (Phule 265)', 'MS 10001', 'Co 94012'],
    defaultHarvestDays: 365,
    defaultWaterNeed: 'Very High (Drip fertigation optimal)',
    defaultStage: 'Formative / Tillering'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    marathiName: 'टोमॅटो',
    hindiName: 'टमाटर',
    aliases: ['tamatar', 'lycopersicon', 'टोमॅटो', 'टमाटर'],
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Abhinav (Seminis)', 'Saaho (Syngenta)', 'Phule Raja', 'Arka Rakshak'],
    defaultHarvestDays: 75,
    defaultWaterNeed: 'Moderate (Continuous moisture, Drip)',
    defaultStage: 'Flowering & Fruiting'
  },
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    marathiName: 'भात (धान)',
    hindiName: 'धान (चावल)',
    aliases: ['paddy', 'bhat', 'dhan', 'chawal', 'oryza sativa', 'भात', 'धान', 'चावल'],
    category: 'Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Indrayani', 'Wada Kolam', 'Basmati 1121', 'Jaya', 'Phule Samruddhi'],
    defaultHarvestDays: 125,
    defaultWaterNeed: 'Flooded / High Standing Water',
    defaultStage: 'Tillering'
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    marathiName: 'मका',
    hindiName: 'मक्का',
    aliases: ['corn', 'maka', 'makka', 'zea mays', 'मका', 'मक्का'],
    category: 'Cereals',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Pioneer 3396', 'DeKalb 9108', 'African Tall (Fodder)', 'Rajshree', 'Phule Maharshi'],
    defaultHarvestDays: 100,
    defaultWaterNeed: 'Moderate (Crucial at tasseling)',
    defaultStage: 'Knee-high Vegetative'
  },
  {
    id: 'tur',
    name: 'Pigeon Pea (Tur / Arhar)',
    marathiName: 'तूर',
    hindiName: 'अरहर (तूर)',
    aliases: ['pigeonpea', 'arhar', 'toor', 'tur', 'cajanus cajan', 'तूर', 'अरहर'],
    category: 'Pulses',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cajanus_cajan_plant.jpg',
    popularVarieties: ['BDN-711', 'BSMR-736', 'Maruti (ICP-8863)', 'Phule Rajeshwari'],
    defaultHarvestDays: 155,
    defaultWaterNeed: 'Low to Moderate (Deep rooted)',
    defaultStage: 'Branching / Flowering'
  },
  {
    id: 'gram',
    name: 'Chickpea (Gram / Chana)',
    marathiName: 'हरभरा (चना)',
    hindiName: 'चना',
    aliases: ['chana', 'chickpea', 'harbhara', 'bengal gram', 'cicer arietinum', 'हरभरा', 'चना'],
    category: 'Pulses',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Chickpea_field.jpg',
    popularVarieties: ['Vijay', 'Digvijay', 'Jaki 9218', 'Phule Vikram', 'Kabuli PKV-2'],
    defaultHarvestDays: 105,
    defaultWaterNeed: 'Low (Tolerates dry spells)',
    defaultStage: 'Pod Development'
  },
  {
    id: 'chilli',
    name: 'Chilli (Mirchi)',
    marathiName: 'मिरची',
    hindiName: 'मिर्च',
    aliases: ['chili', 'mirch', 'mirchi', 'capsicum', 'मिरची', 'मिर्च'],
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Sitara', 'G-4 (Bhagyalakshmi)', 'Byadgi', 'Phule Jyoti', 'Armoor'],
    defaultHarvestDays: 90,
    defaultWaterNeed: 'Moderate (Frequent light irrigation)',
    defaultStage: 'Flowering & Fruiting'
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    marathiName: 'भुईमूग',
    hindiName: 'मूंगफली',
    aliases: ['peanut', 'bhuimug', 'mungfali', 'arachis hypogaea', 'भुईमूग', 'मूंगफली'],
    category: 'Oilseeds',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Groundnut_field.jpg',
    popularVarieties: ['TAG-24', 'TG-37A', 'Phule Unnati', 'JL-24 (Phule Pragati)', 'KDG-128'],
    defaultHarvestDays: 110,
    defaultWaterNeed: 'Moderate (Critical at pegging/pod fill)',
    defaultStage: 'Pegging / Pod Formation'
  },
  {
    id: 'banana',
    name: 'Banana',
    marathiName: 'केळी',
    hindiName: 'केला',
    aliases: ['keli', 'kela', 'musa', 'केळी', 'केला'],
    category: 'Horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Grand Naine (G-9)', 'Shrimanti', 'Basrai', 'Robusta', 'Elakki'],
    defaultHarvestDays: 330,
    defaultWaterNeed: 'High (Strict Drip Schedule)',
    defaultStage: 'Shooting / Bunch Development'
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    marathiName: 'डाळिंब',
    hindiName: 'अनार',
    aliases: ['dalimb', 'anar', 'punica granatum', 'डाळिंब', 'अनार'],
    category: 'Horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Bhagwa (Sindhuri)', 'Arakta', 'Ganesh', 'Ruby'],
    defaultHarvestDays: 165,
    defaultWaterNeed: 'Regulated Deficit (Bahar treatment)',
    defaultStage: 'Fruit Sizing'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    marathiName: 'आले',
    hindiName: 'अदरक',
    aliases: ['ale', 'adrak', 'zingiber officinale', 'आले', 'अदरक'],
    category: 'Spices',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Mahim', 'Varada', 'Rio-de-Janeiro', 'Suprabha'],
    defaultHarvestDays: 240,
    defaultWaterNeed: 'High (Humid / Drip with mulch)',
    defaultStage: 'Rhizome Development'
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    marathiName: 'हळद',
    hindiName: 'हल्दी',
    aliases: ['halad', 'haldi', 'curcuma longa', 'हळद', 'हल्दी'],
    category: 'Spices',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Turmeric_plant.jpg',
    popularVarieties: ['Selam (Salem)', 'Waigaon', 'Prabha', 'Prathibha', 'Phule Swaroop'],
    defaultHarvestDays: 255,
    defaultWaterNeed: 'Moderate to High (Raised bed drip)',
    defaultStage: 'Rhizome Maturation'
  },
  {
    id: 'potato',
    name: 'Potato',
    marathiName: 'बटाटा',
    hindiName: 'आलू',
    aliases: ['batata', 'alu', 'aalu', 'solanum tuberosum', 'बटाटा', 'आलू'],
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Kufri Pukhraj', 'Kufri Jyoti', 'Kufri Chipsona', 'Kufri Surya'],
    defaultHarvestDays: 85,
    defaultWaterNeed: 'Medium Frequent (Furrow / Sprinkler)',
    defaultStage: 'Tuber Bulking'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    marathiName: 'लसूण',
    hindiName: 'लहसुन',
    aliases: ['lasun', 'lahsun', 'allium sativum', 'लसूण', 'लहसुन'],
    category: 'Spices',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['G-41', 'Phule Nilima', 'Yamuna Safed (G-1)', 'Bhima Omkar'],
    defaultHarvestDays: 130,
    defaultWaterNeed: 'Moderate (Light frequent watering)',
    defaultStage: 'Clove Enlargement'
  },
  {
    id: 'mango',
    name: 'Mango',
    marathiName: 'आंबा',
    hindiName: 'आम',
    aliases: ['amba', 'aam', 'alphonso', 'hapus', 'mangifera indica', 'आंबा', 'आम'],
    category: 'Horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Hapus (Alphonso)', 'Kesar', 'Dasheri', 'Totapuri', 'Ratna'],
    defaultHarvestDays: 120,
    defaultWaterNeed: 'Low to Moderate (Drip near canopy)',
    defaultStage: 'Fruit Sizing'
  },
  {
    id: 'grapes',
    name: 'Grapes',
    marathiName: 'द्राक्षे',
    hindiName: 'अंगूर',
    aliases: ['draksha', 'angur', 'vitis vinifera', 'द्राक्षे', 'अंगूर'],
    category: 'Horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Thompson Seedless', 'Sharad Seedless', 'Tas-A-Ganesh', 'Manik Chaman', 'Anab-e-Shahi'],
    defaultHarvestDays: 135,
    defaultWaterNeed: 'Measured Drip (Berry development)',
    defaultStage: 'Veraison / Berry Sizing'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    marathiName: 'मोहरी',
    hindiName: 'सरसों',
    aliases: ['mohari', 'sarson', 'rai', 'brassica', 'मोहरी', 'सरसों'],
    category: 'Oilseeds',
    imageUrl: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80',
    popularVarieties: ['Pusa Bold', 'Varuna (T-59)', 'Kranti', 'Pusa Mustard 25'],
    defaultHarvestDays: 110,
    defaultWaterNeed: 'Low to Moderate',
    defaultStage: 'Flowering / Podding'
  },
  {
    id: 'jowar',
    name: 'Jowar (Sorghum)',
    marathiName: 'ज्वारी',
    hindiName: 'ज्वार',
    aliases: ['jowar', 'jwari', 'sorghum', 'sorghum bicolor', 'ज्वारी', 'ज्वार'],
    category: 'Cereals',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Sorghum_field.jpg',
    popularVarieties: ['Maldandi (M 35-1)', 'Phule Revati', 'Phule Vasudha', 'CSH 14', 'Parbhani Moti'],
    defaultHarvestDays: 120,
    defaultWaterNeed: 'Drought Tolerant (Low to Moderate)',
    defaultStage: 'Grain Filling'
  },
  {
    id: 'bajra',
    name: 'Bajra (Pearl Millet)',
    marathiName: 'बाजरी',
    hindiName: 'बाजरा',
    aliases: ['bajra', 'bajri', 'pearl millet', 'pennisetum glaucum', 'बाजरी', 'बाजरा'],
    category: 'Cereals',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Pennisetum_glaucum_%284657009324%29.jpg',
    popularVarieties: ['Shradha (RHRBH 8609)', 'Saburi', 'Dhanshakti', 'ICTP 8203', 'Phule Adishakti'],
    defaultHarvestDays: 85,
    defaultWaterNeed: 'Very Low (Thrives in semi-arid zones)',
    defaultStage: 'Head Emergence'
  },
  {
    id: 'moong',
    name: 'Green Gram (Moong)',
    marathiName: 'मूग',
    hindiName: 'मूंग',
    aliases: ['moong', 'mug', 'green gram', 'vigna radiata', 'मूग', 'मूंग'],
    category: 'Pulses',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Mung_beans_%28Vigna_radiata%29.jpg',
    popularVarieties: ['Vaibhav', 'BM-2002-1', 'BM-4', 'PKV Green Gold', 'Kopergaon'],
    defaultHarvestDays: 68,
    defaultWaterNeed: 'Low to Moderate',
    defaultStage: 'Pod Setting'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    marathiName: 'सूर्यफूल',
    hindiName: 'सूरजमुखी',
    aliases: ['suryaphul', 'surajmukhi', 'sunflower', 'helianthus annuus', 'सूर्यफूल', 'सूरजमुखी'],
    category: 'Oilseeds',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Helianthus_annuus_field.jpg',
    popularVarieties: ['Phule Bhaskar', 'KBSH-1', 'DRSH-1', 'MSFH-17', 'KBSH-44'],
    defaultHarvestDays: 90,
    defaultWaterNeed: 'Moderate (Critical at button stage)',
    defaultStage: 'Capitulum / Flowering'
  }
];

export const DEFAULT_CROP_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

// Known generic placeholders to replace automatically
const GENERIC_PLACEHOLDERS = [
  'photo-1500937386664-56d1dfef3854', // Tractor in empty field
  'photo-1599582296065-272e61678564'  // Old 404 unsplash link
];

/**
 * Intelligently resolve the most accurate, authentic crop photo given
 * an arbitrary user-entered crop name, variety, or description.
 */
export function getCropVisual(cropNameOrKeyword?: string): {
  imageUrl: string;
  meta?: CropVisualMeta;
  matchedName: string;
} {
  if (!cropNameOrKeyword || typeof cropNameOrKeyword !== 'string') {
    return {
      imageUrl: DEFAULT_CROP_IMAGE,
      matchedName: 'Cultivated Crop'
    };
  }

  const query = cropNameOrKeyword.toLowerCase().trim();

  // 1. Direct match on id, name, marathiName, or hindiName
  for (const crop of CROP_VISUALS_REGISTRY) {
    if (
      query === crop.id.toLowerCase() ||
      query === crop.name.toLowerCase() ||
      query === crop.marathiName.toLowerCase() ||
      query === crop.hindiName.toLowerCase()
    ) {
      return { imageUrl: crop.imageUrl, meta: crop, matchedName: crop.name };
    }
  }

  // 2. Exact match in aliases
  for (const crop of CROP_VISUALS_REGISTRY) {
    if (crop.aliases.some(a => a.toLowerCase() === query)) {
      return { imageUrl: crop.imageUrl, meta: crop, matchedName: crop.name };
    }
  }

  // 3. Substring match (e.g., "Soybean (JS-335)", "BT Cotton 155", "लाल कांदा (Nashik)")
  for (const crop of CROP_VISUALS_REGISTRY) {
    // Check aliases
    for (const alias of crop.aliases) {
      if (query.includes(alias.toLowerCase())) {
        return { imageUrl: crop.imageUrl, meta: crop, matchedName: crop.name };
      }
    }
    // Check main names
    if (
      query.includes(crop.name.toLowerCase()) ||
      query.includes(crop.marathiName.toLowerCase()) ||
      query.includes(crop.hindiName.toLowerCase())
    ) {
      return { imageUrl: crop.imageUrl, meta: crop, matchedName: crop.name };
    }
  }

  // Fallback to default authentic crop farm photo
  return {
    imageUrl: DEFAULT_CROP_IMAGE,
    matchedName: cropNameOrKeyword
  };
}

/**
 * Validates whether an existing plot photo is a placeholder that should be upgraded
 * to the authentic crop visual.
 */
export function resolvePlotPhoto(currentPhotoUrl: string | undefined | null, cropName: string): string {
  if (!currentPhotoUrl) {
    return getCropVisual(cropName).imageUrl;
  }

  // If the photo is one of the old generic tractor placeholders, replace with real crop photo
  for (const placeholder of GENERIC_PLACEHOLDERS) {
    if (currentPhotoUrl.includes(placeholder)) {
      return getCropVisual(cropName).imageUrl;
    }
  }

  return currentPhotoUrl;
}
