import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Landmark, 
  Droplets, 
  Sun, 
  CreditCard, 
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { KisanHelplineBar } from '../components/KisanHelplineBar';

interface SchemeItem {
  id: string;
  category: 'dbt' | 'subsidies' | 'insurance' | 'land_soil';
  badge: { en: string; hi: string; mr: string };
  title: { en: string; hi: string; mr: string };
  tagline: { en: string; hi: string; mr: string };
  benefit: { en: string; hi: string; mr: string };
  eligibility: { en: string; hi: string; mr: string };
  documents: { en: string[]; hi: string[]; mr: string[] };
  howToApply: { en: string; hi: string; mr: string };
  helpline?: string;
  portalUrl: string;
  isCentral: boolean;
}

export const GovtPortalsGuide: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dbt' | 'subsidies' | 'insurance' | 'land_soil'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const schemes: SchemeItem[] = [
    {
      id: 'pm-kisan',
      category: 'dbt',
      badge: {
        en: 'Central Direct Income Transfer',
        hi: 'केंद्रीय प्रत्यक्ष आय सहायता',
        mr: 'केंद्रीय थेट आर्थिक सहाय्य'
      },
      title: {
        en: 'PM-KISAN Samman Nidhi',
        hi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
        mr: 'पीएम-किसान सन्मान निधी योजना'
      },
      tagline: {
        en: 'Direct ₹6,000 annual income support to all eligible farmer families in 3 equal installments.',
        hi: 'पात्र किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता 3 किस्तों में।',
        mr: 'पात्र शेतकरी कुटुंबांना दरवर्षी ₹६,००० चे थेट आर्थिक सहाय्य ३ हप्त्यांमध्ये (दर ४ महिन्यांनी ₹२,०००).'
      },
      benefit: {
        en: '₹2,000 transferred every 4 months directly into your Aadhaar-linked bank account (DBT) with zero intermediary cuts.',
        hi: 'हर 4 महीने में ₹2,000 सीधे आपके आधार-लिंक्ड बैंक खाते (DBT) में बिना किसी बिचौलिए के भेजे जाते हैं।',
        mr: 'दर ४ महिन्यांनी थेट आधार-संलग्न बँक खात्यात ₹२,००० जमा होतात (कोणत्याही मध्यस्थाशिवाय १००% पारदर्शक).'
      },
      eligibility: {
        en: 'All landholding farmer families having cultivable agricultural land registered in state land revenue records.',
        hi: 'वे सभी किसान परिवार जिनके नाम पर राज्य भू-अभिलेख में कृषि योग्य भूमि दर्ज है।',
        mr: 'ज्यांच्या नावावर महसूल नोंदीत (७/१२) शेतजमीन आहे अशी सर्व शेतकरी कुटुंबे.'
      },
      documents: {
        en: ['Aadhaar Card (linked to active mobile number)', 'Updated 7/12 Land Record', 'Bank Passbook with active NPCI/Aadhaar seeding'],
        hi: ['आधार कार्ड (सक्रिय मोबाइल नंबर से लिंक)', 'अद्यतन 7/12 भू-अभिलेख', 'NPCI/आधार से जुड़ा सक्रिय बैंक खाता'],
        mr: ['आधार कार्ड (मोबाईल नंबर लिंक असलेले)', 'अद्ययावत ७/१२ व ८-अ उतारा', 'NPCI/आधार सीडिंग असलेले बँक पासबुक']
      },
      howToApply: {
        en: 'Complete online e-KYC on the PM-Kisan portal via Aadhaar OTP, or visit your nearest Common Service Centre (CSC / Aaple Sarkar).',
        hi: 'पीएम-किसान पोर्टल पर आधार ओटीपी के जरिए ऑनलाइन ई-केवाईसी पूरी करें या नजदीकी सीएससी (CSC) केंद्र पर जाएं।',
        mr: 'पीएम-किसान पोर्टलवर आधार ओटीपीद्वारे ई-केवायसी पूर्ण करा किंवा जवळच्या सीएससी (आपले सरकार) केंद्रावर जाऊन अर्ज करा.'
      },
      helpline: '155261 / 011-24300606',
      portalUrl: 'https://pmkisan.gov.in',
      isCentral: true
    },
    {
      id: 'mahadbt',
      category: 'subsidies',
      badge: {
        en: 'Maharashtra State Single-Window',
        hi: 'महाराष्ट्र राज्य एकल-खिड़की पोर्टल',
        mr: 'महाराष्ट्र शासन एकल-खिडकी पोर्टल'
      },
      title: {
        en: 'MahaDBT Farmer Schemes Portal',
        hi: 'महाडीबीटी किसान योजना पोर्टल (महाराष्ट्र)',
        mr: 'महाडीबीटी शेतकरी योजना पोर्टल (महाराष्ट्र)'
      },
      tagline: {
        en: 'Unified subsidy application for Drip Irrigation, Farm Ponds, Tractors, and Agricultural Machinery in Maharashtra.',
        hi: 'महाराष्ट्र में ड्रिप सिंचाई, शेततले, ट्रैक्टर और कृषि उपकरणों पर सब्सिडी के लिए एकीकृत पोर्टल।',
        mr: 'ठिबक/तुषार सिंचन, शेततळे, ट्रॅक्टर आणि कृषी अवजारांवर ८०% पर्यंत अनुदानासाठी महाराष्ट्र शासनाचे अधिकृत पोर्टल.'
      },
      benefit: {
        en: 'Up to 80% capital subsidy on Drip/Sprinkler systems (PMKSY), Farm Ponds (Magel Tyala Shettale), and Farm Mechanization.',
        hi: 'ड्रिप/स्प्रिंकलर सिंचाई (PMKSY), शेततले और आधुनिक कृषि यंत्रों पर 80% तक की भारी सरकारी सब्सिडी।',
        mr: 'ठिबक/तुषार सिंचनासाठी ८०% पर्यंत अनुदान, मागेल त्याला शेततळे, शेडनेट हाऊस, ट्रॅक्टर व रोटाव्हेटरवर थेट अनुदान.'
      },
      eligibility: {
        en: 'Resident farmers of Maharashtra holding valid digitized 7/12 and 8-A certificates.',
        hi: 'महाराष्ट्र के किसान जिनके पास वैध डिजिटल 7/12 और 8-A प्रमाणपत्र है।',
        mr: 'महाराष्ट्रातील रहिवासी शेतकरी ज्यांच्याकडे वैध डिजिटल ७/१२ व ८-अ नोंद आहे.'
      },
      documents: {
        en: ['Digitized 7/12 and 8-A extracts', 'Aadhaar Card', 'Cancelled Cheque / Bank Passbook', 'Authorized Dealer Quotation & GST invoice'],
        hi: ['डिजिटल 7/12 और 8-A खतौनी', 'आधार कार्ड', 'बैंक पासबुक या कैंसिल चेक', 'अधिकृत डीलर का कोटेशन और जीएसटी बिल'],
        mr: ['डिजिटल स्वाक्षरीत ७/१२ व ८-अ उतारा', 'आधार कार्ड', 'बँक पासबुक / रद्द केलेला धनादेश', 'अधिकृत विक्रेत्याचे कोटेशन व जीएसटी बिल']
      },
      howToApply: {
        en: 'Register with your Aadhaar on MahaDBT portal, select the Agriculture Department tab, choose desired components, and pay the nominal application fee.',
        hi: 'महाडीबीटी पोर्टल पर आधार से लॉगिन करें, कृषि विभाग चुनें, इच्छित योजना घटक चुनें और ऑनलाइन आवेदन जमा करें।',
        mr: 'महाडीबीटी पोर्टलवर आधार क्रमांकाने नोंदणी करा, "शेतकरी योजना" टॅब निवडून हव्या असलेल्या घटकासाठी ऑनलाईन अर्ज सादर करा.'
      },
      helpline: '022-49150800',
      portalUrl: 'https://mahadbt.maharashtra.gov.in',
      isCentral: false
    },
    {
      id: 'pmfby',
      category: 'insurance',
      badge: {
        en: '₹1 Token Premium Scheme (MH)',
        hi: '₹1 टोकन प्रीमियम फसल बीमा (महाराष्ट्र)',
        mr: '१ रुपयात पीक विमा योजना (महाराष्ट्र)'
      },
      title: {
        en: 'PM Fasal Bima Yojana (PMFBY)',
        hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
        mr: 'प्रधानमंत्री पीक विमा योजना (PMFBY)'
      },
      tagline: {
        en: 'Comprehensive financial protection against crop loss from unseasonal rains, drought, pests, and natural calamities.',
        hi: 'असमय बारिश, सूखा, कीट प्रकोप और प्राकृतिक आपदाओं से फसल नुकसान पर संपूर्ण आर्थिक सुरक्षा।',
        mr: 'अवकाळी पाऊस, दुष्काळ, कीड-रोग आणि नैसर्गिक आपत्तींमुळे होणाऱ्या नुकसानीविरुद्ध संपूर्ण आर्थिक संरक्षण.'
      },
      benefit: {
        en: 'In Maharashtra, farmers pay only ₹1 token premium per crop while full remaining premium is borne by state and central governments.',
        hi: 'महाराष्ट्र में किसानों को केवल ₹1 टोकन प्रीमियम देना होता है; शेष सारा प्रीमियम केंद्र व राज्य सरकार भरती है।',
        mr: 'महाराष्ट्रात शेतकऱ्यांना केवळ ₹१ टोकन भरून संपूर्ण पिकाचा विमा मिळतो. उर्वरित संपूर्ण हप्ता शासन भरते.'
      },
      eligibility: {
        en: 'All loanee and non-loanee farmers cultivating notified crops in notified talukas/villages.',
        hi: 'अधिसूचित क्षेत्रों में अधिसूचित फसलों की खेती करने वाले सभी ऋणी व गैर-ऋणी किसान।',
        mr: 'अधिसूचित क्षेत्रात अधिसूचित पिके घेणारे सर्व खातेदार व भाडेकरू शेतकरी.'
      },
      documents: {
        en: ['Crop Sowing Self-Declaration / Panchanama', 'Current 7/12 with crop entry', 'Aadhaar Card', 'Bank Account details'],
        hi: ['फसल बुवाई स्व-घोषणा पत्र', 'वर्तमान 7/12 जिसमें फसल दर्ज हो', 'आधार कार्ड', 'बैंक खाता विवरण'],
        mr: ['पीक पेरणी स्वयंघोषणापत्र', 'पिकाची नोंद असलेला चालू ७/१२', 'आधार कार्ड', 'बँक खाते तपशील']
      },
      howToApply: {
        en: 'Apply through PMFBY portal or CSC center before season cutoff. For localized crop damage, report within 72 hours via Crop Insurance App.',
        hi: 'सत्र समाप्ति से पहले PMFBY पोर्टल या CSC से आवेदन करें। स्थानीय फसल क्षति की स्थिति में 72 घंटे के भीतर ऐप पर सूचना दें।',
        mr: 'अंतिम मुदतीपूर्वी पीएमएफबीवाय पोर्टल किंवा सीएससीवरून अर्ज करा. स्थानिक नुकसान झाल्यास ७२ तासांच्या आत ॲपवर तक्रार नोंदवा.'
      },
      helpline: '14447 (Toll-Free PMFBY)',
      portalUrl: 'https://pmfby.gov.in',
      isCentral: true
    },
    {
      id: 'kcc',
      category: 'dbt',
      badge: {
        en: 'Concessional Institutional Credit',
        hi: 'रियायती संस्थागत कृषि ऋण',
        mr: 'सवलतीच्या दरातील पीक कर्ज'
      },
      title: {
        en: 'Kisan Credit Card (KCC)',
        hi: 'किसान क्रेडिट कार्ड (KCC)',
        mr: 'किसान क्रेडिट कार्ड (KCC - पीक कर्ज)'
      },
      tagline: {
        en: 'Short-term credit up to ₹3,00,000 for crop cultivation, post-harvest expenses, and farm maintenance.',
        hi: 'फसल की खेती, कटाई उपरांत खर्च और खेत रखरखाव के लिए ₹3,00,000 तक का अल्पकालिक ऋण।',
        mr: 'बियाणे, खते, मजुरी व पीक संगोपनासाठी ₹३ लाखांपर्यंत अत्यंत सवलतीच्या ४% व्याजदराने खेळते भांडवल.'
      },
      benefit: {
        en: 'Effective interest rate of only 4% per annum upon prompt repayment (7% base minus 3% prompt repayment incentive).',
        hi: 'समय पर पुनर्भुगतान करने पर केवल 4% प्रति वर्ष की प्रभावी ब्याज दर (7% आधार - 3% प्रोत्साहन छूट)।',
        mr: 'वेळेवर परतफेड केल्यास केवळ ४% वार्षिक व्याजदर (७% मूळ दरावर ३% नियमित परतफेड प्रोत्साहन सूट).'
      },
      eligibility: {
        en: 'Individual farmers, joint cultivators, sharecroppers, tenant farmers, and Self Help Groups (SHGs).',
        hi: 'व्यक्तिगत किसान, संयुक्त काश्तकार, बटाईदार और स्वयं सहायता समूह (SHG)।',
        mr: 'सर्व वैयक्तिक खातेदार शेतकरी, कुळ शेतकरी, बटाईदार व शेतकरी उत्पादक गट (FPO).'
      },
      documents: {
        en: ['Application Form', 'Land record proof (7/12 & 8-A)', 'Identity Proof (Aadhaar/Voter ID)', 'No-Dues Certificate from other banks'],
        hi: ['आवेदन पत्र', 'भू-स्वामित्व प्रमाण (7/12 व 8-A)', 'पहचान प्रमाण (आधार/वोटर आईडी)', 'अन्य बैंकों का नो-ड्यूज प्रमाण'],
        mr: ['कर्ज मागणी अर्ज', 'जमीन मालकी पुरावा (७/१२ व ८-अ)', 'ओळख पुरावा (आधार/मतदान कार्ड)', 'इतर बँकांचे थकबाकी नसलेले दाखले']
      },
      howToApply: {
        en: 'Submit one-page KCC form at your local bank branch (commercial, cooperative, or RRB) or apply online through PM-Kisan linked KCC portal.',
        hi: 'अपनी स्थानीय बैंक शाखा में एक पेज का KCC फॉर्म जमा करें या पीएम-किसान पोर्टल से ऑनलाइन आवेदन करें।',
        mr: 'आपल्या गावातील राष्ट्रीयीकृत किंवा जिल्हा मध्यवर्ती सहकारी बँकेत एक पानी अर्ज सादर करा.'
      },
      helpline: '1800-180-1551 (KCC Helpline)',
      portalUrl: 'https://myscheme.gov.in/schemes/kcc',
      isCentral: true
    },
    {
      id: 'pm-kusum',
      category: 'subsidies',
      badge: {
        en: 'Daytime Solar Irrigation Subsidy',
        hi: 'दिन के समय सौर सिंचाई योजना',
        mr: 'दिवसा सिंचनासाठी सौर कृषी पंप'
      },
      title: {
        en: 'PM-KUSUM Solar Agriculture Pump',
        hi: 'पीएम-कुसुम सौर कृषि पंप योजना',
        mr: 'पीएम-कुसुम सौर कृषी पंप योजना (महाकृषी ऊर्जा)'
      },
      tagline: {
        en: 'Up to 90% subsidy for installing 3 HP, 5 HP, and 7.5 HP off-grid solar pumps for daytime irrigation.',
        hi: 'दिन में सुनिश्चित सिंचाई के लिए 3, 5 और 7.5 एचपी स्टैंडअलोन सोलर पंपों पर 90% तक की भारी छूट।',
        mr: 'विजेच्या लपंडावातून मुक्ती! ३, ५ आणि ७.५ एचपी सौर कृषी पंपांवर ९०% पर्यंत शासकीय अनुदान.'
      },
      benefit: {
        en: 'Farmers pay only 10% of the pump cost. Free solar daytime electricity eliminates monthly electricity bills and diesel pump costs.',
        hi: 'किसान को केवल 10% लागत देनी होती है। मुफ्त सौर ऊर्जा से रात में पानी देने की परेशानी और बिजली बिल खत्म।',
        mr: 'शेतकऱ्याला केवळ १०% स्वहिस्सा भरावा लागतो. दिवसा शाश्वत वीज उपलब्ध झाल्याने रात्री शेतात जाण्याची गरज उरत नाही.'
      },
      eligibility: {
        en: 'Farmers having cultivable land with an assured water source (Well/Borewell) and currently no conventional electricity connection.',
        hi: 'वे किसान जिनके पास कुआं या बोरवेल जैसा सुनिश्चित जलस्रोत है और जहां पारंपरिक बिजली कनेक्शन नहीं है।',
        mr: 'ज्यांच्या शेतात विहीर किंवा बोअरवेलसारखा पाण्याचा स्त्रोत आहे आणि पारंपारिक वीज जोडणी नाही असे सर्व शेतकरी.'
      },
      documents: {
        en: ['7/12 extract with water source recorded', 'Aadhaar Card', 'Caste Certificate (if SC/ST)', 'Bank Account details'],
        hi: ['जल स्रोत दर्ज 7/12 खतौनी', 'आधार कार्ड', 'जाति प्रमाण पत्र (यदि लागू हो)', 'बैंक खाता विवरण'],
        mr: ['पाण्याच्या स्त्रोताची नोंद असलेला ७/१२', 'आधार कार्ड', 'जातीचा दाखला (लागू असल्यास)', 'बँक खाते तपशील']
      },
      howToApply: {
        en: 'Apply through Maharashtra State Electricity Distribution (MSEDCL / Mahavitaran) portal under the Mukhyamantri Saur Krushi Pump / KUSUM section.',
        hi: 'महावितरण (MSEDCL) के सौर कृषि पंप पोर्टल पर मुख्यमंत्री सौर कृषि पंप / कुसुम योजना के तहत ऑनलाइन आवेदन करें।',
        mr: 'महावितरणच्या (MSEDCL) अधिकृत सौर कृषी पंप पोर्टलवर जाऊन ऑनलाईन अर्ज नोंदणी करा.'
      },
      helpline: '1800-233-3435',
      portalUrl: 'https://pmkusum.mnre.gov.in',
      isCentral: true
    },
    {
      id: 'soil-health',
      category: 'land_soil',
      badge: {
        en: 'Scientific Crop Nutrition',
        hi: 'वैज्ञानिक फसल पोषण व जांच',
        mr: 'शास्त्रीय जमीन आरोग्य तपासणी'
      },
      title: {
        en: 'Soil Health Card Scheme',
        hi: 'मृदा स्वास्थ्य कार्ड योजना (Soil Health Card)',
        mr: 'मृदा आरोग्य पत्रिका योजना'
      },
      tagline: {
        en: 'Free soil testing across 12 chemical parameters with exact fertilizer and micronutrient dosage prescriptions.',
        hi: '12 रासायनिक मानकों पर मिट्टी की मुफ्त जांच और संतुलित उर्वरक प्रयोग की सटीक अनुशंसा।',
        mr: '१२ घटकांची मोफत प्रयोगशाळा तपासणी व खतांचा असमतोल खर्च वाचवण्यासाठी कृषी शास्त्रज्ञांची शिफारस.'
      },
      benefit: {
        en: 'Prevents excess chemical fertilizer usage, reduces farming input cost by 15-20%, and restores natural soil fertility.',
        hi: 'अनावश्यक रासायनिक खाद के खर्च में 15-20% की बचत और मिट्टी की प्राकृतिक उर्वरा शक्ति की रक्षा।',
        mr: 'अवाजवी रासायनिक खतांचा खर्च १५ ते २० टक्क्यांनी कमी होतो आणि जमिनीची सुपीकता दीर्घकाळ टिकून राहते.'
      },
      eligibility: {
        en: 'All farmers can get their soil samples tested once every 3 years free of cost.',
        hi: 'देश के सभी किसान प्रत्येक 3 वर्ष में अपने खेत की मिट्टी की मुफ्त जांच करवा सकते हैं।',
        mr: 'सर्व शेतकरी दर ३ वर्षांनी आपल्या शेतातील मातीची अधिकृत कृषी प्रयोगशाळेत मोफत तपासणी करू शकतात.'
      },
      documents: {
        en: ['Soil sample with GPS field coordinates', '7/12 copy', 'Aadhaar Card'],
        hi: ['खेत के जीपीएस निर्देशांक सहित मिट्टी का नमूना', '7/12 की प्रति', 'आधार कार्ड'],
        mr: ['जीपीएस नोंदीसह गोळा केलेला मातीचा नमुना', '७/१२ उतारा', 'आधार कार्ड']
      },
      howToApply: {
        en: 'Deposit your soil sample at the nearest Taluka Krishi Adhikari (TDO) office or Krishi Vigyan Kendra (KVK). Access reports online on the national portal.',
        hi: 'अपने नजदीकी तालुका कृषि अधिकारी कार्यालय या कृषि विज्ञान केंद्र (KVK) में मिट्टी का नमूना जमा करें।',
        mr: 'तालुका कृषी अधिकारी कार्यालय किंवा जवळच्या कृषी विज्ञान केंद्रात (KVK) मातीचा नमुना जमा करा.'
      },
      helpline: '011-23382012',
      portalUrl: 'https://soilhealth.dac.gov.in',
      isCentral: true
    },
    {
      id: 'mahabhulekh',
      category: 'land_soil',
      badge: {
        en: 'Digital Land Registry (Maharashtra)',
        hi: 'डिजिटल भूमि अभिलेख (महाराष्ट्र)',
        mr: 'डिजिटल सातबारा व ८-अ (महाराष्ट्र)'
      },
      title: {
        en: 'Mahabhulekh (Digital 7/12 & 8-A)',
        hi: 'महाभूलेख (डिजिटल 7/12 व 8-A अभिलेख)',
        mr: 'महाभूलेख (डिजिटल सातबारा, ८-अ व ई-हक्क)'
      },
      tagline: {
        en: 'Instant online viewing and download of digitally signed land records and ownership extracts.',
        hi: 'डिजिटल हस्ताक्षरित 7/12, 8-A और फेरफार नक्कल तुरंत ऑनलाइन देखें और डाउनलोड करें।',
        mr: 'डिजिटल स्वाक्षरीत अधिकृत सातबारा, ८-अ उतारा व फेरफार नोंद घरबसल्या मोबाईलवर डाउनलोड करा.'
      },
      benefit: {
        en: 'Legally valid digitally signed 7/12 extracts accepted directly by banks for crop loans and government welfare portals without visiting Talathi.',
        hi: 'बैंकों, अदालतों और सरकारी पोर्टलों द्वारा सीधे स्वीकार्य डिजिटल 7/12; तलाठी कार्यालय जाने की आवश्यकता नहीं।',
        mr: 'तलाठी कार्यालयात न जाता बँका, न्यायालय व योजनांसाठी कायदेशीररीत्या वैध असलेला डिजिटल सातबारा घरबसल्या मिळतो.'
      },
      eligibility: {
        en: 'Any citizen or farmer holding land in Maharashtra.',
        hi: 'महाराष्ट्र में भूमि धारक कोई भी किसान या नागरिक।',
        mr: 'महाराष्ट्रात जमीन असलेले सर्व शेतकरी व नागरिक.'
      },
      documents: {
        en: ['District, Taluka, Village Name', 'Survey / Gat Number'],
        hi: ['जिला, तालुका और गांव का नाम', 'सर्वे नंबर या गट नंबर'],
        mr: ['जिल्हा, तालुका व गावाचे नाव', 'गट क्रमांक किंवा सर्व्हे नंबर']
      },
      howToApply: {
        en: 'Visit the official Mahabhumi Bhulekh portal, select your revenue division (Nashik, Pune, Aurangabad, etc.), enter Gat number, and view your verified ledger.',
        hi: 'महाभूमि पोर्टल पर जाएं, अपना राजस्व विभाग चुनें, जिला, तालुका, गांव व गट नंबर दर्ज कर अपना खसरा देखें।',
        mr: 'महाभूमी पोर्टलवर आपला महसूल विभाग निवडा, गाव व गट नंबर निवडून थेट सातबारा पहा व डाऊनलोड करा.'
      },
      portalUrl: 'https://bhulekh.mahabhumi.gov.in',
      isCentral: false
    },
    {
      id: 'enam',
      category: 'subsidies',
      badge: {
        en: 'National Unified Agriculture Market',
        hi: 'राष्ट्रीय एकीकृत कृषि बाजार',
        mr: 'राष्ट्रीय डिजिटल कृषी बाजारपेठ'
      },
      title: {
        en: 'e-NAM (National Agriculture Market)',
        hi: 'ई-नाम (e-NAM राष्ट्रीय कृषि मंडी पोर्टल)',
        mr: 'ई-नाम (e-NAM राष्ट्रीय कृषी बाजार)'
      },
      tagline: {
        en: 'Pan-India electronic trading portal connecting 1,400+ APMC mandis for competitive, transparent price discovery.',
        hi: '1,400 से अधिक एपीएमसी मंडियों को जोड़ने वाला अखिल भारतीय इलेक्ट्रॉनिक ट्रेडिंग मंच।',
        mr: 'देशभरातील १४००+ कृषी उत्पन्न बाजार समित्या (APMC) जोडणारे डिजिटल ट्रेडिंग पोर्टल; मध्यस्थांशिवाय थेट विक्री.'
      },
      benefit: {
        en: 'Free online bidding by buyers across India, accurate digital assaying, transparent weighing, and direct same-day online bank settlement.',
        hi: 'देश भर के खरीदारों से प्रतिस्पर्धी बोलियां, सटीक गुणवत्ता जांच और सीधे बैंक खाते में उसी दिन भुगतान।',
        mr: 'देशभरातील खरेदीदारांकडून ऑनलाईन स्पर्धात्मक बोली, अचूक इलेक्ट्रॉनिक वजन आणि शेतमालाचे पैसे थेट बँकेत जमा.'
      },
      eligibility: {
        en: 'Any farmer bringing agricultural produce to an e-NAM integrated APMC market yard.',
        hi: 'कोई भी किसान जो ई-नाम से जुड़ी एपीएमसी मंडी में अपनी कृषि उपज लाता है।',
        mr: 'ई-नाम जोडणी असलेल्या कृषी उत्पन्न बाजार समितीत शेतमाल विक्रीसाठी आणणारे सर्व शेतकरी.'
      },
      documents: {
        en: ['Aadhaar Card', 'Bank Account details', 'Mandi Lot Arrival slip'],
        hi: ['आधार कार्ड', 'बैंक खाता विवरण', 'मंडी आवक रसीद'],
        mr: ['आधार कार्ड', 'बँक खाते पासबुक', 'बाजार समिती आवक पावती']
      },
      howToApply: {
        en: 'Register online at enam.gov.in or register at the gate of any integrated APMC mandi with your mobile number and bank account.',
        hi: 'enam.gov.in पर ऑनलाइन पंजीकरण करें या किसी भी एकीकृत एपीएमसी मंडी के प्रवेश द्वार पर अपना विवरण दर्ज करवाएं।',
        mr: 'enam.gov.in वर ऑनलाईन नोंदणी करा किंवा जवळच्या कृषी उत्पन्न बाजार समितीच्या नोंदणी केंद्रावर नाव नोंदवा.'
      },
      helpline: '1800-270-0224',
      portalUrl: 'https://enam.gov.in',
      isCentral: true
    }
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    
    const titleMatch = s.title.en.toLowerCase().includes(q) || s.title.hi.toLowerCase().includes(q) || s.title.mr.toLowerCase().includes(q);
    const taglineMatch = s.tagline.en.toLowerCase().includes(q) || s.tagline.hi.toLowerCase().includes(q) || s.tagline.mr.toLowerCase().includes(q);
    const badgeMatch = s.badge.en.toLowerCase().includes(q) || s.badge.hi.toLowerCase().includes(q) || s.badge.mr.toLowerCase().includes(q);
    return matchesCategory && (titleMatch || taglineMatch || badgeMatch);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-left">
      
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-br from-[#124131] to-[#1c5c45] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            <Landmark className="w-4 h-4 text-emerald-300" />
            <span>Govt. of India & Govt. of Maharashtra Integrated Directives</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('govtPortalsTitle')}
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed font-devanagari">
            {t('govtPortalsSubtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Verified Official Links
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Benefit Transfer (DBT)
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Toll-Free Helplines Included
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'mr' ? 'योजनेचे नाव किंवा घटक शोधा (उदा. ठिबक, शेततळे, पीएम किसान)...' : language === 'hi' ? 'योजना या उपकरण खोजें (उदा. ड्रिप, सोलर पंप, पीएम किसान)...' : 'Search scheme or keyword (e.g. Drip, PM-Kisan, Solar, Satbara)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold focus:outline-emerald-700"
            />
          </div>

          {/* Result Count Badge */}
          <div className="text-xs font-bold text-slate-500 shrink-0 self-center">
            {filteredSchemes.length} {language === 'mr' ? 'योजना उपलब्ध' : language === 'hi' ? 'योजनाएं उपलब्ध' : 'schemes found'}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {[
            { id: 'all', label: t('filterAllSchemes'), icon: Building2 },
            { id: 'dbt', label: t('filterDirectBenefit'), icon: CreditCard },
            { id: 'subsidies', label: t('filterSubsidies'), icon: Droplets },
            { id: 'insurance', label: t('filterInsurance'), icon: ShieldCheck },
            { id: 'land_soil', label: t('filterLandSoil'), icon: FileText }
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#124131] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-300' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SCHEMES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
          >
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                  scheme.isCentral
                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${scheme.isCentral ? 'bg-blue-600' : 'bg-amber-600'}`} />
                  {scheme.badge[language]}
                </span>

                {scheme.helpline && (
                  <a
                    href={`tel:${scheme.helpline.split(' ')[0]}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-600" />
                    <span>{scheme.helpline}</span>
                  </a>
                )}
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {scheme.title[language]}
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-devanagari font-semibold">
                  {scheme.tagline[language]}
                </p>
              </div>

              {/* Benefit Highlight Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-950 space-y-1">
                <div className="font-black flex items-center gap-1.5 text-emerald-900 uppercase tracking-wider text-[10px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t('keyBenefits')}</span>
                </div>
                <p className="leading-relaxed font-semibold">
                  {scheme.benefit[language]}
                </p>
              </div>

              {/* Eligibility & Documents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                
                {/* Eligibility */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    {t('eligibilityCriteria')}
                  </span>
                  <p className="text-slate-600 leading-normal">
                    {scheme.eligibility[language]}
                  </p>
                </div>

                {/* Required Documents */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    {t('requiredDocs')}
                  </span>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    {scheme.documents[language].slice(0, 3).map((doc, idx) => (
                      <li key={idx} className="truncate">{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Application step note */}
              <div className="text-[11px] text-slate-500 leading-normal font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700">{t('howToApplyStep')}: </span>
                <span>{scheme.howToApply[language]}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={scheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{t('visitOfficialPortal')}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 4. KISAN CALL CENTRE BAR */}
      <KisanHelplineBar />
    </div>
  );
};
