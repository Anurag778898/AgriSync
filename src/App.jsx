import { createContext, useContext, useEffect, useState } from "react";

const translations = {
  hi: {
    WORKSPACE: "कार्यस्थल", MORE: "अन्य", Overview: "अवलोकन", Market: "बाज़ार", "My produce": "मेरी उपज", Recommendations: "सुझाव", Weather: "मौसम", Assistant: "सहायक", Notifications: "सूचनाएँ", Settings: "सेटिंग्स", Onion: "प्याज़", Tomato: "टमाटर", Soybean: "सोयाबीन", "Red onion": "लाल प्याज़", "Red · Grade A": "लाल · श्रेणी A", "Hybrid · Grade A": "हाइब्रिड · श्रेणी A", "Yellow · FAQ": "पीला · सामान्य गुणवत्ता", "Grade A · 18 quintals": "श्रेणी A · 18 क्विंटल", "Hybrid · 6 quintals": "हाइब्रिड · 6 क्विंटल",
    "Sample workspace": "नमूना कार्यस्थल", "Good morning, Prasanna.": "सुप्रभात, प्रसन्ना।", "WEDNESDAY · NASHIK, MAHARASHTRA": "बुधवार · नासिक, महाराष्ट्र", "A clear view of your produce, nearby markets, and what may need your attention.": "अपनी उपज, आस-पास के बाज़ारों और ज़रूरी कामों की साफ़ जानकारी देखें।", "TODAY’S MARKET NOTE": "आज की बाज़ार जानकारी", SAMPLE: "नमूना", "Onion prices are firmer across nearby mandis.": "आस-पास की मंडियों में प्याज़ के भाव मज़बूत हैं।", "Sample trend: Lasalgaon is up 4.2% from the previous market day. Compare nearby prices before deciding where to sell.": "नमूना रुझान: लासलगाँव में पिछले बाज़ार दिन से भाव 4.2% ऊपर हैं। बेचने से पहले आस-पास के भावों की तुलना करें।", "Compare markets": "बाज़ारों की तुलना करें", "LOCAL PRICE WATCH": "स्थानीय भाव", "Crops to keep an eye on": "इन फसलों पर नज़र रखें", "All markets": "सभी बाज़ार", "Illustrative sample values · No live market feed connected": "उदाहरण के भाव · लाइव बाज़ार डेटा उपलब्ध नहीं", "YOUR NEXT STEP": "आपका अगला कदम", "Two buyers showed interest.": "दो खरीदारों ने रुचि दिखाई है।", "There are sample enquiries on your tomato listing waiting for a response.": "आपकी टमाटर की सूची पर दो नमूना पूछताछ का जवाब देना बाकी है।", "Review enquiries": "पूछताछ देखें", "Your produce · Sample activity": "आपकी उपज · नमूना गतिविधि", "Plan a better sale": "बेहतर बिक्री की योजना बनाएँ", "Explore sample selling windows and buyer matches": "बिक्री का नमूना समय और खरीदार मिलान देखें", "Check local conditions": "स्थानीय मौसम देखें", "Weather insights for your growing area": "आपके खेती क्षेत्र के मौसम की जानकारी",
    "MARKET INTELLIGENCE": "बाज़ार की जानकारी", "Know your market.": "अपने बाज़ार को समझें।", "Compare sample crop prices from nearby mandis before you make a selling decision.": "बिक्री का निर्णय लेने से पहले आस-पास की मंडियों के उदाहरण भावों की तुलना करें।", "NEARBY MANDIS": "आस-पास की मंडियाँ", "Price board": "भाव सूची", "Search crop or mandi": "फसल या मंडी खोजें", "Crop & grade": "फसल और श्रेणी",  "Modal price": "प्रचलित भाव", "Day change": "दिन का बदलाव", "Data type": "डेटा प्रकार", Sample: "नमूना", "per quintal": "प्रति क्विंटल", "No sample crops match “{query}”. Try a crop or mandi name.": "“{query}” से मेल खाती फसल नहीं मिली। फसल या मंडी का नाम खोजें।", "Values are illustrative only. A live market data source is not connected to this prototype.": "ये केवल उदाहरण हैं। इस प्रोटोटाइप में लाइव बाज़ार डेटा उपलब्ध नहीं है।", "Use prices as a guide, not a guarantee.": "भावों को संकेत मानें, गारंटी नहीं।", "Actual prices vary by date, market, variety, grade, and quality.": "वास्तविक भाव तारीख, मंडी, किस्म, श्रेणी और गुणवत्ता के अनुसार बदलते हैं।",
    "YOUR SUPPLY": "आपकी उपज", "My produce.": "मेरी उपज।", "Keep track of what you have available and who is interested.": "उपलब्ध उपज और उसमें रुचि रखने वाले खरीदारों पर नज़र रखें।", "Add produce": "उपज जोड़ें", "Crop name": "फसल का नाम", "e.g. Green chilli": "जैसे हरी मिर्च", "Save draft": "मसौदा सहेजें", Cancel: "रद्द करें", "This creates a local draft only. Nothing is sent to a server.": "यह केवल इस डिवाइस पर मसौदा बनाएगा। सर्वर पर कुछ नहीं भेजा जाएगा।", "Draft listing · Add quantity and price to publish": "मसौदा सूची · प्रकाशित करने के लिए मात्रा और भाव जोड़ें", "Draft added to this sample workspace.": "इस नमूना कार्यस्थल में मसौदा जोड़ा गया।", "LISTINGS": "सूचियाँ", "Available produce": "उपलब्ध उपज",  "Asking price": "माँगा गया भाव", Active: "सक्रिय", "Buyer interest · 2": "खरीदार की रुचि · 2", "See buyer activity": "खरीदार गतिविधि देखें", "Options for {crop} are a prototype placeholder.": "{crop} के विकल्प अभी प्रोटोटाइप में उपलब्ध नहीं हैं।",
    "DECISION SUPPORT": "निर्णय में सहायता", "Consider your next move.": "अगला कदम सोच-समझकर चुनें।", "Recommendations should help you compare options, not make the decision for you.": "सुझाव विकल्पों की तुलना में मदद करते हैं; अंतिम निर्णय आपका है।", "SAMPLE SELLING WINDOW": "बिक्री का नमूना समय", "Onion · Lasalgaon": "प्याज़ · लासलगाँव", "Illustrative suggestion based on a sample trend. No forecast model or live data is connected.": "यह नमूना रुझान पर आधारित उदाहरण है। कोई पूर्वानुमान मॉडल या लाइव डेटा जुड़ा नहीं है।", "Sample market price": "बाज़ार का नमूना भाव", "WHY THIS SUGGESTION?": "यह सुझाव क्यों?", "What to weigh before selling": "बेचने से पहले इन बातों पर विचार करें", "Recent market movement": "बाज़ार का हालिया रुझान", "Sample prices have moved up over the last few market days.": "नमूने के भाव पिछले कुछ बाज़ार दिनों में बढ़े हैं।", "Storage and quality": "भंडारण और गुणवत्ता", "Factor in holding costs and how long your produce keeps.": "भंडारण का खर्च और उपज कितने समय तक अच्छी रहेगी, यह भी देखें।", "Compare nearby buyers": "आस-पास के खरीदारों की तुलना करें", "Transport and buyer requirements affect the final return.": "ढुलाई और खरीदार की ज़रूरतों से मिलने वाला कुल भाव बदल सकता है।", "Illustration only.": "केवल उदाहरण।", "This sample recommendation is not a price guarantee or a trained model prediction.": "यह नमूना सुझाव भाव की गारंटी या प्रशिक्षित मॉडल का पूर्वानुमान नहीं है।",
    "WEATHER INTELLIGENCE": "मौसम की जानकारी", "Plan around the conditions.": "मौसम के अनुसार योजना बनाएँ।", "A weather view belongs alongside crop and location context. A live forecast is not connected yet.": "मौसम की जानकारी फसल और स्थान के संदर्भ में उपयोगी होती है। अभी लाइव पूर्वानुमान जुड़ा नहीं है।", "SAMPLE LOCATION": "नमूना स्थान", "Nashik district": "नासिक ज़िला", "Maharashtra · Location not verified": "महाराष्ट्र · स्थान की पुष्टि नहीं", "Illustrative only": "केवल उदाहरण", Rainfall: "वर्षा", "Not available": "उपलब्ध नहीं", "Forecast connection needed": "पूर्वानुमान सेवा जोड़ना बाकी", "Field note": "खेती के लिए सुझाव",  "Before planning harvest or transport": "कटाई या ढुलाई की योजना से पहले", "No weather service is connected.": "मौसम सेवा जुड़ी नहीं है।", "Do not use this placeholder to make planting, spraying, or harvest decisions.": "बुवाई, छिड़काव या कटाई का निर्णय इस नमूने के आधार पर न लें।",
    "AGRI ASSISTANT": "कृषि सहायक", "Ask about your next step.": "अगले कदम के बारे में पूछें।", "A simple place to understand market information and AgriSync features.": "बाज़ार की जानकारी और AgriSync की सुविधाएँ समझने की सरल जगह।", "AGRI SYNC ASSISTANT": "एग्रीसिंक सहायक", "Good questions start with good data.": "अच्छे सवालों के लिए सही जानकारी ज़रूरी है।", "This chat is a visual prototype. It does not connect to an AI service or use live AgriSync data.": "यह चैट केवल एक नमूना दृश्य है। यह AI सेवा या AgriSync के लाइव डेटा से जुड़ी नहीं है।", "Try asking": "यह पूछकर देखें", "How do I compare nearby mandi prices?": "आस-पास की मंडियों के भावों की तुलना कैसे करें?", "What should I check before accepting an offer?": "खरीदार का प्रस्ताव स्वीकार करने से पहले क्या जाँचें?", "Saved in this browser session only · No response service connected": "यह सवाल केवल इस ब्राउज़र सत्र में है · जवाब सेवा जुड़ी नहीं", "Ask a question about markets or your produce…": "बाज़ार या अपनी उपज के बारे में पूछें…", "Add question locally": "सवाल जोड़ें", "Questions are displayed locally for this prototype. No advice is generated.": "सवाल केवल इस नमूने में दिखेंगे। कोई सलाह तैयार नहीं होगी।", You: "आप", "UPDATES": "अपडेट", "Your activity.": "आपकी गतिविधि।", "Buyer interest and market changes, gathered in one place.": "खरीदारों की रुचि और बाज़ार के बदलाव एक जगह।", "Buyer interest on your tomato listing": "आपकी टमाटर सूची में खरीदार की रुचि", "2 sample buyer enquiries · Today": "खरीदारों की 2 नमूना पूछताछ · आज", "Onion prices moved in nearby markets": "आस-पास के बाज़ारों में प्याज़ के भाव बदले", "Sample market update · Yesterday": "बाज़ार का नमूना अपडेट · कल", "Weather update for Nashik": "नासिक के मौसम का अपडेट", "Placeholder notification · 2 days ago": "नमूना सूचना · 2 दिन पहले", "Mark read": "पढ़ा हुआ चिह्नित करें",
    PREFERENCES: "पसंद", "Make AgriSync yours.": "AgriSync को अपने अनुसार बनाएँ।", "Set the basics that help keep your workspace clear and useful.": "अपने कार्यस्थल को उपयोगी बनाने के लिए बुनियादी पसंद चुनें।", "Workspace location": "कार्यस्थल का स्थान", "Used for nearby market and weather context": "आस-पास के बाज़ार और मौसम की जानकारी के लिए", "Sample profile": "नमूना प्रोफ़ाइल", Language: "भाषा", "Choose how information is presented": "जानकारी की भाषा चुनें", English: "English", Hindi: "हिन्दी", Marathi: "मराठी", Profile: "प्रोफ़ाइल", "Personal and farm details": "व्यक्तिगत और खेत की जानकारी", "Sample farmer profile": "नमूना किसान प्रोफ़ाइल", "Account features not connected": "खाता सुविधा जुड़ी नहीं", "Preference changes are local to this prototype and are not saved to an account.": "भाषा की पसंद इस नमूने में ही लागू है, खाते में सहेजी नहीं जाती।",
    "Nashik region": "नासिक क्षेत्र", "Preview mode · Data is illustrative": "पूर्वावलोकन · डेटा उदाहरण के लिए है", "Built for better market decisions": "बेहतर बाज़ार निर्णयों के लिए", "Market, in sync.": "बाज़ार, तालमेल में।", "Farmer workspace": "किसान कार्यस्थल", "Prototype workspace": "प्रोटोटाइप कार्यस्थल", "Sample values are clearly marked.": "नमूना जानकारी स्पष्ट रूप से चिह्नित है।", "A softer evening palette": "शाम के लिए आरामदायक रंग", "On · easy on the eyes": "चालू · आँखों के लिए आरामदायक", "Night colors": "रात के रंग", "Toggle night colors": "रात के रंग बदलें", "Close navigation": "नेविगेशन बंद करें", "Open navigation": "नेविगेशन खोलें", "Go to overview": "अवलोकन पर जाएँ", "AgriSync overview": "AgriSync अवलोकन", "Main navigation": "मुख्य नेविगेशन",
  },
  mr: {
    WORKSPACE: "कार्यस्थळ", MORE: "अधिक", Overview: "आढावा", Market: "बाजार", "My produce": "माझे उत्पादन", Recommendations: "शिफारसी", Weather: "हवामान", Assistant: "सहाय्यक", Notifications: "सूचना", Settings: "सेटिंग्ज", Onion: "कांदा", Tomato: "टोमॅटो", Soybean: "सोयाबीन", "Red onion": "लाल कांदा", "Red · Grade A": "लाल · दर्जा A", "Hybrid · Grade A": "संकरित · दर्जा A", "Yellow · FAQ": "पिवळा · सर्वसाधारण दर्जा", "Grade A · 18 quintals": "दर्जा A · 18 क्विंटल", "Hybrid · 6 quintals": "संकरित · 6 क्विंटल",
    "Sample workspace": "नमुना कार्यस्थळ", "Good morning, Prasanna.": "शुभ सकाळ, प्रसन्ना.", "WEDNESDAY · NASHIK, MAHARASHTRA": "बुधवार · नाशिक, महाराष्ट्र", "A clear view of your produce, nearby markets, and what may need your attention.": "तुमचे उत्पादन, जवळचे बाजार आणि लक्ष देण्याच्या गोष्टी एका नजरेत पाहा.", "TODAY’S MARKET NOTE": "आजची बाजार नोंद", SAMPLE: "नमुना", "Onion prices are firmer across nearby mandis.": "जवळच्या बाजारांत कांद्याचे दर मजबूत झाले आहेत.", "Sample trend: Lasalgaon is up 4.2% from the previous market day. Compare nearby prices before deciding where to sell.": "नमुना कल: लासलगावचा दर मागील बाजार दिवसापेक्षा 4.2% वाढला. विक्रीपूर्वी जवळच्या बाजारांचे दर तपासा.", "Compare markets": "बाजारांची तुलना करा", "LOCAL PRICE WATCH": "स्थानिक दर", "Crops to keep an eye on": "या पिकांवर लक्ष ठेवा", "All markets": "सर्व बाजार", "Illustrative sample values · No live market feed connected": "उदाहरणार्थ दर · थेट बाजार माहिती जोडलेली नाही", "YOUR NEXT STEP": "तुमची पुढची कृती", "Two buyers showed interest.": "दोन खरेदीदारांनी रस दाखवला.", "There are sample enquiries on your tomato listing waiting for a response.": "तुमच्या टोमॅटोच्या नोंदीवरील दोन नमुना चौकश्यांना उत्तर देणे बाकी आहे.", "Review enquiries": "चौकश्या पाहा", "Your produce · Sample activity": "तुमचे उत्पादन · नमुना हालचाल", "Plan a better sale": "चांगल्या विक्रीचे नियोजन करा", "Explore sample selling windows and buyer matches": "नमुना विक्री वेळा आणि खरेदीदार जुळणी पाहा", "Check local conditions": "स्थानिक परिस्थिती पाहा", "Weather insights for your growing area": "तुमच्या शेती क्षेत्रातील हवामान माहिती",
    "MARKET INTELLIGENCE": "बाजार माहिती", "Know your market.": "तुमचा बाजार ओळखा.", "Compare sample crop prices from nearby mandis before you make a selling decision.": "विक्रीचा निर्णय घेण्यापूर्वी जवळच्या बाजारांतील नमुना दरांची तुलना करा.", "NEARBY MANDIS": "जवळचे बाजार", "Price board": "दर फलक", "Search crop or mandi": "पीक किंवा बाजार शोधा", "Crop & grade": "पीक आणि दर्जा",  "Modal price": "प्रचलित दर", "Day change": "दिवसातील बदल", "Data type": "माहितीचा प्रकार", Sample: "नमुना", "per quintal": "प्रति क्विंटल", "No sample crops match “{query}”. Try a crop or mandi name.": "“{query}” शी जुळणारे पीक सापडले नाही. पीक किंवा बाजाराचे नाव शोधा.", "Values are illustrative only. A live market data source is not connected to this prototype.": "हे केवळ उदाहरण आहे. या नमुन्यात थेट बाजार माहिती जोडलेली नाही.", "Use prices as a guide, not a guarantee.": "दरांना दिशा समजा, हमी नाही.", "Actual prices vary by date, market, variety, grade, and quality.": "प्रत्यक्ष दर तारीख, बाजार, वाण, दर्जा आणि गुणवत्तेनुसार बदलतात.",
    "YOUR SUPPLY": "तुमचे उत्पादन", "My produce.": "माझे उत्पादन.", "Keep track of what you have available and who is interested.": "उपलब्ध उत्पादन आणि त्यात रस असलेल्या खरेदीदारांचा मागोवा ठेवा.", "Add produce": "उत्पादन जोडा", "Crop name": "पिकाचे नाव", "e.g. Green chilli": "उदा. हिरवी मिरची", "Save draft": "मसुदा जतन करा", Cancel: "रद्द करा", "This creates a local draft only. Nothing is sent to a server.": "यामुळे फक्त या उपकरणावर मसुदा तयार होईल. सर्व्हरवर काही पाठवले जाणार नाही.", "Draft listing · Add quantity and price to publish": "मसुदा नोंद · प्रकाशित करण्यासाठी प्रमाण आणि दर जोडा", "Draft added to this sample workspace.": "या नमुना कार्यस्थळात मसुदा जोडला.", "LISTINGS": "नोंदी", "Available produce": "उपलब्ध उत्पादन", "Asking price": "अपेक्षित दर", Active: "सक्रिय", "Buyer interest · 2": "खरेदीदाराची रुची · 2", "See buyer activity": "खरेदीदारांची हालचाल पाहा", "Options for {crop} are a prototype placeholder.": "{crop} साठीचे पर्याय सध्या नमुना आहेत.",
    "DECISION SUPPORT": "निर्णय सहाय्य", "Consider your next move.": "पुढची चाल विचारपूर्वक ठरवा.", "Recommendations should help you compare options, not make the decision for you.": "शिफारसी पर्यायांची तुलना करण्यास मदत करतात; अंतिम निर्णय तुमचा आहे.", "SAMPLE SELLING WINDOW": "विक्रीची नमुना वेळ", "Onion · Lasalgaon": "कांदा · लासलगाव", "Illustrative suggestion based on a sample trend. No forecast model or live data is connected.": "नमुना कलावर आधारित उदाहरण. अंदाज मॉडेल किंवा थेट माहिती जोडलेली नाही.", "Sample market price": "बाजाराचा नमुना दर", "WHY THIS SUGGESTION?": "ही शिफारस का?", "What to weigh before selling": "विक्रीपूर्वी या गोष्टी तपासा", "Recent market movement": "अलीकडील बाजार कल", "Sample prices have moved up over the last few market days.": "नमुन्यातील दर मागील काही बाजार दिवसांत वाढले आहेत.", "Storage and quality": "साठवण आणि गुणवत्ता", "Factor in holding costs and how long your produce keeps.": "साठवण खर्च आणि उत्पादन किती काळ टिकेल हे लक्षात घ्या.", "Compare nearby buyers": "जवळच्या खरेदीदारांची तुलना करा", "Transport and buyer requirements affect the final return.": "वाहतूक आणि खरेदीदारांच्या गरजांमुळे अंतिम परतावा बदलतो.", "Illustration only.": "केवळ उदाहरण.", "This sample recommendation is not a price guarantee or a trained model prediction.": "ही नमुना शिफारस दराची हमी किंवा प्रशिक्षित मॉडेलचा अंदाज नाही.",
    "WEATHER INTELLIGENCE": "हवामान माहिती", "Plan around the conditions.": "हवामानानुसार नियोजन करा.", "A weather view belongs alongside crop and location context. A live forecast is not connected yet.": "पीक आणि ठिकाणाच्या माहितीसोबत हवामान समजून घ्या. थेट अंदाज सेवा अद्याप जोडलेली नाही.", "SAMPLE LOCATION": "नमुना ठिकाण", "Nashik district": "नाशिक जिल्हा", "Maharashtra · Location not verified": "महाराष्ट्र · ठिकाणाची खात्री नाही", "Illustrative only": "केवळ उदाहरण", Rainfall: "पाऊस", "Not available": "उपलब्ध नाही", "Forecast connection needed": "अंदाज सेवा जोडणे बाकी", "Field note": "शेतासाठी सूचना",  "Before planning harvest or transport": "कापणी किंवा वाहतुकीचे नियोजन करण्यापूर्वी", "No weather service is connected.": "हवामान सेवा जोडलेली नाही.", "Do not use this placeholder to make planting, spraying, or harvest decisions.": "पेरणी, फवारणी किंवा कापणीचे निर्णय या नमुन्यावर घेऊ नका.",
    "AGRI ASSISTANT": "कृषी सहाय्यक", "Ask about your next step.": "पुढच्या कृतीबद्दल विचारा.", "A simple place to understand market information and AgriSync features.": "बाजार माहिती आणि AgriSync वैशिष्ट्ये समजून घेण्याची सोपी जागा.", "AGRI SYNC ASSISTANT": "एग्रीसिंक सहाय्यक", "Good questions start with good data.": "चांगल्या प्रश्नांसाठी योग्य माहिती महत्त्वाची.", "This chat is a visual prototype. It does not connect to an AI service or use live AgriSync data.": "ही चॅट फक्त नमुना आहे. AI सेवा किंवा AgriSync ची थेट माहिती जोडलेली नाही.", "Try asking": "हे विचारून पाहा", "How do I compare nearby mandi prices?": "जवळच्या बाजारांचे दर कसे तपासू?", "What should I check before accepting an offer?": "खरेदीदाराचा प्रस्ताव स्वीकारण्यापूर्वी काय तपासावे?", "Saved in this browser session only · No response service connected": "हा प्रश्न फक्त या ब्राउझर सत्रात आहे · उत्तर सेवा जोडलेली नाही", "Ask a question about markets or your produce…": "बाजार किंवा उत्पादनाबद्दल प्रश्न विचारा…", "Add question locally": "प्रश्न जोडा", "Questions are displayed locally for this prototype. No advice is generated.": "प्रश्न फक्त या नमुन्यात दिसतील. कोणताही सल्ला तयार होत नाही.", You: "तुम्ही", "UPDATES": "अद्यतने", "Your activity.": "तुमची हालचाल.", "Buyer interest and market changes, gathered in one place.": "खरेदीदारांची रुची आणि बाजारातील बदल एका ठिकाणी.", "Buyer interest on your tomato listing": "तुमच्या टोमॅटो नोंदीत खरेदीदाराची रुची", "2 sample buyer enquiries · Today": "खरेदीदारांच्या 2 नमुना चौकश्या · आज", "Onion prices moved in nearby markets": "जवळच्या बाजारांत कांद्याचे दर बदलले", "Sample market update · Yesterday": "बाजाराचे नमुना अद्यतन · काल", "Weather update for Nashik": "नाशिकसाठी हवामान अद्यतन", "Placeholder notification · 2 days ago": "नमुना सूचना · 2 दिवसांपूर्वी", "Mark read": "वाचले म्हणून चिन्हांकित करा",
    PREFERENCES: "प्राधान्ये", "Make AgriSync yours.": "AgriSync तुमच्यानुसार ठेवा.", "Set the basics that help keep your workspace clear and useful.": "तुमचे कार्यस्थळ सोपे आणि उपयोगी ठेवण्यासाठी मूलभूत पसंती निवडा.", "Workspace location": "कार्यस्थळाचे ठिकाण", "Used for nearby market and weather context": "जवळच्या बाजार आणि हवामान माहितीसाठी", "Sample profile": "नमुना प्रोफाइल", Language: "भाषा", "Choose how information is presented": "माहितीची भाषा निवडा", English: "English", Hindi: "हिन्दी", Marathi: "मराठी", Profile: "प्रोफाइल", "Personal and farm details": "वैयक्तिक आणि शेताची माहिती", "Sample farmer profile": "नमुना शेतकरी प्रोफाइल", "Account features not connected": "खाते सुविधा जोडलेली नाही", "Preference changes are local to this prototype and are not saved to an account.": "भाषेची पसंती या नमुन्यापुरती आहे; खात्यात जतन होत नाही.",
    "Nashik region": "नाशिक परिसर", "Preview mode · Data is illustrative": "पूर्वावलोकन · माहिती नमुन्यासाठी आहे", "Built for better market decisions": "चांगल्या बाजार निर्णयांसाठी", "Market, in sync.": "बाजार, समन्वयात.", "Farmer workspace": "शेतकरी कार्यस्थळ", "Prototype workspace": "नमुना कार्यस्थळ", "Sample values are clearly marked.": "नमुना माहिती स्पष्टपणे दाखवली आहे.", "A softer evening palette": "संध्याकाळसाठी सौम्य रंग", "On · easy on the eyes": "सुरू · डोळ्यांना आरामदायी", "Night colors": "रात्रीचे रंग", "Toggle night colors": "रात्रीचे रंग बदला", "Close navigation": "नेव्हिगेशन बंद करा", "Open navigation": "नेव्हिगेशन उघडा", "Go to overview": "आढाव्यावर जा", "AgriSync overview": "AgriSync आढावा", "Main navigation": "मुख्य नेव्हिगेशन"
  }
};

