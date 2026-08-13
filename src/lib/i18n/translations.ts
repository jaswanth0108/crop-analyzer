// ============================================================
// AgriShield — Centralized Translation System
// Languages: en-IN (English), hi-IN (Hindi), te-IN (Telugu)
// ============================================================
// Rules:
//   - Disease names in hi-IN and te-IN include English in brackets
//   - Translations are farmer-friendly and simple
//   - Fallback is always en-IN
// ============================================================

export type AppLang = "en-IN" | "hi-IN" | "te-IN";

export const LANGUAGE_LABELS: Record<AppLang, { label: string; short: string; flag: string }> = {
  "en-IN": { label: "English",  short: "EN", flag: "🇮🇳" },
  "hi-IN": { label: "हिंदी",    short: "हि", flag: "🇮🇳" },
  "te-IN": { label: "తెలుగు",   short: "తె", flag: "🇮🇳" },
};

// Speech synthesis BCP-47 locales
export const SPEECH_LOCALES: Record<AppLang, string> = {
  "en-IN": "en-IN",
  "hi-IN": "hi-IN",
  "te-IN": "te-IN",
};

// ── Translation dictionary ─────────────────────────────────────────────────

type DeepStringRecord = { [key: string]: string | DeepStringRecord };

const en: DeepStringRecord = {
  // ── Nav ─────────────────────────────────────────────────────────────────
  nav: {
    home: "Home",
    analyze: "Analyze",
    history: "Scan History",
    supportedCrops: "Supported Crops",
    datasets: "Datasets",
    analyzeCrop: "Analyze Crop",
    analyzeACrop: "Analyze a Crop",
  },

  // ── Language selector ────────────────────────────────────────────────────
  lang: {
    label: "Language",
    select: "Select Language",
  },

  // ── Home page ────────────────────────────────────────────────────────────
  home: {
    badge: "Demo Mode Active — Hackathon Build 2026",
    heroTitle1: "Detect Crop Diseases",
    heroTitleHighlight: "Instantly",
    heroTitle2: "with AI",
    heroSubtitle:
      "Upload a leaf image and AgriShield will detect diseases in Rice, Tomato, and Potato crops — with severity estimation, treatment recommendations, and full transparency about what the AI can and cannot do.",
    ctaAnalyze: "Analyze a Crop",
    ctaSupported: "Supported Crops",
    stat1: "Crops Supported",
    stat2: "Conditions Detected",
    stat3: "Transparent Data",
    scrollLabel: "SCROLL",
    featuresTitle1: "Everything you need for",
    featuresTitleHighlight: "smart crop protection",
    featuresSubtitle: "Built for real-world agricultural conditions, with transparency at every step.",
    cropsTitle1: "Supported Crops &",
    cropsTitleHighlight: "Conditions",
    cropsViewAll: "View all",
    disclaimerTitle: "Important Disclaimer",
    disclaimerText:
      "AgriShield provides AI-assisted crop health analysis. Results may be incorrect and should be confirmed by a qualified agricultural expert before treatment decisions. Mock mode results are randomly generated for demonstration only and do not reflect real model inference.",
    ctaTitle: "Ready to analyze your first crop?",
    ctaSubtitle:
      "Upload a leaf image and get instant AI-assisted disease detection with recommendations in seconds.",
    ctaStart: "Start Analyzing",
    ctaDatasets: "View Datasets",
    checkFree: "Free to use",
    checkNoAccount: "No account required",
    checkFast: "Results in seconds",
    checkTransparent: "Fully transparent",
    footerBuilt: "Built for the 2026 Hackathon · Demo Mode · Not for commercial use",
    footerDatasets: "Datasets",
    footerCrops: "Supported Crops",
  },

  // ── Feature cards ────────────────────────────────────────────────────────
  features: {
    uploadTitle: "Upload or Capture",
    uploadDesc:
      "Drag-and-drop any leaf image or use your device camera directly. Supports JPEG, PNG, and WebP up to 10 MB.",
    aiTitle: "Instant AI Detection",
    aiDesc:
      "Our classifier identifies crop conditions across 13 supported disease states in seconds, with confidence scoring.",
    heatmapTitle: "Grad-CAM Heatmaps",
    heatmapDesc:
      "Visual explanations showing which regions of the leaf influenced the AI decision (demo visualization in mock mode).",
    severityTitle: "Severity Estimation",
    severityDesc:
      "Rice diseases include lesion-pixel-based severity from Healthy to Critical. Tomato and Potato show condition only.",
    recommendTitle: "Safe Recommendations",
    recommendDesc:
      "Severity-aware treatment guidance with agronomist disclaimers. We never suggest treatments outside our knowledge.",
    datasetsTitle: "Transparent Datasets",
    datasetsDesc:
      "Full disclosure of every dataset used — Paddy Doctor, PlantVillage, PlantDoc, and more. No hidden data sources.",
  },

  // ── Crop names (home page crop cards) ────────────────────────────────────
  crops: {
    rice: "Rice / Paddy",
    tomato: "Tomato",
    potato: "Potato",
  },

  // ── Analyze page ─────────────────────────────────────────────────────────
  analyze: {
    title1: "Crop Health",
    titleHighlight: "Analyzer",
    subtitle: "Upload any plant or leaf image — our AI validates it's a plant, then detects diseases",
    dropTitle: "Upload a plant or leaf image",
    dropTitleDrag: "Drop your plant image here",
    dropSubtitle:
      "Drag and drop or click to browse. Supports JPEG, PNG, WebP up to 10 MB.",
    dropSubtitleNote: "Our AI verifies the image is a plant before analysis.",
    browseFiles: "Browse Files",
    takePhoto: "Take Photo",
    howTitle: "How it works:",
    howText:
      "Upload any clear photo of a plant leaf or crop. Our AI first validates the image is a plant, then analyses it for disease, severity, and recommends treatment. Images must be well-lit and in focus for accurate results.",
    noPlantTitle: "No plant detected in this image",
    noPlantHint:
      "🌿 What to upload: A clear, well-lit photo of a plant leaf, crop foliage, stem, or any visible plant part. AgriShield is designed exclusively for plant disease analysis.",
    checkingQuality: "Checking image quality...",
    checkingQualityNote: "Checking file format and image sharpness",
    checkingPlant: "Verifying plant content...",
    checkingPlantNote: "AI is confirming this is a plant or leaf image",
    poweredBy: "Powered by Gemini Vision",
    analyzingTitle: "Analyzing your image",
    progressComplete: "% complete",
    demoBanner:
      "Demo Results — These are mock results for demonstration only. No real model inference was performed.",
    analyzeAnother: "Analyze Another",
    viewHistory: "View History",
    lowConfidence:
      "We could not identify this condition reliably. Please upload a clearer image or consult an agricultural expert.",
    // Progress steps
    progress1: "Checking image quality...",
    progress2: "Verifying plant content...",
    progress3: "Identifying crop type...",
    progress4: "Detecting disease condition...",
    progress5: "Calculating severity...",
    progress6: "Generating recommendations...",
    // Errors
    errorUnsupportedType: "Unsupported file type",
    errorUnsupportedTypeSuggest: "Please upload a JPEG, PNG, or WebP image.",
    errorFileTooLarge: "File too large",
    errorFileTooLargeSuggest: "Please upload an image smaller than 10 MB.",
    errorBlurry: "Image appears too blurry",
    errorBlurrySuggest:
      "Please take a clearer photo. Ensure the leaf is in focus and well-lit.",
    errorFailed: "Disease analysis failed",
    errorFailedSuggest: "Please try again with a clearer image.",
  },

  // ── Result card ──────────────────────────────────────────────────────────
  result: {
    detectedCondition: "Detected Condition",
    match: "Match",
    confidence: {
      high: "High Confidence",
      medium: "Medium Confidence",
      low: "Low Confidence",
      unreliable: "Unreliable",
      unsupported: "Unsupported Image",
    },
  },

  // ── Severity panel ───────────────────────────────────────────────────────
  severity: {
    title: "Severity Estimation",
    unavailable: "Severity estimation is currently unavailable for this condition.",
    lesionArea: "lesion area",
    labels: {
      healthy: "Healthy",
      mild: "Mild",
      moderate: "Moderate",
      high: "High",
      very_high: "Very High",
      critical: "Critical",
      unavailable: "N/A",
    },
    scaleLabels: {
      healthy: "Healthy",
      mild: "Mild",
      mod: "Mod",
      high: "High",
      vhigh: "V.High",
      crit: "Crit",
    },
  },

  // ── Heatmap panel ────────────────────────────────────────────────────────
  heatmap: {
    title: "Grad-CAM Analysis",
    demoLabel: "Demo Visualization",
    demoText:
      "This heatmap is randomly generated for demonstration purposes. A real Grad-CAM heatmap highlights the regions of the image that most influenced the AI's prediction.",
    realText:
      "Heatmap highlights regions of the image that most influenced the AI's prediction. Red areas indicate highest importance.",
  },

  // ── Recommendation panel ─────────────────────────────────────────────────
  recommendation: {
    title: "Recommendations",
    immediate: "Immediate Action",
    treatment: "Treatment",
    prevention: "Prevention",
    highPriority: "High Priority",
    none: "No recommendations in this category.",
  },

  // ── Disclaimer ───────────────────────────────────────────────────────────
  disclaimer: {
    title: "Important Agricultural Disclaimer",
    text:
      "AgriShield provides AI-assisted crop health analysis. Results may be incorrect and should be confirmed by a qualified agricultural expert before making treatment decisions. Always follow local regulations when applying chemical treatments.",
  },

  // ── History page ─────────────────────────────────────────────────────────
  history: {
    title: "Scan",
    titleHighlight: "History",
    subtitle: "Review your past crop analyses and track confidence trends",
    clearHistory: "Clear History",
    clearConfirm: "Are you sure you want to clear your entire scan history?",
    backToList: "Back to History List",
    noHistoryTitle: "No history yet",
    noHistoryText:
      "Your past crop scans will appear here. They are saved securely in your browser.",
    analyzeNow: "Analyze a Crop",
    recentScans: "Recent Scans",
    trend: {
      title: "Confidence Trends",
      subtitle: "Model confidence across recent scans",
      allCrops: "All Crops",
      notEnough:
        "Not enough data yet. Complete at least 2 scans to see trend analysis.",
    },
  },

  // ── Supported Crops page ──────────────────────────────────────────────────
  supportedCrops: {
    badge: "Dataset-driven Coverage",
    title1: "Supported",
    titleHighlight: "Crops & Diseases",
    subtitlePart1: "AgriShield is trained on",
    subtitleImages: "images",
    subtitlePart2: "across",
    subtitleSpecies: "crop species",
    subtitlePart3: "and",
    subtitleClasses: "disease conditions",
    subtitlePart4: "from 4 research datasets.",
    statSpecies: "Crop Species",
    statConditions: "Disease Conditions",
    statImages: "Training Images",
    breakdown: "Crop-by-Crop Breakdown",
    diseases: "diseases",
    footerNote:
      "AgriShield's detection is based on the visual patterns found in its training datasets. Accuracy may be lower for crops not well-represented in the training data, field images with complex backgrounds, or rare disease variants not present in the datasets. Always confirm AI results with a qualified agronomist before making treatment decisions.",
    footerImportant: "Important:",
  },

  // ── Datasets page ─────────────────────────────────────────────────────────
  datasets: {
    title1: "Dataset &",
    titleHighlight: "Model Transparency",
    subtitle:
      "We believe in open agricultural AI. Below is the complete list of datasets, model architectures, and known limitations used to train AgriShield.",
    species: "Species",
    conditions: "Conditions",
    images: "Images",
    viewSource: "View Source",
    coverage: "Coverage",
    limitations: "Known Limitations",
  },
};