Object.assign(translations.hi, {
  "Nashik, Maharashtra": "\u0928\u093e\u0938\u093f\u0915, \u092e\u0939\u093e\u0930\u093e\u0937\u094d\u091f\u094d\u0930",
  PRODUCE: "\u0909\u092a\u091c", MARKET: "\u092c\u093e\u091c\u093c\u093e\u0930", WEATHER: "\u092e\u094c\u0938\u092e", NOV: "\u0928\u0935\u0902\u092c\u0930",
  "More options for {crop}": "{crop} \u0915\u0947 \u0914\u0930 \u0935\u093f\u0915\u0932\u094d\u092a",
  "Ask a question": "\u090f\u0915 \u0938\u0935\u093e\u0932 \u092a\u0942\u091b\u0947\u0902",
  "No matching crops found. Try a crop or mandi name.": "\u0915\u094b\u0908 \u092e\u0947\u0932 \u0916\u093e\u0924\u0940 \u092b\u0938\u0932 \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u0940\u0964 \u092b\u0938\u0932 \u092f\u093e \u092e\u0902\u0921\u0940 \u0915\u093e \u0928\u093e\u092e \u0916\u094b\u091c\u0947\u0902\u0964",
  "Not set": "\u0924\u092f \u0928\u0939\u0940\u0902"
});
Object.assign(translations.mr, {
  "Nashik, Maharashtra": "\u0928\u093e\u0936\u093f\u0915, \u092e\u0939\u093e\u0930\u093e\u0937\u094d\u091f\u094d\u0930",
  PRODUCE: "\u0909\u0924\u094d\u092a\u093e\u0926\u0928", MARKET: "\u092c\u093e\u091c\u093e\u0930", WEATHER: "\u0939\u0935\u093e\u092e\u093e\u0928", NOV: "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930",
  "More options for {crop}": "{crop} \u0938\u093e\u0920\u0940 \u0905\u0927\u093f\u0915 \u092a\u0930\u094d\u092f\u093e\u092f",
  "Ask a question": "\u090f\u0915 \u092a\u094d\u0930\u0936\u094d\u0928 \u0935\u093f\u091a\u093e\u0930\u093e",
  "No matching crops found. Try a crop or mandi name.": "\u091c\u0941\u0933\u0923\u093e\u0930\u0947 \u092a\u0940\u0915 \u0938\u093e\u092a\u0921\u0932\u0947 \u0928\u093e\u0939\u0940\u0964 \u092a\u093f\u0915\u093e\u091a\u0947 \u0915\u093f\u0902\u0935\u093e \u092c\u093e\u091c\u093e\u0930\u093e\u091a\u0947 \u0928\u093e\u0935 \u0936\u094b\u0927\u093e\u0964",
  "Not set": "\u0920\u0930\u0935\u0932\u0947\u0932\u0947 \u0928\u093e\u0939\u0940"
});

const LanguageContext = createContext("en");
const translate = (language, text) => translations[language]?.[text] ?? text;
function useT() {
  const language = useContext(LanguageContext);
  return (text) => translate(language, text);
}

const navigation = [
  {
    heading: "WORKSPACE",
    items: [
      { label: "Overview", icon: "bi-grid-1x2" },
      { label: "Market", icon: "bi-bar-chart-line" },
      { label: "My produce", icon: "bi-basket2" },
      { label: "Recommendations", icon: "bi-signpost-split" },
    ],
  },
  {
    heading: "MORE",
    items: [
      { label: "Weather", icon: "bi-cloud-sun" },
      { label: "Assistant", icon: "bi-chat-square-text" },
      { label: "Notifications", icon: "bi-bell", badge: "2" },
    ],
  },
];

const crops = [
  { name: "Onion", variety: "Red · Grade A", price: "₹2,180", change: "+4.2%", direction: "up", mandi: "Lasalgaon" },
  { name: "Tomato", variety: "Hybrid · Grade A", price: "₹1,640", change: "−2.1%", direction: "down", mandi: "Pimpalgaon" },
  { name: "Soybean", variety: "Yellow · FAQ", price: "₹4,720", change: "+1.4%", direction: "up", mandi: "Nashik" },
];