// ── Hindi translations ─────────────────────────────────────────────────────

const hi: DeepStringRecord = {
  nav: {
    home: "होम",
    analyze: "विश्लेषण",
    history: "स्कैन इतिहास",
    supportedCrops: "समर्थित फसलें",
    datasets: "डेटासेट",
    analyzeCrop: "फसल जाँचें",
    analyzeACrop: "फसल जाँचें",
  },

  lang: {
    label: "भाषा",
    select: "भाषा चुनें",
  },

  home: {
    badge: "डेमो मोड चालू है — हैकाथॉन बिल्ड 2026",
    heroTitle1: "फसल रोग पहचानें",
    heroTitleHighlight: "तुरंत",
    heroTitle2: "AI के साथ",
    heroSubtitle:
      "पत्ती की फ़ोटो अपलोड करें और AgriShield धान, टमाटर और आलू की फसलों में रोग पहचानेगा — गंभीरता अनुमान, उपचार सुझाव और पूरी पारदर्शिता के साथ।",
    ctaAnalyze: "फसल जाँचें",
    ctaSupported: "समर्थित फसलें",
    stat1: "फसलें समर्थित",
    stat2: "रोग पहचाने गए",
    stat3: "पारदर्शी डेटा",
    scrollLabel: "नीचे स्क्रॉल करें",
    featuresTitle1: "स्मार्ट फसल सुरक्षा के लिए",
    featuresTitleHighlight: "सब कुछ यहाँ है",
    featuresSubtitle:
      "वास्तविक कृषि परिस्थितियों के लिए बनाया गया, हर कदम पर पारदर्शिता के साथ।",
    cropsTitle1: "समर्थित फसलें और",
    cropsTitleHighlight: "रोग",
    cropsViewAll: "सभी देखें",
    disclaimerTitle: "महत्वपूर्ण चेतावनी",
    disclaimerText:
      "AgriShield AI-सहायता से फसल स्वास्थ्य विश्लेषण करता है। परिणाम गलत हो सकते हैं और उपचार निर्णय से पहले किसी योग्य कृषि विशेषज्ञ से पुष्टि करनी चाहिए। मॉक मोड के परिणाम केवल प्रदर्शन के लिए हैं।",
    ctaTitle: "क्या आप अपनी पहली फसल जाँचने के लिए तैयार हैं?",
    ctaSubtitle:
      "पत्ती की फ़ोटो अपलोड करें और कुछ सेकंड में AI-सहायता से रोग पहचान और सुझाव पाएं।",
    ctaStart: "जाँच शुरू करें",
    ctaDatasets: "डेटासेट देखें",
    checkFree: "मुफ़्त उपयोग",
    checkNoAccount: "खाता जरूरी नहीं",
    checkFast: "कुछ सेकंड में परिणाम",
    checkTransparent: "पूरी तरह पारदर्शी",
    footerBuilt: "2026 हैकाथॉन के लिए बनाया गया · डेमो मोड · व्यावसायिक उपयोग नहीं",
    footerDatasets: "डेटासेट",
    footerCrops: "समर्थित फसलें",
  },

  features: {
    uploadTitle: "अपलोड करें या फ़ोटो लें",
    uploadDesc:
      "कोई भी पत्ती की फ़ोटो खींचें या अपने कैमरे से सीधे अपलोड करें। JPEG, PNG, WebP तक 10 MB समर्थित।",
    aiTitle: "तुरंत AI पहचान",
    aiDesc:
      "हमारा क्लासिफायर 13 रोग अवस्थाओं को कुछ सेकंड में पहचानता है, कॉन्फिडेंस स्कोर के साथ।",
    heatmapTitle: "Grad-CAM हीटमैप",
    heatmapDesc:
      "दृश्य स्पष्टीकरण जो दिखाता है कि पत्ती के किस हिस्से ने AI के निर्णय को प्रभावित किया।",
    severityTitle: "गंभीरता अनुमान",
    severityDesc:
      "धान के रोगों में स्वस्थ से गंभीर तक घाव-पिक्सल आधारित गंभीरता। टमाटर और आलू के लिए केवल स्थिति दिखाई जाती है।",
    recommendTitle: "सुरक्षित सुझाव",
    recommendDesc:
      "गंभीरता के अनुसार उपचार मार्गदर्शन, कृषि विशेषज्ञ की सलाह के साथ।",
    datasetsTitle: "पारदर्शी डेटासेट",
    datasetsDesc:
      "उपयोग किए गए हर डेटासेट का पूरा विवरण — Paddy Doctor, PlantVillage, PlantDoc, और अधिक।",
  },

  crops: {
    rice: "धान / चावल",
    tomato: "टमाटर",
    potato: "आलू",
  },

  analyze: {
    title1: "फसल स्वास्थ्य",
    titleHighlight: "विश्लेषक",
    subtitle:
      "कोई भी पौधे या पत्ती की फ़ोटो अपलोड करें — AI पहले जाँचेगा कि यह पौधा है, फिर रोग पहचानेगा",
    dropTitle: "पौधे या पत्ती की फ़ोटो अपलोड करें",
    dropTitleDrag: "यहाँ फ़ोटो छोड़ें",
    dropSubtitle:
      "खींचकर छोड़ें या ब्राउज़ करने के लिए क्लिक करें। JPEG, PNG, WebP तक 10 MB।",
    dropSubtitleNote: "हमारा AI विश्लेषण से पहले जाँचता है कि फ़ोटो में पौधा है।",
    browseFiles: "फ़ाइल चुनें",
    takePhoto: "फ़ोटो लें",
    howTitle: "यह कैसे काम करता है:",
    howText:
      "पौधे की पत्ती या फसल की कोई स्पष्ट फ़ोटो अपलोड करें। AI पहले जाँचता है कि यह पौधा है, फिर रोग, गंभीरता और उपचार का विश्लेषण करता है।",
    noPlantTitle: "इस फ़ोटो में कोई पौधा नहीं मिला",
    noPlantHint:
      "🌿 क्या अपलोड करें: पौधे की पत्ती, फसल के पत्ते, तना या किसी दृश्य पौधे के हिस्से की स्पष्ट, अच्छी रोशनी में ली गई फ़ोटो। AgriShield केवल पौधे के रोग विश्लेषण के लिए बना है।",
    checkingQuality: "फ़ोटो की गुणवत्ता जाँच रहे हैं...",
    checkingQualityNote: "फ़ाइल प्रारूप और फ़ोटो की स्पष्टता जाँची जा रही है",
    checkingPlant: "पौधे की पुष्टि हो रही है...",
    checkingPlantNote: "AI जाँच रहा है कि यह पौधे या पत्ती की फ़ोटो है",
    poweredBy: "Gemini Vision द्वारा संचालित",
    analyzingTitle: "आपकी फ़ोटो का विश्लेषण हो रहा है",
    progressComplete: "% पूर्ण",
    demoBanner:
      "डेमो परिणाम — ये केवल प्रदर्शन के लिए नकली परिणाम हैं। कोई वास्तविक मॉडल अनुमान नहीं किया गया।",
    analyzeAnother: "दूसरी जाँच करें",
    viewHistory: "इतिहास देखें",
    lowConfidence:
      "हम इस स्थिति को विश्वसनीय रूप से पहचान नहीं सके। कृपया स्पष्ट फ़ोटो अपलोड करें या किसी कृषि विशेषज्ञ से सलाह लें।",
    progress1: "फ़ोटो की गुणवत्ता जाँच रहे हैं...",
    progress2: "पौधे की पुष्टि हो रही है...",
    progress3: "फसल का प्रकार पहचान रहे हैं...",
    progress4: "रोग की स्थिति पहचान रहे हैं...",
    progress5: "गंभीरता की गणना हो रही है...",
    progress6: "सुझाव तैयार हो रहे हैं...",
    errorUnsupportedType: "फ़ाइल प्रकार समर्थित नहीं है",
    errorUnsupportedTypeSuggest: "कृपया JPEG, PNG, या WebP फ़ोटो अपलोड करें।",
    errorFileTooLarge: "फ़ाइल बहुत बड़ी है",
    errorFileTooLargeSuggest: "कृपया 10 MB से छोटी फ़ोटो अपलोड करें।",
    errorBlurry: "फ़ोटो बहुत धुंधली लग रही है",
    errorBlurrySuggest:
      "कृपया स्पष्ट फ़ोटो लें। सुनिश्चित करें कि पत्ती फोकस में हो और रोशनी अच्छी हो।",
    errorFailed: "रोग विश्लेषण विफल हो गया",
    errorFailedSuggest: "कृपया अधिक स्पष्ट फ़ोटो के साथ पुनः प्रयास करें।",
  },

  result: {
    detectedCondition: "पहचानी गई स्थिति",
    match: "मिलान",
    confidence: {
      high: "उच्च विश्वास",
      medium: "मध्यम विश्वास",
      low: "कम विश्वास",
      unreliable: "अविश्वसनीय",
      unsupported: "असमर्थित फ़ोटो",
    },
  },

  severity: {
    title: "गंभीरता अनुमान",
    unavailable: "इस स्थिति के लिए गंभीरता अनुमान उपलब्ध नहीं है।",
    lesionArea: "घाव क्षेत्र",
    labels: {
      healthy: "स्वस्थ",
      mild: "हल्का",
      moderate: "मध्यम",
      high: "अधिक",
      very_high: "बहुत अधिक",
      critical: "गंभीर",
      unavailable: "उपलब्ध नहीं",
    },
    scaleLabels: {
      healthy: "स्वस्थ",
      mild: "हल्का",
      mod: "मध्यम",
      high: "अधिक",
      vhigh: "बहुत अधिक",
      crit: "गंभीर",
    },
  },

  heatmap: {
    title: "Grad-CAM विश्लेषण",
    demoLabel: "डेमो विज़ुअलाइज़ेशन",
    demoText:
      "यह हीटमैप प्रदर्शन के लिए यादृच्छिक रूप से बनाया गया है। वास्तविक Grad-CAM हीटमैप उन क्षेत्रों को दिखाता है जो AI के निर्णय को सबसे अधिक प्रभावित करते हैं।",
    realText:
      "हीटमैप उन क्षेत्रों को दर्शाता है जो AI के निर्णय को सबसे अधिक प्रभावित करते हैं। लाल क्षेत्र सबसे अधिक महत्वपूर्ण हैं।",
  },

  recommendation: {
    title: "सुझाव",
    immediate: "तुरंत कार्रवाई",
    treatment: "उपचार",
    prevention: "बचाव",
    highPriority: "उच्च प्राथमिकता",
    none: "इस श्रेणी में कोई सुझाव नहीं है।",
  },

  disclaimer: {
    title: "महत्वपूर्ण कृषि चेतावनी",
    text:
      "AgriShield AI-सहायता से फसल स्वास्थ्य विश्लेषण करता है। परिणाम गलत हो सकते हैं और उपचार निर्णय से पहले किसी योग्य कृषि विशेषज्ञ से पुष्टि की जानी चाहिए। रासायनिक उपचार लगाते समय हमेशा स्थानीय नियमों का पालन करें।",
  },

  history: {
    title: "स्कैन",
    titleHighlight: "इतिहास",
    subtitle: "अपने पिछले फसल विश्लेषण की समीक्षा करें और रुझान ट्रैक करें",
    clearHistory: "इतिहास मिटाएं",
    clearConfirm: "क्या आप वाकई अपना पूरा स्कैन इतिहास मिटाना चाहते हैं?",
    backToList: "सूची पर वापस जाएं",
    noHistoryTitle: "अभी कोई इतिहास नहीं",
    noHistoryText:
      "आपके पिछले फसल स्कैन यहाँ दिखाई देंगे। वे आपके ब्राउज़र में सुरक्षित रूप से सहेजे गए हैं।",
    analyzeNow: "फसल जाँचें",
    recentScans: "हाल के स्कैन",
    trend: {
      title: "विश्वास रुझान",
      subtitle: "हाल के स्कैन में मॉडल का विश्वास",
      allCrops: "सभी फसलें",
      notEnough:
        "अभी पर्याप्त डेटा नहीं है। रुझान विश्लेषण देखने के लिए कम से कम 2 स्कैन पूरे करें।",
    },
  },

  supportedCrops: {
    badge: "डेटासेट-आधारित कवरेज",
    title1: "समर्थित",
    titleHighlight: "फसलें और रोग",
    subtitlePart1: "AgriShield को प्रशिक्षित किया गया है",
    subtitleImages: "फ़ोटो पर",
    subtitlePart2: "",
    subtitleSpecies: "फसल प्रजातियों",
    subtitlePart3: "और",
    subtitleClasses: "रोग स्थितियों",
    subtitlePart4: "के साथ, 4 शोध डेटासेट से।",
    statSpecies: "फसल प्रजातियां",
    statConditions: "रोग स्थितियां",
    statImages: "प्रशिक्षण फ़ोटो",
    breakdown: "फसल-दर-फसल विवरण",
    diseases: "रोग",
    footerNote:
      "AgriShield की पहचान प्रशिक्षण डेटासेट में पाए गए दृश्य पैटर्न पर आधारित है। उन फसलों के लिए सटीकता कम हो सकती है जो प्रशिक्षण डेटा में अच्छी तरह प्रतिनिधित नहीं हैं। उपचार निर्णय लेने से पहले हमेशा किसी कृषि विशेषज्ञ से AI परिणामों की पुष्टि करें।",
    footerImportant: "महत्वपूर्ण:",
  },

  datasets: {
    title1: "डेटासेट और",
    titleHighlight: "मॉडल पारदर्शिता",
    subtitle:
      "हम खुले कृषि AI में विश्वास करते हैं। नीचे AgriShield को प्रशिक्षित करने के लिए उपयोग किए गए डेटासेट, मॉडल आर्किटेक्चर और ज्ञात सीमाओं की पूरी सूची है।",
    species: "प्रजातियां",
    conditions: "स्थितियां",
    images: "फ़ोटो",
    viewSource: "स्रोत देखें",
    coverage: "कवरेज",
    limitations: "ज्ञात सीमाएं",
  },
};