const produce = [
  { crop: "Red onion", detail: "Grade A · 18 quintals", price: "₹2,200 / qtl", status: "Active", color: "green" },
  { crop: "Tomato", detail: "Hybrid · 6 quintals", price: "₹1,700 / qtl", status: "Buyer interest · 2", color: "gold" },
];

function Icon({ name, className = "" }) {
  return <i aria-hidden="true" className={`bi ${name} ${className}`} />;
}

function SectionHeading({ eyebrow, title, detail, action }) {
  const t = useT();
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
        <h1>{t(title)}</h1>
        {detail && <p className="heading-detail">{t(detail)}</p>}
      </div>
      {action}
    </div>
  );
}

function DemoFlag() {
  const t = useT();
  return <span className="demo-flag"><span /> {t("Sample workspace")}</span>;
}

function Overview({ onNavigate }) {
  const t = useT();
  return (
    <>
      <SectionHeading
        eyebrow="WEDNESDAY · NASHIK, MAHARASHTRA"
        title="Good morning, Prasanna."
        detail="A clear view of your produce, nearby markets, and what may need your attention."
        action={<DemoFlag />}
      />

      <section className="market-note" aria-labelledby="market-note-title">
        <div className="market-note-copy">
          <p className="eyebrow light-eyebrow">{t("TODAY’S MARKET NOTE")} <span className="sample-label">{t("SAMPLE")}</span></p>
          <h2 id="market-note-title">{t("Onion prices are firmer across nearby mandis.")}</h2>
          <p>{t("Sample trend: Lasalgaon is up 4.2% from the previous market day. Compare nearby prices before deciding where to sell.")}</p>
          <button className="button button-light" onClick={() => onNavigate("Market")}>
            {t("Compare markets")} <Icon name="bi-arrow-up-right" />
          </button>
        </div>
        <div className="market-note-art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="field-line field-line-one" />
          <div className="field-line field-line-two" />
          <div className="field-line field-line-three" />
          <div className="note-crop-label"><Icon name="bi-graph-up-arrow" /> {t("Onion")} <strong>+4.2%</strong></div>
        </div>
        <span className="note-index">01 / MARKET</span>
      </section>

      <div className="overview-grid">
        <section className="surface watchlist" aria-labelledby="watchlist-title">
          <div className="surface-heading">
            <div><p className="eyebrow">{t("LOCAL PRICE WATCH")}</p><h2 id="watchlist-title">{t("Crops to keep an eye on")}</h2></div>
            <button className="text-button" onClick={() => onNavigate("Market")}>{t("All markets")} <Icon name="bi-arrow-right" /></button>
          </div>
          <div className="crop-list">
            {crops.map((crop, index) => (
              <div className="crop-row" key={crop.name}>
                <div className={`crop-mark crop-mark-${index + 1}`}>{t(crop.name).slice(0, 1)}</div>
                <div className="crop-name"><strong>{t(crop.name)}</strong><span>{t(crop.variety)}</span></div>
                <div className="crop-market"><span>{crop.mandi}</span><strong>{crop.price}</strong></div>
                <span className={`change-pill ${crop.direction}`}>{crop.change}</span>
              </div>
            ))}
          </div>
          <p className="data-caption">{t("Illustrative sample values · No live market feed connected")}</p>
        </section>

        <section className="attention-panel" aria-labelledby="attention-title">
          <p className="eyebrow">{t("YOUR NEXT STEP")}</p>
          <div className="attention-icon"><Icon name="bi-inbox" /></div>
          <h2 id="attention-title">{t("Two buyers showed interest.")}</h2>
          <p>{t("There are sample enquiries on your tomato listing waiting for a response.")}</p>
          <button className="button button-outline" onClick={() => onNavigate("My produce")}>{t("Review enquiries")} <Icon name="bi-arrow-right" /></button>
          <span className="attention-foot">{t("Your produce · Sample activity")}</span>
        </section>
      </div>

      <div className="lower-grid">
        <button className="quick-link" onClick={() => onNavigate("Recommendations")}>
          <span className="quick-icon"><Icon name="bi-signpost-split" /></span>
          <span><strong>{t("Plan a better sale")}</strong><small>{t("Explore sample selling windows and buyer matches")}</small></span>
          <Icon name="bi-arrow-up-right" className="quick-arrow" />
        </button>
        <button className="quick-link" onClick={() => onNavigate("Weather")}>
          <span className="quick-icon weather-icon"><Icon name="bi-cloud-sun" /></span>
          <span><strong>{t("Check local conditions")}</strong><small>{t("Weather insights for your growing area")}</small></span>
          <Icon name="bi-arrow-up-right" className="quick-arrow" />
        </button>
      </div>
    </>
  );
}