// ── Telugu translations ────────────────────────────────────────────────────

const te: DeepStringRecord = {
  nav: {
    home: "హోమ్",
    analyze: "విశ్లేషణ",
    history: "స్కాన్ చరిత్ర",
    supportedCrops: "మద్దతు పంటలు",
    datasets: "డేటాసెట్లు",
    analyzeCrop: "పంట పరీక్షించండి",
    analyzeACrop: "పంట పరీక్షించండి",
  },

  lang: {
    label: "భాష",
    select: "భాష ఎంచుకోండి",
  },

  home: {
    badge: "డెమో మోడ్ చురుగ్గా ఉంది — హ్యాకథాన్ బిల్డ్ 2026",
    heroTitle1: "పంట రోగాలు గుర్తించండి",
    heroTitleHighlight: "వెంటనే",
    heroTitle2: "AI తో",
    heroSubtitle:
      "ఆకు ఫోటో అప్‌లోడ్ చేయండి మరియు AgriShield వరి, టమాటో మరియు బంగాళాదుంప పంటల్లో రోగాలు గుర్తిస్తుంది — తీవ్రత అంచనా, చికిత్స సిఫారసులు మరియు పూర్తి పారదర్శకతతో.",
    ctaAnalyze: "పంట పరీక్షించండి",
    ctaSupported: "మద్దతు పంటలు",
    stat1: "పంటలు మద్దతు ఉన్నాయి",
    stat2: "రోగాలు గుర్తించబడ్డాయి",
    stat3: "పారదర్శక డేటా",
    scrollLabel: "స్క్రోల్ చేయండి",
    featuresTitle1: "స్మార్ట్ పంట రక్షణకు",
    featuresTitleHighlight: "అన్నీ ఇక్కడ ఉన్నాయి",
    featuresSubtitle:
      "వాస్తవ వ్యవసాయ పరిస్థితుల కోసం నిర్మించబడింది, ప్రతి అడుగులో పారదర్శకతతో.",
    cropsTitle1: "మద్దతు పంటలు మరియు",
    cropsTitleHighlight: "రోగాలు",
    cropsViewAll: "అన్నీ చూడండి",
    disclaimerTitle: "ముఖ్యమైన హెచ్చరిక",
    disclaimerText:
      "AgriShield AI-సహాయంతో పంట ఆరోగ్య విశ్లేషణ అందిస్తుంది. ఫలితాలు తప్పు కావచ్చు మరియు చికిత్స నిర్ణయాలు తీసుకునే ముందు అర్హత కలిగిన వ్యవసాయ నిపుణుని ద్వారా నిర్ధారించబడాలి.",
    ctaTitle: "మీ మొదటి పంటను పరీక్షించడానికి సిద్ధంగా ఉన్నారా?",
    ctaSubtitle:
      "ఆకు ఫోటో అప్‌లోడ్ చేయండి మరియు సెకన్లలో AI-సహాయ రోగ గుర్తింపు మరియు సిఫారసులు పొందండి.",
    ctaStart: "విశ్లేషణ ప్రారంభించండి",
    ctaDatasets: "డేటాసెట్లు చూడండి",
    checkFree: "ఉచిత వినియోగం",
    checkNoAccount: "అకౌంట్ అవసరం లేదు",
    checkFast: "సెకన్లలో ఫలితాలు",
    checkTransparent: "పూర్తిగా పారదర్శకం",
    footerBuilt: "2026 హ్యాకథాన్ కోసం నిర్మించబడింది · డెమో మోడ్ · వాణిజ్య ఉపయోగం కాదు",
    footerDatasets: "డేటాసెట్లు",
    footerCrops: "మద్దతు పంటలు",
  },

  features: {
    uploadTitle: "అప్‌లోడ్ చేయండి లేదా ఫోటో తీయండి",
    uploadDesc:
      "ఏదైనా ఆకు ఫోటో లాగి వదలండి లేదా మీ కెమెరా నేరుగా ఉపయోగించండి. JPEG, PNG, WebP 10 MB వరకు మద్దతు ఉంది.",
    aiTitle: "తక్షణ AI గుర్తింపు",
    aiDesc:
      "మా క్లాసిఫయర్ 13 మద్దతు ఉన్న రోగ స్థితులను సెకన్లలో గుర్తిస్తుంది, కాన్ఫిడెన్స్ స్కోర్‌తో.",
    heatmapTitle: "Grad-CAM హీట్‌మ్యాప్‌లు",
    heatmapDesc:
      "ఆకులో ఏ ప్రాంతాలు AI నిర్ణయాన్ని ప్రభావితం చేశాయో చూపించే దృశ్య వివరణలు.",
    severityTitle: "తీవ్రత అంచనా",
    severityDesc:
      "వరి రోగాలకు ఆరోగ్యకరమైన నుండి విమర్శనాత్మక వరకు గాయం-పిక్సెల్ ఆధారిత తీవ్రత. టమాటో మరియు బంగాళాదుంపకు స్థితి మాత్రమే.",
    recommendTitle: "సురక్షిత సిఫారసులు",
    recommendDesc:
      "తీవ్రత అనుసరించి చికిత్స మార్గదర్శకత్వం, వ్యవసాయ నిపుణుని హెచ్చరికతో.",
    datasetsTitle: "పారదర్శక డేటాసెట్లు",
    datasetsDesc:
      "ఉపయోగించిన ప్రతి డేటాసెట్ యొక్క పూర్తి వెల్లడి — Paddy Doctor, PlantVillage, PlantDoc మరియు మరిన్ని.",
  },

  crops: {
    rice: "వరి / పచ్చడి",
    tomato: "టమాటో",
    potato: "బంగాళాదుంప",
  },

  analyze: {
    title1: "పంట ఆరోగ్య",
    titleHighlight: "విశ్లేషకుడు",
    subtitle:
      "ఏదైనా మొక్క లేదా ఆకు ఫోటో అప్‌లోడ్ చేయండి — మా AI మొదట మొక్క అని నిర్ధారిస్తుంది, తర్వాత రోగాలు గుర్తిస్తుంది",
    dropTitle: "మొక్క లేదా ఆకు ఫోటో అప్‌లోడ్ చేయండి",
    dropTitleDrag: "మీ మొక్క ఫోటో ఇక్కడ వదలండి",
    dropSubtitle:
      "లాగి వదలండి లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి. JPEG, PNG, WebP 10 MB వరకు.",
    dropSubtitleNote: "మా AI విశ్లేషణకు ముందు ఫోటోలో మొక్క ఉందో నిర్ధారిస్తుంది.",
    browseFiles: "ఫైల్‌లు బ్రౌజ్ చేయండి",
    takePhoto: "ఫోటో తీయండి",
    howTitle: "ఇది ఎలా పని చేస్తుంది:",
    howText:
      "మొక్క ఆకు లేదా పంట యొక్క స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి. AI మొదట మొక్క అని నిర్ధారిస్తుంది, తర్వాత రోగం, తీవ్రత మరియు చికిత్సను విశ్లేషిస్తుంది.",
    noPlantTitle: "ఈ ఫోటోలో మొక్క కనుగొనబడలేదు",
    noPlantHint:
      "🌿 ఏమి అప్‌లోడ్ చేయాలి: మొక్క ఆకు, పంట ఆకులు, కాండం లేదా ఏదైనా కనిపించే మొక్క భాగం యొక్క స్పష్టమైన, చక్కగా వెలిగించిన ఫోటో. AgriShield ప్రత్యేకంగా మొక్కల రోగ విశ్లేషణ కోసం రూపొందించబడింది.",
    checkingQuality: "ఫోటో నాణ్యత తనిఖీ అవుతోంది...",
    checkingQualityNote: "ఫైల్ ఫార్మాట్ మరియు ఫోటో స్పష్టత తనిఖీ అవుతోంది",
    checkingPlant: "మొక్క కంటెంట్ ధృవీకరణ అవుతోంది...",
    checkingPlantNote: "ఇది మొక్క లేదా ఆకు ఫోటో అని AI నిర్ధారిస్తోంది",
    poweredBy: "Gemini Vision ద్వారా నడుస్తోంది",
    analyzingTitle: "మీ ఫోటో విశ్లేషణ అవుతోంది",
    progressComplete: "% పూర్తయింది",
    demoBanner:
      "డెమో ఫలితాలు — ఇవి ప్రదర్శన కోసం మాత్రమే నకిలీ ఫలితాలు. నిజమైన మోడల్ అనుమానం జరగలేదు.",
    analyzeAnother: "మరొకటి పరీక్షించండి",
    viewHistory: "చరిత్ర చూడండి",
    lowConfidence:
      "మేము ఈ స్థితిని నమ్మకంగా గుర్తించలేకపోయాం. దయచేసి స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి లేదా వ్యవసాయ నిపుణుని సంప్రదించండి.",
    progress1: "ఫోటో నాణ్యత తనిఖీ అవుతోంది...",
    progress2: "మొక్క కంటెంట్ ధృవీకరణ అవుతోంది...",
    progress3: "పంట రకాన్ని గుర్తిస్తోంది...",
    progress4: "రోగ స్థితిని గుర్తిస్తోంది...",
    progress5: "తీవ్రత లెక్కిస్తోంది...",
    progress6: "సిఫారసులు రూపొందిస్తోంది...",
    errorUnsupportedType: "మద్దతు లేని ఫైల్ రకం",
    errorUnsupportedTypeSuggest: "దయచేసి JPEG, PNG లేదా WebP ఫోటో అప్‌లోడ్ చేయండి.",
    errorFileTooLarge: "ఫైల్ చాలా పెద్దది",
    errorFileTooLargeSuggest: "దయచేసి 10 MB కంటే చిన్న ఫోటో అప్‌లోడ్ చేయండి.",
    errorBlurry: "ఫోటో చాలా అస్పష్టంగా ఉంది",
    errorBlurrySuggest:
      "దయచేసి స్పష్టమైన ఫోటో తీయండి. ఆకు ఫోకస్‌లో ఉందని మరియు వెలుతురు బాగా ఉందని నిర్ధారించుకోండి.",
    errorFailed: "రోగ విశ్లేషణ విఫలమైంది",
    errorFailedSuggest: "దయచేసి స్పష్టమైన ఫోటోతో మళ్ళీ ప్రయత్నించండి.",
  },

  result: {
    detectedCondition: "గుర్తించబడిన స్థితి",
    match: "సరిపోలిక",
    confidence: {
      high: "అధిక విశ్వాసం",
      medium: "మధ్యమ విశ్వాసం",
      low: "తక్కువ విశ్వాసం",
      unreliable: "అవిశ్వసనీయం",
      unsupported: "మద్దతు లేని ఫోటో",
    },
  },

  severity: {
    title: "తీవ్రత అంచనా",
    unavailable: "ఈ స్థితికి తీవ్రత అంచనా అందుబాటులో లేదు.",
    lesionArea: "గాయం విస్తీర్ణం",
    labels: {
      healthy: "ఆరోగ్యకరం",
      mild: "తేలికపాటి",
      moderate: "మధ్యమ",
      high: "అధిక",
      very_high: "చాలా అధిక",
      critical: "విమర్శనాత్మక",
      unavailable: "అందుబాటులో లేదు",
    },
    scaleLabels: {
      healthy: "ఆరోగ్యకరం",
      mild: "తేలిక",
      mod: "మధ్యమ",
      high: "అధిక",
      vhigh: "చాలా అధిక",
      crit: "విమర్శనాత్మక",
    },
  },

  heatmap: {
    title: "Grad-CAM విశ్లేషణ",
    demoLabel: "డెమో విజువలైజేషన్",
    demoText:
      "ఈ హీట్‌మ్యాప్ ప్రదర్శన ప్రయోజనాల కోసం యాదృచ్ఛికంగా రూపొందించబడింది. నిజమైన Grad-CAM హీట్‌మ్యాప్ AI నిర్ణయాన్ని అత్యంత ప్రభావితం చేసిన ఫోటో ప్రాంతాలను హైలైట్ చేస్తుంది.",
    realText:
      "హీట్‌మ్యాప్ AI నిర్ణయాన్ని అత్యంత ప్రభావితం చేసిన ఫోటో ప్రాంతాలను హైలైట్ చేస్తుంది. ఎర్రటి ప్రాంతాలు అత్యంత ముఖ్యమైనవి.",
  },

  recommendation: {
    title: "సిఫారసులు",
    immediate: "తక్షణ చర్య",
    treatment: "చికిత్స",
    prevention: "నివారణ",
    highPriority: "అధిక ప్రాధాన్యత",
    none: "ఈ వర్గంలో సిఫారసులు లేవు.",
  },

  disclaimer: {
    title: "ముఖ్యమైన వ్యవసాయ హెచ్చరిక",
    text:
      "AgriShield AI-సహాయ పంట ఆరోగ్య విశ్లేషణ అందిస్తుంది. ఫలితాలు తప్పు కావచ్చు మరియు చికిత్స నిర్ణయాలు తీసుకునే ముందు అర్హత కలిగిన వ్యవసాయ నిపుణుని ద్వారా నిర్ధారించబడాలి. రసాయన చికిత్సలు వర్తింపజేసేటప్పుడు ఎల్లప్పుడూ స్థానిక నిబంధనలను అనుసరించండి.",
  },

  history: {
    title: "స్కాన్",
    titleHighlight: "చరిత్ర",
    subtitle: "మీ గత పంట విశ్లేషణలను సమీక్షించండి మరియు ట్రెండ్‌లను ట్రాక్ చేయండి",
    clearHistory: "చరిత్ర తొలగించండి",
    clearConfirm: "మీరు మీ మొత్తం స్కాన్ చరిత్రను తొలగించాలనుకుంటున్నారా?",
    backToList: "జాబితాకు తిరిగి వెళ్ళండి",
    noHistoryTitle: "ఇంకా చరిత్ర లేదు",
    noHistoryText:
      "మీ గత పంట స్కాన్‌లు ఇక్కడ కనిపిస్తాయి. అవి మీ బ్రౌజర్‌లో సురక్షితంగా సేవ్ చేయబడ్డాయి.",
    analyzeNow: "పంట పరీక్షించండి",
    recentScans: "తాజా స్కాన్‌లు",
    trend: {
      title: "విశ్వాస ట్రెండ్‌లు",
      subtitle: "తాజా స్కాన్‌లలో మోడల్ విశ్వాసం",
      allCrops: "అన్ని పంటలు",
      notEnough:
        "ఇంకా తగినంత డేటా లేదు. ట్రెండ్ విశ్లేషణ చూడటానికి కనీసం 2 స్కాన్‌లు పూర్తి చేయండి.",
    },
  },

  supportedCrops: {
    badge: "డేటాసెట్-ఆధారిత కవరేజ్",
    title1: "మద్దతు ఉన్న",
    titleHighlight: "పంటలు మరియు రోగాలు",
    subtitlePart1: "AgriShield శిక్షణ పొందింది",
    subtitleImages: "ఫోటోలపై",
    subtitlePart2: "",
    subtitleSpecies: "పంట జాతులు",
    subtitlePart3: "మరియు",
    subtitleClasses: "రోగ స్థితులు",
    subtitlePart4: "4 పరిశోధన డేటాసెట్‌ల నుండి.",
    statSpecies: "పంట జాతులు",
    statConditions: "రోగ స్థితులు",
    statImages: "శిక్షణ ఫోటోలు",
    breakdown: "పంట-వారీ వివరణ",
    diseases: "రోగాలు",
    footerNote:
      "AgriShield గుర్తింపు దాని శిక్షణ డేటాసెట్‌లలో కనుగొనబడిన దృశ్య నమూనాలపై ఆధారపడి ఉంది. శిక్షణ డేటాలో బాగా ప్రాతినిధ్యం వహించని పంటలకు ఖచ్చితత్వం తక్కువగా ఉండవచ్చు. చికిత్స నిర్ణయాలు తీసుకునే ముందు ఎల్లప్పుడూ AI ఫలితాలను అర్హత కలిగిన వ్యవసాయ నిపుణుని ద్వారా నిర్ధారించండి.",
    footerImportant: "ముఖ్యమైన:",
  },

  datasets: {
    title1: "డేటాసెట్ మరియు",
    titleHighlight: "మోడల్ పారదర్శకత",
    subtitle:
      "మేము బహిరంగ వ్యవసాయ AI లో నమ్మకం కలిగి ఉన్నాము. AgriShield శిక్షణకు ఉపయోగించిన డేటాసెట్‌లు, మోడల్ ఆర్కిటెక్చర్‌లు మరియు తెలిసిన పరిమితుల పూర్తి జాబితా క్రింద ఉంది.",
    species: "జాతులు",
    conditions: "స్థితులు",
    images: "ఫోటోలు",
    viewSource: "మూలం చూడండి",
    coverage: "కవరేజ్",
    limitations: "తెలిసిన పరిమితులు",
  },
};

// ── Translations map ───────────────────────────────────────────────────────

export const TRANSLATIONS: Record<AppLang, DeepStringRecord> = {
  "en-IN": en,
  "hi-IN": hi,
  "te-IN": te,
};

// ── Accessor function ──────────────────────────────────────────────────────
// Resolves dot-nested keys like "analyze.browseFiles"
// Falls back to en-IN if key is missing in the target language

export function getTranslation(lang: AppLang, key: string): string {
  const keys = key.split(".");
  let value: string | DeepStringRecord | undefined = TRANSLATIONS[lang];

  for (const k of keys) {
    if (typeof value !== "object" || value === null) {
      value = undefined;
      break;
    }
    value = (value as DeepStringRecord)[k];
  }

  if (typeof value === "string") return value;

  // Fallback to English
  let fallback: string | DeepStringRecord | undefined = TRANSLATIONS["en-IN"];
  for (const k of keys) {
    if (typeof fallback !== "object" || fallback === null) {
      fallback = undefined;
      break;
    }
    fallback = (fallback as DeepStringRecord)[k];
  }

  if (typeof fallback === "string") return fallback;

  // Last resort: return the key itself
  return key;
}