function MarketPage() {
  const t = useT();
  const [query, setQuery] = useState("");
  const filteredCrops = crops.filter((crop) => `${t(crop.name)} ${crop.mandi}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <SectionHeading eyebrow="MARKET INTELLIGENCE" title="Know your market." detail="Compare sample crop prices from nearby mandis before you make a selling decision." action={<DemoFlag />} />
      <section className="surface market-table-wrap">
        <div className="surface-heading market-tools">
          <div><p className="eyebrow">{t("NEARBY MANDIS")}</p><h2>{t("Price board")}</h2></div>
          <label className="search-box"><Icon name="bi-search" /><span className="visually-hidden">{t("Search crop or mandi")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search crop or mandi")} /></label>
        </div>
        <div className="table-scroll"><table className="market-table"><thead><tr><th>{t("Crop & grade")}</th><th>{t("Market")}</th><th>{t("Modal price")}</th><th>{t("Day change")}</th><th>{t("Data type")}</th></tr></thead>
          <tbody>{filteredCrops.map((crop) => <tr key={crop.name}><td><strong>{t(crop.name)}</strong><span>{t(crop.variety)}</span></td><td>{crop.mandi}</td><td className="price-cell">{crop.price}<small>{t("per quintal")}</small></td><td><span className={`change-pill ${crop.direction}`}>{crop.change}</span></td><td><span className="sample-tag">{t("Sample")}</span></td></tr>)}</tbody>
        </table>{filteredCrops.length === 0 && <p className="empty-state">{t("No matching crops found. Try a crop or mandi name.")} {query && <strong>({query})</strong>}</p>}</div>
        <p className="data-caption table-caption">{t("Values are illustrative only. A live market data source is not connected to this prototype.")}</p>
      </section>
      <aside className="info-strip"><Icon name="bi-info-circle" /><p><strong>{t("Use prices as a guide, not a guarantee.")}</strong> {t("Actual prices vary by date, market, variety, grade, and quality.")}</p></aside>
    </>
  );
}

function ProducePage({ onNavigate }) {
  const t = useT();
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [items, setItems] = useState(produce);
  const [cropName, setCropName] = useState("");
  const addProduce = (event) => {
    event.preventDefault();
    if (!cropName.trim()) return;
    setItems([{ crop: cropName.trim(), detail: "Draft listing · Add quantity and price to publish", price: t("Not set"), status: "Draft", color: "gold" }, ...items]);
    setCropName("");
    setShowForm(false);
    setNotice(t("Draft added to this sample workspace."));
  };
  return (
    <>
      <SectionHeading eyebrow="YOUR SUPPLY" title="My produce." detail="Keep track of what you have available and who is interested." action={<button className="button button-primary" onClick={() => { setShowForm(!showForm); setNotice(""); }}><Icon name="bi-plus-lg" /> {t("Add produce")}</button>} />
      {showForm && <form className="inline-form" onSubmit={addProduce}><label htmlFor="crop-name">{t("Crop name")}</label><input id="crop-name" value={cropName} onChange={(event) => setCropName(event.target.value)} placeholder={t("e.g. Green chilli")} required /><button className="button button-primary" type="submit">{t("Save draft")}</button><button className="text-button" type="button" onClick={() => setShowForm(false)}>{t("Cancel")}</button><span className="form-note">{t("This creates a local draft only. Nothing is sent to a server.")}</span></form>}
      {notice && <p className="inline-notice" role="status">{notice}</p>}
      <section className="surface produce-surface"><div className="surface-heading"><div><p className="eyebrow">{t("LISTINGS")}</p><h2>{t("Available produce")} <span className="count-badge">{items.length}</span></h2></div><span className="sample-tag">{t("Sample workspace")}</span></div>
        <div className="produce-list">{items.map((item, index) => <article className="produce-row" key={`${item.crop}-${index}`}><div className="produce-emblem"><Icon name="bi-basket2" /></div><div className="produce-info"><strong>{t(item.crop)}</strong><span>{t(item.detail)}</span></div><div className="produce-price"><span>{t("Asking price")}</span><strong>{item.price}</strong></div><span className={`status-label ${item.color}`}><span />{t(item.status)}</span><button className="icon-button" aria-label={`${t("More options for {crop}").replace("{crop}", t(item.crop))}`} onClick={() => setNotice(t("Options for {crop} are a prototype placeholder.").replace("{crop}", t(item.crop)))}><Icon name="bi-three-dots-vertical" /></button></article>)}</div>
        <button className="text-button lower-action" onClick={() => onNavigate("Notifications")}>{t("See buyer activity")} <Icon name="bi-arrow-right" /></button>
      </section>
    </>
  );
}

function RecommendationsPage() {
  const t = useT();
  return <>
    <SectionHeading eyebrow="DECISION SUPPORT" title="Consider your next move." detail="Recommendations should help you compare options, not make the decision for you." action={<DemoFlag />} />
    <div className="recommendation-layout"><section className="recommendation-feature"><p className="eyebrow light-eyebrow">{t("SAMPLE SELLING WINDOW")}</p><div className="rec-date"><span>07</span><span>{t("NOV")}</span></div><div><h2>{t("Onion · Lasalgaon")}</h2><p>{t("Illustrative suggestion based on a sample trend. No forecast model or live data is connected.")}</p></div><div className="rec-price"><span>{t("Sample market price")}</span><strong>₹2,180 <small>/ {t("per quintal")}</small></strong></div></section>
      <section className="surface why-panel"><p className="eyebrow">{t("WHY THIS SUGGESTION?")}</p><h2>{t("What to weigh before selling")}</h2><ul className="reason-list"><li><span className="reason-mark up"><Icon name="bi-arrow-up" /></span><span><strong>{t("Recent market movement")}</strong><small>{t("Sample prices have moved up over the last few market days.")}</small></span></li><li><span className="reason-mark neutral"><Icon name="bi-box-seam" /></span><span><strong>{t("Storage and quality")}</strong><small>{t("Factor in holding costs and how long your produce keeps.")}</small></span></li><li><span className="reason-mark neutral"><Icon name="bi-geo-alt" /></span><span><strong>{t("Compare nearby buyers")}</strong><small>{t("Transport and buyer requirements affect the final return.")}</small></span></li></ul></section></div>
    <div className="info-strip"><Icon name="bi-exclamation-circle" /><p><strong>{t("Illustration only.")}</strong> {t("This sample recommendation is not a price guarantee or a trained model prediction.")}</p></div>
  </>;
}

function WeatherPage() {
  const t = useT();
  return <>
    <SectionHeading eyebrow="WEATHER INTELLIGENCE" title="Plan around the conditions." detail="A weather view belongs alongside crop and location context. A live forecast is not connected yet." action={<DemoFlag />} />
    <section className="weather-panel"><div className="weather-location"><p className="eyebrow light-eyebrow">{t("SAMPLE LOCATION")}</p><h2>{t("Nashik district")}</h2><span>{t("Maharashtra · Location not verified")}</span></div><div className="weather-reading"><Icon name="bi-cloud-sun" /><strong>28°</strong><span>{t("Illustrative only")}</span></div><div className="weather-detail"><span>{t("Rainfall")}</span><strong>{t("Not available")}</strong><span>{t("Forecast connection needed")}</span></div><div className="weather-detail"><span>{t("Field note")}</span><strong>{t("Check local conditions")}</strong><span>{t("Before planning harvest or transport")}</span></div></section>
    <div className="info-strip"><Icon name="bi-info-circle" /><p><strong>{t("No weather service is connected.")}</strong> {t("Do not use this placeholder to make planting, spraying, or harvest decisions.")}</p></div>
  </>;
}

function AssistantPage() {
  const t = useT();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setMessages([...messages, question.trim()]);
    setQuestion("");
  };
  return <>
    <SectionHeading eyebrow="AGRI ASSISTANT" title="Ask about your next step." detail="A simple place to understand market information and AgriSync features." action={<DemoFlag />} />
    <section className="assistant-shell"><div className="assistant-intro"><div className="assistant-emblem"><Icon name="bi-chat-square-text" /></div><div><p className="eyebrow">{t("AGRI SYNC ASSISTANT")}</p><h2>{t("Good questions start with good data.")}</h2><p>{t("This chat is a visual prototype. It does not connect to an AI service or use live AgriSync data.")}</p></div></div>
      <div className="suggestion-row"><span>{t("Try asking")}</span><button onClick={() => setQuestion(t("How do I compare nearby mandi prices?"))}>{t("How do I compare nearby mandi prices?")}</button><button onClick={() => setQuestion(t("What should I check before accepting an offer?"))}>{t("What should I check before accepting an offer?")}</button></div>
      {messages.map((message, index) => <div className="local-message" key={`${message}-${index}`}><span>{t("You")}</span><p>{message}</p><small>{t("Saved in this browser session only · No response service connected")}</small></div>)}
      <form className="chat-composer" onSubmit={sendMessage}><label className="visually-hidden" htmlFor="assistant-question">{t("Ask a question")}</label><input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("Ask a question about markets or your produce…")} /><button className="button button-primary" type="submit" aria-label={t("Add question locally")}><Icon name="bi-arrow-up" /></button></form><p className="composer-note">{t("Questions are displayed locally for this prototype. No advice is generated.")}</p>
    </section>
  </>;
}

function NotificationsPage() {
  const t = useT();
  const [read, setRead] = useState([]);
  const notifications = [{ id: "interest", icon: "bi-hand-thumbs-up", title: "Buyer interest on your tomato listing", detail: "2 sample buyer enquiries · Today", group: "PRODUCE" }, { id: "market", icon: "bi-graph-up-arrow", title: "Onion prices moved in nearby markets", detail: "Sample market update · Yesterday", group: "MARKET" }, { id: "weather", icon: "bi-cloud-sun", title: "Weather update for Nashik", detail: "Placeholder notification · 2 days ago", group: "WEATHER" }];
  return <><SectionHeading eyebrow="UPDATES" title="Your activity." detail="Buyer interest and market changes, gathered in one place." action={<DemoFlag />} /><section className="surface notification-list">{notifications.map((item) => <article className={`notification-row ${read.includes(item.id) ? "is-read" : ""}`} key={item.id}><span className="notification-icon"><Icon name={item.icon} /></span><div className="notification-copy"><span className="eyebrow">{t(item.group)} · {t("SAMPLE")}</span><strong>{t(item.title)}</strong><small>{t(item.detail)}</small></div>{!read.includes(item.id) && <button className="text-button" onClick={() => setRead([...read, item.id])}>{t("Mark read")}</button>}</article>)}</section></>;
}

function SettingsPage({ language, onLanguageChange }) {
  const t = useT();
  return <><SectionHeading eyebrow="PREFERENCES" title="Make AgriSync yours." detail="Set the basics that help keep your workspace clear and useful." action={<DemoFlag />} /><section className="surface settings-list"><div className="setting-row"><div><strong>{t("Workspace location")}</strong><small>{t("Used for nearby market and weather context")}</small></div><span>{t("Nashik, Maharashtra")} <small>{t("Sample profile")}</small></span></div><div className="setting-row"><div><strong>{t("Language")}</strong><small>{t("Choose how information is presented")}</small></div><select value={language} onChange={(event) => onLanguageChange(event.target.value)} aria-label={t("Language")}><option value="en" lang="en">{t("English")}</option><option value="hi" lang="hi">{t("Hindi")}</option><option value="mr" lang="mr">{t("Marathi")}</option></select></div><div className="setting-row"><div><strong>{t("Profile")}</strong><small>{t("Personal and farm details")}</small></div><span>{t("Sample farmer profile")} <small>{t("Account features not connected")}</small></span></div></section><p className="settings-note">{t("Preference changes are local to this prototype and are not saved to an account.")}</p></>;
}

const pageComponents = {
  Overview,
  Market: MarketPage,
  "My produce": ProducePage,
  Recommendations: RecommendationsPage,
  Weather: WeatherPage,
  Assistant: AssistantPage,
  Notifications: NotificationsPage,
  Settings: SettingsPage,
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Overview");
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem("agrisync-theme") === "dark");
  const [language, setLanguage] = useState(() => window.localStorage.getItem("agrisync-language") || "en");
  const Page = pageComponents[activePage];

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("agrisync-theme", theme);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("agrisync-language", language);
    document.title = `${translate(language, "AgriSync overview")} — ${translate(language, "Market, in sync.")}`;
  }, [language]);

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <LanguageContext.Provider value={language}>
    <div className={`app-container ${darkMode ? "theme-dark" : ""}`} lang={language}>
      <header className="mobile-header">
        <button className="mobile-brand" onClick={() => navigate("Overview")} aria-label={translate(language, "Go to overview")}><span className="brand-mark">a</span> AgriSync</button>
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={translate(language, sidebarOpen ? "Close navigation" : "Open navigation")} aria-expanded={sidebarOpen} aria-controls="app-navigation"><Icon name={sidebarOpen ? "bi-x-lg" : "bi-list"} /></button>
      </header>

      {sidebarOpen && <button className="sidebar-overlay" aria-label={translate(language, "Close navigation")} onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button className="sidebar-brand" onClick={() => navigate("Overview")} aria-label={translate(language, "AgriSync overview")}>
          <span className="brand-mark">a</span><span className="brand-info"><strong>AgriSync</strong><small>{translate(language, "Market, in sync.")}</small></span>
        </button>
        <div className="workspace-switch"><span className="workspace-avatar">P</span><span><strong>Prasanna Unde</strong><small>{translate(language, "Farmer workspace")}</small></span><Icon name="bi-chevron-expand" /></div>
        <nav id="app-navigation" className="sidebar-navigation" aria-label={translate(language, "Main navigation")}>
          {navigation.map((group) => <div className="menu-group" key={group.heading}><p className="menu-heading">{translate(language, group.heading)}</p>{group.items.map((item) => <button key={item.label} className={`menu-item ${activePage === item.label ? "active" : ""}`} onClick={() => navigate(item.label)} aria-current={activePage === item.label ? "page" : undefined}><Icon name={item.icon} className="menu-icon" /><span>{translate(language, item.label)}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</button>)}</div>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><Icon name="bi-info-circle" /><span><strong>{translate(language, "Prototype workspace")}</strong><small>{translate(language, "Sample values are clearly marked.")}</small></span></div>
          <div className="theme-switch-row">
            <span className="theme-switch-label"><Icon name={darkMode ? "bi-moon-stars" : "bi-sun"} /><span><strong>{translate(language, "Night colors")}</strong><small>{translate(language, darkMode ? "On · easy on the eyes" : "A softer evening palette")}</small></span></span>
            <button className={`theme-toggle ${darkMode ? "is-on" : ""}`} type="button" role="switch" aria-checked={darkMode} aria-label={translate(language, "Toggle night colors")} onClick={() => setDarkMode((enabled) => !enabled)}><span /></button>
          </div>
          <button className={`menu-item ${activePage === "Settings" ? "active" : ""}`} onClick={() => navigate("Settings")} aria-current={activePage === "Settings" ? "page" : undefined}><Icon name="bi-sliders2" className="menu-icon" /><span>{translate(language, "Settings")}</span></button>
          <div className="sidebar-footer">{translate(language, "Built for better market decisions")}</div>
        </div>
      </aside>

      <main className="main-content"><div className="page-topline"><span><Icon name="bi-geo-alt" /> {translate(language, "Nashik region")}</span><span className="preview-status"><span /> {translate(language, "Preview mode · Data is illustrative")}</span></div><div className="page-content"><Page onNavigate={navigate} language={language} onLanguageChange={setLanguage} /></div><footer className="app-footer"><span>AgriSync</span><span>{translate(language, "Know the market. Choose with confidence.")}</span></footer></main>
    </div>
    </LanguageContext.Provider>
  );
}

export default App;
