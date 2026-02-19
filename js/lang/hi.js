const { areasOfCountry, carriersOf, countryCodeOf } = require('../areasOfCountry')

const format = (cc, n) => `+${cc}(${n.toString().padStart(2, '0')})`

/* global process */
require('dotenv').config()
const HIDE_BANK_PAYMENT = process.env.HIDE_BANK_PAYMENT
const SELF_URL = process.env.SELF_URL
const FREE_LINKS = Number(process.env.FREE_LINKS)
const SUPPORT_USERNAME = process.env.SUPPORT_USERNAME

const HIDE_SMS_APP = process.env.HIDE_SMS_APP
const HIDE_BECOME_RESELLER = process.env.HIDE_BECOME_RESELLER
const TG_HANDLE = process.env.TG_HANDLE
const TG_CHANNEL = process.env.TG_CHANNEL
const SMS_APP_NAME = process.env.SMS_APP_NAME
const SMS_APP_LINK = process.env.SMS_APP_LINK
const CHAT_BOT_NAME = process.env.CHAT_BOT_NAME
const CHAT_BOT_BRAND = process.env.CHAT_BOT_BRAND
const SUPPORT_HANDLE = process.env.SUPPORT_HANDLE
const APP_SUPPORT_LINK = process.env.APP_SUPPORT_LINK

const PRICE_DAILY = Number(process.env.PRICE_DAILY_SUBSCRIPTION)
const PRICE_WEEKLY = Number(process.env.PRICE_WEEKLY_SUBSCRIPTION)
const PRICE_MONTHLY = Number(process.env.PRICE_MONTHLY_SUBSCRIPTION)
const DAILY_PLAN_FREE_DOMAINS = Number(process.env.DAILY_PLAN_FREE_DOMAINS)
const WEEKLY_PLAN_FREE_DOMAINS = Number(process.env.WEEKLY_PLAN_FREE_DOMAINS)
const FREE_LINKS_HOURS = Number(process.env.FREE_LINKS_TIME_SECONDS) / 60 / 60
const MONTHLY_PLAN_FREE_DOMAINS = Number(process.env.MONTHLY_PLAN_FREE_DOMAINS)
const DAILY_PLAN_FREE_VALIDATIONS = Number(process.env.DAILY_PLAN_FREE_VALIDATIONS)
const WEEKLY_PLAN_FREE_VALIDATIONS = Number(process.env.WEEKLY_PLAN_FREE_VALIDATIONS)
const MONTHLY_PLAN_FREE_VALIDATIONS = Number(process.env.MONTHLY_PLAN_FREE_VALIDATIONS)

const HOSTING_STARTER_PLAN_PRICE = parseFloat(process.env.HOSTING_STARTER_PLAN_PRICE)
const HOSTING_PRO_PLAN_PRICE = parseFloat(process.env.HOSTING_PRO_PLAN_PRICE)
const HOSTING_BUSINESS_PLAN_PRICE = parseFloat(process.env.HOSTING_BUSINESS_PLAN_PRICE)
const VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE = parseFloat(process.env.VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE) || 50

const npl = {
  // New Zealand
  Spark: ['Spark'],
  Vocus: ['Vocus'],
  '2Degrees/Voyager': ['Voyager'],
  'Skinny Mobile': ['Skinny Mobile'],
  // Australia
  Telstra: ['Telstra'],
  Optus: ['Optus'],
  Vodafone: ['VODAFONE', 'Vodafone'],
  // UK
  EE: ['EE'],
  Three: ['Three'],
  'Virgin/O2': ['Virgin'],
}

const alcazar = {
  'T-mobile': ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  'Metro PCS': ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  Sprint: ['T-MOBILE', 'OMNIPOINT', 'METROPCS', 'SPRINT', 'AERIAL'],
  'Verizon Wireless': ['CELLCO', 'ONVOY'],
  'AT&T': ['CINGULAR'],
}

// Note: these button labels must not mix with each other, other wise it may mess up bot
const admin = {
  viewAnalytics: '📊 विश्लेषण देखें',
  viewUsers: '👀 उपयोगकर्ता देखें',
  blockUser: '✋ उपयोगकर्ता को ब्लॉक करें',
  unblockUser: '👌 उपयोगकर्ता को अनब्लॉक करें',
  messageUsers: '👋 सभी उपयोगकर्ताओं को संदेश भेजें',
}
const user = {
  // main keyboards
  cPanelWebHostingPlans: 'रूस cPanel होस्टिंग प्लान 🔒',
  pleskWebHostingPlans: 'रूस Plesk होस्टिंग प्लान ',
  joinChannel: '📢 चैनल जॉइन करें',
  phoneNumberLeads: '🎯 लीड्स खरीदें | अपने सत्यापित करें',
  hostingDomainsRedirect: '🌐 ऑफ़शोर होस्टिंग',
  cloudPhone: '📞 CloudPhone ˢᵖᵉᵉᶜʰᶜᵘᵉ',
  wallet: '👛 मेरा वॉलेट',
  urlShortenerMain: `🔗✂️ URL छोटा करें - ${FREE_LINKS} ट्रायल लिंक`,
  vpsPlans: 'बुलेटप्रूफ VPS🛡️ खरीदें - प्रति घंटा/मासिक',
  buyPlan: '⚡ प्लान अपग्रेड करें',
  domainNames: '🌐 Register Bulletproof Domain ¹⁰⁰⁰⁺ ᵀᴸᴰ',
  viewPlan: '📋 मेरी सदस्यताएं',
  becomeReseller: '💼 पुनर्विक्रेता बनें',
  getSupport: '💬 सहायता प्राप्त करें',
  freeTrialAvailable: '📧🆓 BulkSMS - फ्री ट्रायल',
  changeSetting: '🌍 सेटिंग्स बदलें',

  // Sub Menu 1: urlShortenerMain
  redSelectUrl: '🔀✂️ रीडायरेक्ट और छोटा करें',
  redBitly: '✂️ Bit.ly',
  redShortit: '✂️ Shortit (परीक्षण)',
  urlShortener: '✂️🌐 कस्टम डोमेन शॉर्टनर',
  viewShortLinks: '📊 शॉर्टलिंक एनालिटिक्स देखें',

  // Sub Menu 2: domainNames
  buyDomainName: '🛒🌐 डोमेन नाम खरीदें',
  viewDomainNames: '📂 मेरे डोमेन नाम',
  dnsManagement: '🔧 DNS प्रबंधन',

  // Sub Menu 3: cPanel/Plesk WebHostingPlansMain
  freeTrial: '💡 फ्री ट्रायल',
  starterPlan: '🔼 स्टार्टर प्लान',
  proPlan: '🔷 प्रो प्लान',
  businessPlan: '👑 बिज़नेस प्लान',
  contactSupport: '📞 समर्थन से संपर्क करें',

  // Sub Menu 4: VPS Plans
  buyVpsPlan: '⚙️ नया VPS बनाएँ',
  manageVpsPlan: '🖥️ VPS देखें/प्रबंधित करें',
  manageVpsSSH: '🔑 SSH कुंजी',

  // Free Trial
  freeTrialMenuButton: '🚀 फ्री ट्रायल (12 घंटे)',
  getFreeTrialPlanNow: '🛒 अभी ट्रायल प्लान प्राप्त करें',
  continueWithDomainNameSBS: websiteName => `➡️ ${websiteName} के साथ जारी रखें`,
  searchAnotherDomain: '🔍 दूसरा डोमेन खोजें',
  privHostNS: '🏢 PrivHost (तेज़ और सुरक्षित होस्टिंग)',
  cloudflareNS: '🛡️ Cloudflare शील्ड (सुरक्षा और गुप्तता)',
  backToFreeTrial: '⬅️ फ्री ट्रायल पर वापस जाएं',

  // Paid Plans
  buyStarterPlan: '🛒 स्टार्टर प्लान खरीदें',
  buyProPlan: '🛒 प्रो प्लान खरीदें',
  buyBusinessPlan: '🛒 बिज़नेस प्लान खरीदें',
  viewStarterPlan: '🔷 स्टार्टर प्लान देखें',
  viewProPlan: '🔼 प्रो प्लान देखें',
  viewBusinessPlan: '👑 बिज़नेस प्लान देखें',
  backToHostingPlans: '⬅️ होस्टिंग प्लान्स पर वापस जाएं',
  registerANewDomain: '🌐 नया डोमेन पंजीकृत करें',
  useExistingDomain: '🔄 मौजूदा डोमेन का उपयोग करें',
  backToStarterPlanDetails: '⬅️ स्टार्टर प्लान विवरण पर वापस जाएं',
  backToProPlanDetails: '⬅️ प्रो प्लान विवरण पर वापस जाएं',
  backToBusinessPlanDetails: '⬅️ बिज़नेस प्लान विवरण पर वापस जाएं',
  continueWithDomain: websiteName => `➡️ ${websiteName} के साथ जारी रखें`,
  enterAnotherDomain: '🔍 दूसरा डोमेन दर्ज करें',
  backToPurchaseOptions: '⬅️ खरीद विकल्पों पर वापस जाएं',
}

const u = {
  // other key boards
  deposit: '➕💵 जमा',
  withdraw: '➖💵 वापस लें',

  // wallet
  usd: 'USD',
  ngn: 'NGN',
}
const view = num => Number(num).toFixed(2)
const yesNo = ['हाँ', 'नहीं']

const bal = (usd, ngn) =>
  HIDE_BANK_PAYMENT !== 'true'
    ? `$${view(usd)}
₦${view(ngn)}`
    : `$${view(usd)}`

const dnsEntryFormat = `रिकॉर्ड प्रारूप:
        •       A रिकॉर्ड (वेबसाइट के लिए अनिवार्य) / CNAME (वैकल्पिक, A रिकॉर्ड के साथ सह-अस्तित्व नहीं रख सकता)
        •       होस्ट नाम: उपडोमेन (उदा. : auth) या रूट के लिए '@' (वैकल्पिक)
        •       मान: A के लिए IP पता / CNAME के लिए होस्टनाम

कृपया नीचे दिए गए प्रारूप का उपयोग करके अपना रिकॉर्ड दर्ज करें:

उदाहरण:
✅ A रिकॉर्ड: A pay 192.0.2.1 (या A 192.0.2.1 यदि कोई होस्ट नाम नहीं है)
✅ CNAME रिकॉर्ड: CNAME pay 0oaawzt7.up.railway.app (या CNAME 0oaawzt7.up.railway.app यदि कोई होस्ट नाम नहीं है)`

const t = {
  yes: 'हाँ',
  no: 'नहीं',
  back: 'वापस',
  cancel: 'रद्द करें',
  skip: 'छोड़ें',
  becomeReseller: `नमस्ते,

मैं आपको ${CHAT_BOT_BRAND}Bot के शक्तिशाली एसएमएस मार्केटिंग और होस्टिंग सॉफ़्टवेयर का पुनर्विक्रेता बनने का एक शानदार अवसर प्रदान करने के लिए संपर्क कर रहा हूँ।

मुख्य विवरण:

लाभ साझेदारी: प्रत्येक बिक्री पर 65/35% का प्रतिस्पर्धी हिस्सा कमाएं।

सेट-अप शुल्क: विवरण के लिए समर्थन से संपर्क करें।

रुचि है? इस लाभदायक साझेदारी के बारे में अधिक जानने के लिए 💬 सहायता प्राप्त करें बटन दबाएं।

आपके साथ संभावित सहयोग की प्रतीक्षा है!

शुभकामनाएँ,

${CHAT_BOT_BRAND} टीम
`,
  resetLoginAdmit: `${CHAT_BOT_BRAND} एसएमएस: आप अपने पिछले डिवाइस से सफलतापूर्वक लॉग आउट हो गए हैं। कृपया अब लॉग इन करें।`,
  resetLoginDeny: 'ठीक है, कोई और कार्रवाई की आवश्यकता नहीं है।',
  resetLogin: `${CHAT_BOT_BRAND} एसएमएस: क्या आप अपने पिछले डिवाइस से लॉग आउट करने की कोशिश कर रहे हैं?`,
  select: `कृपया एक विकल्प चुनें:`,
  urlShortenerSelect: `अपने लिंक छोटा करें, ब्रांड करें या ट्रैक करें:`,

  // cPanel/Plesk Plans initial select plan text
  selectPlan: `कृपया एक योजना चुनें:`,
  backButton: '⬅️ वापस',
  yesProceedWithThisEmail: email => `➡️ ${email} के साथ आगे बढ़ें`,
  proceedWithPayment: '➡️ भुगतान के साथ आगे बढ़ें',
  iHaveSentThePayment: `मैंने भुगतान भेज दिया है ✅`,
  trialAlreadyUsed: `आपने पहले ही अपना मुफ्त ट्रायल उपयोग कर लिया है। यदि आपको अधिक पहुंच की आवश्यकता है, तो कृपया हमारे किसी भुगतान वाले योजना की सदस्यता लेने पर विचार करें।`,
  oneHourLeftToExpireTrialPlan: `आपकी Freedom योजना 1 घंटे में समाप्त होने वाली है। यदि आप हमारी सेवाओं का उपयोग जारी रखना चाहते हैं, तो भुगतान योजना में अपग्रेड करने पर विचार करें!`,
  freePlanExpired: `🚫 आपकी Freedom योजना समाप्त हो गई है। हमें उम्मीद है कि आपने अपना ट्रायल पसंद किया होगा। हमारी सेवाओं का उपयोग जारी रखने के लिए, कृपया हमारे प्रीमियम योजनाओं में से एक खरीदें।`,
  freeTrialPlanSelected: hostingType => `
- हमारे <b>Freedom योजना</b> को निःशुल्क आज़माएं! इस योजना में एक निःशुल्क डोमेन शामिल है, जिसका अंत .sbs पर होता है और यह 12 घंटे के लिए सक्रिय रहेगा।

🚀 <b>Freedom योजना:</b>
<b>- स्टोरेज:</b> 1 GB SSD
<b>- बैंडविड्थ:</b> 10 GB
<b>- डोमेन:</b> 1 निःशुल्क .sbs डोमेन
<b>- ईमेल खाते:</b> 1 ईमेल खाता
<b>- डेटाबेस:</b> 1 MySQL डेटाबेस
<b>- मुफ्त SSL:</b> हां
<b>- ${hostingType} सुविधाएँ:</b> ${hostingType} के लिए फ़ाइलें, डेटाबेस और ईमेल प्रबंधित करने हेतु पूर्ण पहुंच।
<b>- अवधि:</b> 12 घंटे तक सक्रिय
<b>- आदर्श उपयोग:</b> परीक्षण और लघुकालीन परियोजनाओं के लिए।
  `,

  getFreeTrialPlan: `कृपया अपनी इच्छित डोमेन नाम (उदा., example.sbs) दर्ज करें और इसे संदेश के रूप में भेजें। यह डोमेन .sbs में समाप्त होगा और आपके ट्रायल प्लान के साथ मुफ्त है।`,
  trialPlanContinueWithDomainNameSBSMatched: websiteName => `डोमेन ${websiteName} उपलब्ध है!`,
  trialPlanSBSDomainNotMatched: `आपके द्वारा दर्ज किया गया डोमेन नहीं मिला। कृपया सही डोमेन सुनिश्चित करें या किसी अन्य का उपयोग करें।`,
  trialPlanSBSDomainIsPremium: `डोमेन प्रीमियम मूल्य पर है और केवल भुगतान योजना के साथ उपलब्ध है। कृपया अन्य डोमेन खोजें।`,
  trialPlanGetNowInvalidDomain: `कृपया एक मान्य डोमेन नाम दर्ज करें जो '.sbs' पर समाप्त होता है। डोमेन 'example.sbs' जैसा दिखना चाहिए और आपके ट्रायल प्लान के साथ मुफ्त है।`,
  trialPlanNameserverSelection: websiteName => `कृपया ${websiteName} के लिए उपयोग करने के लिए नाम सर्वर प्रदाता चुनें।`,
  trialPlanDomainNameMatched: `कृपया अपना खाता बनाने और अपनी रसीद भेजने के लिए अपना ईमेल पता प्रदान करें।`,
  confirmEmailBeforeProceedingSBS: email =>
    `क्या आप निश्चित हैं कि आप इस ${email} ईमेल के साथ Freedom योजना सदस्यता के लिए आगे बढ़ना चाहते हैं?`,
  trialPlanInValidEmail: `कृपया एक मान्य ईमेल प्रदान करें।`,
  trialPlanActivationConfirmation: `धन्यवाद! आपका मुफ्त ट्रायल प्लान जल्द ही सक्रिय होगा। कृपया ध्यान दें, यह योजना केवल 12 घंटे के लिए सक्रिय रहेगी।`,
  trialPlanActivationInProgress: `आपका मुफ्त ट्रायल प्लान सक्रिय हो रहा है। इसमें कुछ क्षण लग सकते हैं...`,

  what: `यह विकल्प अभी उपलब्ध नहीं है। कृपया नीचे दिए बटनों में से चुनें।`,
  whatNum: `कृपया एक मान्य संख्या चुनें।`,
  phoneGenTimeout: `समय समाप्त।`,
  phoneGenNoGoodHits: `कृपया 💬 सहायता प्राप्त करें बटन दबाएं या किसी अन्य क्षेत्र कोड का चयन करें।`,

  subscribeRCS: p =>
    `सदस्यता ली गई! ${p} पर क्लिक करके कभी भी <a href="${SELF_URL}/unsubscribe?a=b&Phone=${p}">लिंक</a> से सदस्यता समाप्त करें।`,
  unsubscribeRCS: p =>
    `आपने सदस्यता समाप्त कर दी है! पुनः सदस्यता लेने के लिए <a href="${SELF_URL}/subscribe?a=b&Phone=${p}">लिंक</a> पर क्लिक करें।`,
  argsErr: `डिव: गलत तर्क भेजे गए।`,
  showDepositNgnInfo:
    ngn => `कृपया नीचे "भुगतान करें" पर क्लिक करके ${ngn} NGN भेजें। एक बार लेन-देन की पुष्टि हो जाने पर, आपको तुरंत सूचित किया जाएगा और आपका वॉलेट अपडेट कर दिया जाएगा।

सादर,  
${CHAT_BOT_NAME}`,
  askEmail: `कृपया भुगतान पुष्टि के लिए एक ईमेल प्रदान करें।`,
  askValidAmount: 'कृपया एक मान्य संख्या प्रदान करें।',
  askValidEmail: 'कृपया एक मान्य ईमेल प्रदान करें।',
  askValidCrypto: 'कृपया एक मान्य क्रिप्टो करेंसी चुनें।',
  askValidPayOption: 'कृपया एक मान्य भुगतान विकल्प चुनें।',
  chooseSubscription:
    HIDE_SMS_APP === 'true'
      ? `<b>अपना प्लान चुनें</b>

<b>दैनिक</b> — $${PRICE_DAILY}
${DAILY_PLAN_FREE_DOMAINS} डोमेन · ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()} वैलिडेशन · असीमित लिंक

<b>साप्ताहिक</b> — $${PRICE_WEEKLY}
${WEEKLY_PLAN_FREE_DOMAINS} डोमेन · ${WEEKLY_PLAN_FREE_VALIDATIONS.toLocaleString()} वैलिडेशन · असीमित लिंक

<b>मासिक</b> — $${PRICE_MONTHLY}
${MONTHLY_PLAN_FREE_DOMAINS} डोमेन · ${MONTHLY_PLAN_FREE_VALIDATIONS.toLocaleString()} वैलिडेशन · असीमित लिंक

<i>सभी प्लान में मुफ्त .sbs/.xyz डोमेन + असीमित URL शॉर्टनिंग शामिल है।</i>`
      : `<b>अपना प्लान चुनें</b>

<b>दैनिक</b> — $${PRICE_DAILY}
${DAILY_PLAN_FREE_DOMAINS} डोमेन · ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()} वैलिडेशन · असीमित लिंक + BulkSMS

<b>साप्ताहिक</b> — $${PRICE_WEEKLY}
${WEEKLY_PLAN_FREE_DOMAINS} डोमेन · ${WEEKLY_PLAN_FREE_VALIDATIONS.toLocaleString()} वैलिडेशन · असीमित लिंक + BulkSMS

<b>मासिक</b> — $${PRICE_MONTHLY}
${MONTHLY_PLAN_FREE_DOMAINS} डोमेन · ${MONTHLY_PLAN_FREE_VALIDATIONS.toLocaleString()} वैलिडेशन · असीमित लिंक + BulkSMS

<i>सभी प्लान में मुफ्त .sbs/.xyz डोमेन + असीमित URL शॉर्टनिंग शामिल है।</i>`,

  askCoupon: usd =>
    `मूल्य $${usd} है। क्या आप कूपन कोड लगाना चाहेंगे? यदि आपके पास है, तो कृपया इसे अभी दर्ज करें। अन्यथा, "स्किप" पर क्लिक करें।`,
  planAskCoupon: `क्या आप कूपन कोड लगाना चाहेंगे? यदि आपके पास है, तो कृपया इसे अभी दर्ज करें। अन्यथा, "स्किप" पर क्लिक करें।`,
  enterCoupon: `कृपया एक कूपन कोड दर्ज करें:`,
  planPrice: (plan, price) => `${plan} सब्सक्रिप्शन की कीमत $${price} है। कृपया भुगतान विधि चुनें।`,
  planNewPrice: (plan, price, newPrice) =>
    `${plan} सब्सक्रिप्शन की कीमत अब $${view(newPrice)} <s>($${price})</s> है। कृपया भुगतान विधि चुनें।`,
  domainPrice: (domain, price) => `${domain} डोमेन की कीमत $${price} USD है। भुगतान विधि चुनें।`,
  domainNewPrice: (domain, price, newPrice) =>
    `${domain} डोमेन की कीमत अब $${view(newPrice)} <s>($${price})</s> है। भुगतान विधि चुनें।`,
  couponInvalid: `अमान्य कूपन कोड। कृपया पुनः कूपन कोड दर्ज करें:`,
  lowPrice: `भेजी गई कीमत आवश्यक से कम है।`,
  freeTrialAvailable: `आपका BulkSMS नि:शुल्क परीक्षण अब सक्षम है। कृपया ${SMS_APP_LINK} पर ${SMS_APP_NAME} Android ऐप डाउनलोड करें। क्या आपको ई-सिम कार्ड की ज़रूरत है? 💬 सहायता प्राप्त करें बटन दबाएं।`,
  freeTrialNotAvailable: `आप पहले ही नि:शुल्क परीक्षण का उपयोग कर चुके हैं।`,
  planSubscribed:
    HIDE_SMS_APP === 'true'
      ? `आपने {{plan}} प्लान को सफलतापूर्वक सब्सक्राइब कर लिया है! मुफ्त ".sbs/.xyz" डोमेन, असीमित Shortit लिंक और मुफ्त USA फोन वैलिडेशन का आनंद लें। E-sim चाहिए? 💬 सहायता प्राप्त करें बटन दबाएं।`
      : `आपने {{plan}} प्लान को सफलतापूर्वक सब्सक्राइब कर लिया है! मुफ्त ".sbs/.xyz" डोमेन, असीमित Shortit लिंक, मुफ्त USA वैलिडेशन और ${SMS_APP_NAME} का आनंद लें। एप्लिकेशन यहाँ डाउनलोड करें: ${SMS_APP_LINK}। E-sim चाहिए? 💬 सहायता प्राप्त करें बटन दबाएं।`,
  alreadySubscribedPlan: days => `आपकी सदस्यता सक्रिय है और ${days} दिनों में समाप्त होगी।`,
  payError: `भुगतान सत्र नहीं मिला। कृपया पुनः प्रयास करें या 💬 सहायता प्राप्त करें बटन दबाएं। अधिक जानकारी ${TG_HANDLE} पर प्राप्त करें।`,
  chooseFreeDomainText: `<b>शानदार खबर!</b> यह डोमेन आपके सब्सक्रिप्शन के साथ मुफ्त में उपलब्ध है। क्या आप इसे दावा करना चाहेंगे?`,

  chooseDomainToBuy: text =>
    `<b>वेबसाइट का हिस्सा बनाएं!</b> कृपया वह डोमेन नाम साझा करें जिसे आप खरीदना चाहते हैं, जैसे कि "abcpay.com". ${text}`,
  askDomainToUseWithShortener: `क्या आप इस डोमेन के साथ संक्षेपण उपयोग करना चाहते हैं?`,
  blockUser: `कृपया उस उपयोगकर्ता का उपयोगकर्ता नाम साझा करें जिसे ब्लॉक करना है।`,
  unblockUser: `कृपया उस उपयोगकर्ता का उपयोगकर्ता नाम साझा करें जिसे अनब्लॉक करना है।`,
  blockedUser: `आप फिलहाल बॉट के उपयोग से अवरुद्ध हैं। कृपया 💬 सहायता प्राप्त करें बटन दबाएं. ${TG_HANDLE} पर अधिक जानें।`,
  greet: `${CHAT_BOT_BRAND} — URL छोटा करें, डोमेन रजिस्टर करें, फोन लीड्स खरीदें और Telegram से अपना बिज़नेस बढ़ाएं।

${FREE_LINKS} Shortit ट्रायल लिंक से शुरू करें — /start
सहायता: 💬 सहायता प्राप्त करें बटन दबाएं`,
  linkExpired: `${CHAT_BOT_BRAND} परीक्षण समाप्त हो गया है और आपका संक्षेपित लिंक निष्क्रिय हो गया है। हम URL सेवा और मुफ्त डोमेन नामों तक पहुंच बनाए रखने के लिए सब्सक्राइब करने के लिए आमंत्रित करते हैं। उपयुक्त योजना चुनें और सब्सक्राइब करने के निर्देशों का पालन करें। किसी भी प्रश्न के लिए हमें संपर्क करें।
सादर,
${CHAT_BOT_BRAND} टीम
${TG_CHANNEL} पर अधिक जानें।`,
  successPayment: `भुगतान सफलतापूर्वक संसाधित हो गया! इस विंडो को अब बंद करें।`,
  welcome: `${CHAT_BOT_NAME} को चुनने के लिए धन्यवाद! कृपया नीचे एक विकल्प चुनें :`,
  welcomeFreeTrial: `${CHAT_BOT_BRAND} में आपका स्वागत है! आपके पास ${FREE_LINKS} Shortit ट्रायल लिंक हैं URL छोटा करने के लिए। असीमित Shortit लिंक, मुफ्त ".sbs/.xyz" डोमेन और मुफ्त USA फोन वैलिडेशन के लिए सब्सक्राइब करें। ${CHAT_BOT_BRAND} का अनुभव करें!`,
  unknownCommand: `कमांड नहीं मिला। /start दबाएं या 💬 सहायता प्राप्त करें बटन दबाएं। ${TG_HANDLE} पर अधिक जानें।`,
  support: `कृपया 💬 सहायता प्राप्त करें बटन दबाएं. ${TG_HANDLE} पर अधिक जानें।`,
  joinChannel: `कृपया चैनल ${TG_CHANNEL} में शामिल हों।`,
  dnsPropagated: `{{domain}} के लिए DNS प्रसार समाप्त हो गया है और अनलिमिटेड URL संक्षेपण के लिए उपलब्ध है।`,
  dnsNotPropagated: `{{domain}} के लिए DNS प्रसार जारी है और आपको अपडेट किया जाएगा जब यह समाप्त हो जाए। ✅`,
  domainBoughtSuccess: domain => `डोमेन ${domain} अब आपका है। धन्यवाद कि आपने हमें चुना।

सादर,
${CHAT_BOT_NAME}`,

  domainBought: `आपका डोमेन {{domain}} अब आपके खाते से जोड़ा गया है जबकि DNS प्रसार जारी है। आप जल्द ही स्थिति से स्वचालित रूप से अपडेट हो जाएंगे।🚀`,
  domainLinking: domain =>
    `डोमेन आपके खाते से लिंक कर रहे हैं। कृपया ध्यान दें कि DNS अपडेट में 30 मिनट तक का समय लग सकता है। आप यहां अपने DNS अपडेट स्थिति की जांच कर सकते हैं: https://www.whatsmydns.net/#A/${domain}`,
  errorSavingDomain: `डोमेन को सर्वर पर सहेजने में त्रुटि, समर्थन 💬 सहायता प्राप्त करें बटन दबाएं। ${TG_HANDLE} पर अधिक जानें।`,
  chooseDomainToManage: `कृपया चयन करें यदि आप DNS सेटिंग्स प्रबंधित करना चाहते हैं।`,
  chooseDomainWithShortener: `कृपया वह डोमेन नाम चुनें या खरीदें जिसे आप अपने संक्षेपित लिंक से कनेक्ट करना चाहते हैं।`,
  viewDnsRecords: (records, domain) => `यह हैं ${domain} के DNS रिकॉर्ड

A रिकॉर्ड (वैकल्पिक, लेकिन सीधे IP मैपिंग के लिए आवश्यक)
${
  records.A && records.A.length
    ? records.A.map(
        record => `<strong>${record.index}. A रिकॉर्ड</strong>
  • होस्ट नाम: ${record.recordName}
  • A रिकॉर्ड मान: ${record.recordContent ? record.recordContent : 'कोई नहीं'}`,
      ).join('\n')
    : '  • A रिकॉर्ड: कोई नहीं'
}

NS रिकॉर्ड (अनिवार्य – डोमेन रिज़ॉल्यूशन के लिए आवश्यक)
${
  records.NS && records.NS.length
    ? records.NS.map(
        record => `<strong>${record.index}. NS रिकॉर्ड ${record.nsId}</strong> ${record.recordContent}`,
      ).join('\n\n')
    : '  • NS रिकॉर्ड: कोई नहीं'
}

CNAME रिकॉर्ड (वैकल्पिक, लेकिन किसी अन्य डोमेन को A रिकॉर्ड के बजाय एलिएस करने के लिए आवश्यक)
${
  records.CNAME && records.CNAME.length
    ? records.CNAME.map(
        record => `<strong>${record.index}. CNAME रिकॉर्ड</strong>
  • होस्ट नाम: ${record.recordName}
  • CNAME रिकॉर्ड मान: ${record.recordContent ? record.recordContent : 'कोई नहीं'}`,
      ).join('\n')
    : '  • CNAME रिकॉर्ड: कोई नहीं'
}`,

  addDns: `DNS रिकॉर्ड जोड़ें`,
  updateDns: `DNS रिकॉर्ड अपडेट करें`,
  deleteDns: `DNS रिकॉर्ड हटाएं`,
  addDnsTxt: `कृपया वह रिकॉर्ड प्रकार चुनें जिसे आप जोड़ना चाहते हैं:`,
  updateDnsTxt: `कृपया वह रिकॉर्ड आईडी टाइप करें जिसे आप अपडेट करना चाहते हैं। i.e 3`,
  deleteDnsTxt: `कृपया वह रिकॉर्ड आईडी टाइप करें जिसे आप हटाना चाहते हैं। i.e 3`,
  confirmDeleteDnsTxt: `क्या आप निश्चित हैं? हां या नहीं`,
  a: `A रिकॉर्ड`,
  cname: `CNAME रिकॉर्ड`,
  ns: `NS रिकॉर्ड`,
  'A रिकॉर्ड': `A`,
  'CNAME रिकॉर्ड': `CNAME`,
  'NS रिकॉर्ड': `NS`,
  askDnsContent: {
    A: dnsEntryFormat,
    'A रिकॉर्ड': dnsEntryFormat,

    CNAME: dnsEntryFormat,
    'CNAME रिकॉर्ड': dnsEntryFormat,

    NS: `कृपया अपना NS रिकॉर्ड दर्ज करें। i.e., dell.ns.cloudflare.com. एक नया NS रिकॉर्ड मौजूदा रिकॉर्ड में जोड़ा जाएगा।`,
    'NS रिकॉर्ड': `कृपया अपना NS रिकॉर्ड दर्ज करें। i.e., dell.ns.cloudflare.com .यदि N1-N4 पहले से मौजूद है, तो कृपया रिकॉर्ड को अपडेट करें`,
  },
  askUpdateDnsContent: {
    A: dnsEntryFormat,
    'A रिकॉर्ड': dnsEntryFormat,
    CNAME: dnsEntryFormat,
    'CNAME रिकॉर्ड': dnsEntryFormat,
    NS: `चयनित आईडी के लिए नया NS रिकॉर्ड अपडेट किया जाएगा। एक नया रिकॉर्ड जोड़ने के लिए, कृपया "DNS रिकॉर्ड जोड़ें" चुनें`,
    'NS रिकॉर्ड': `चयनित आईडी के लिए नया NS रिकॉर्ड अपडेट किया जाएगा। एक नया रिकॉर्ड जोड़ने के लिए, कृपया "DNS रिकॉर्ड जोड़ें" चुनें`,
  },
  dnsRecordSaved: `रिकॉर्ड जोड़ा गया`,
  dnsRecordDeleted: `रिकॉर्ड हटाया गया`,
  dnsRecordUpdated: `रिकॉर्ड अपडेट किया गया`,
  provideLink: `कृपया एक वैध यूआरएल प्रदान करें। उदाहरण के लिए https://google.com`,
  comingSoonWithdraw: `निकासी अभी उपलब्ध नहीं है। मदद चाहिए? 💬 सहायता प्राप्त करें बटन दबाएं।`,
  promoOptOut: `आपने प्रचार संदेशों से अनसब्सक्राइब कर दिया है। कभी भी /start_promos टाइप करके फिर से सब्सक्राइब करें।`,
  promoOptIn: `आपने प्रचार संदेशों की फिर से सदस्यता ले ली है। आपको हमारे नवीनतम ऑफर और डील प्राप्त होंगे!`,
  selectCurrencyToDeposit: `कृपया जमा करने के लिए मुद्रा चुनें`,
  depositNGN: `कृपया एनजीएन राशि दर्ज करें:`,
  askEmailForNGN: `कृपया भुगतान की पुष्टि के लिए ईमेल प्रदान करें`,
  depositUSD: `कृपया USD राशि दर्ज करें, ध्यान दें कि न्यूनतम मूल्य $10 है:`,
  selectCryptoToDeposit: `कृपया एक क्रिप्टो मुद्रा चुनें:`,
  'bank-pay-plan': (priceNGN, plan) =>
    `कृपया "भुगतान करें" पर क्लिक करके ${priceNGN} NGN भेजें। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका ${plan} योजना सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,
  bankPayDomain: (priceNGN, domain) =>
    `कृपया "भुगतान करें" पर क्लिक करके ${priceNGN} NGN भेजें। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका डोमेन ${domain} सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,
  showDepositCryptoInfoPlan: (priceCrypto, tickerView, address, plan) =>
    `कृपया ${priceCrypto} ${tickerView} को\n\n<code>${address}</code> भेजें

कृपया ध्यान दें कि क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका ${plan} योजना सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,
  showDepositCryptoInfoDomain: (priceCrypto, tickerView, address, domain) =>
    `कृपया ${priceCrypto} ${tickerView} को\n\n<code>${address}</code> भेजें

कृपया ध्यान दें कि क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। एक बार जब लेनदेन की पुष्टि हो जाती है, तो आप स्वचालित रूप से सूचित किए जाएंगे और आपका डोमेन ${domain} सुचारू रूप से सक्रिय हो जाएगा।

संपर्क: ${CHAT_BOT_NAME}`,

  showDepositCryptoInfo: (priceCrypto, tickerView, address) =>
    `कृपया ${priceCrypto} ${tickerView} भेजें\n\n<code>${address}</code>\n\nकृपया ध्यान दें, क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। लेन-देन की पुष्टि होने के बाद आपको तुरंत सूचना दी जाएगी और आपके वॉलेट को अपडेट किया जाएगा।\n\nसादर,\n${CHAT_BOT_NAME}`,

  confirmationDepositMoney: (amount, usd) =>
    `आपकी ${amount} ($${usd}) की राशि संसाधित हो गई है। हमें चुनने के लिए धन्यवाद।\nसादर,\n${CHAT_BOT_NAME}`,

  showWallet: (usd, ngn) => `वॉलेट शेष राशि :\n\n${bal(usd, ngn)}`,

  wallet: (usd, ngn) => `वॉलेट शेष राशि :\n\n${bal(usd, ngn)}\n\nवॉलेट विकल्प का चयन करें :`,

  walletSelectCurrency: (usd, ngn) =>
    `कृपया अपने वॉलेट बैलेंस से भुगतान के लिए मुद्रा का चयन करें :\n\n${bal(usd, ngn)}`,

  walletBalanceLow: `आपका वॉलेट बैलेंस कम है। "👛 मेरा वॉलेट" → "➕💵 जमा" पर टैप करके रिचार्ज करें।`,

  sentLessMoney: (expected, got) =>
    `आपने अपेक्षित राशि से कम पैसा भेजा, इसलिए हम प्राप्त राशि को आपके वॉलेट में क्रेडिट कर चुके हैं। हमसे ${expected} की उम्मीद थी लेकिन हमने ${got} प्राप्त की।`,

  sentMoreMoney: (expected, got) =>
    `आपने अपेक्षित राशि से अधिक पैसा भेजा, इसलिए हमने अतिरिक्त राशि को आपके वॉलेट में क्रेडिट कर दिया। हमसे ${expected} की उम्मीद थी लेकिन हमने ${got} प्राप्त की।`,

  buyLeadsError: `दुर्भाग्यवश चयनित क्षेत्र कोड उपलब्ध नहीं है और आपका वॉलेट चार्ज नहीं किया गया है।`,
  buyLeadsProgress: (i, total) =>
    `${((i * 100) / total).toFixed()}% लीड्स डाउनलोड किए जा रहे हैं। कृपया प्रतीक्षा करें.`,

  phoneNumberLeads: `सत्यापित फ़ोन लीड खरीदें या अपने नंबर मान्य करें:`,

  buyLeadsSelectCountry: `कृपया देश का चयन करें`,
  buyLeadsSelectSmsVoice: `कृपया एसएमएस / वॉयस चुनें`,
  buyLeadsSelectArea: `कृपया क्षेत्र का चयन करें`,
  buyLeadsSelectAreaCode: `कृपया क्षेत्र कोड का चयन करें`,
  buyLeadsSelectCarrier: `कृपया ऑपरेटर का चयन करें`,
  buyLeadsSelectCnam: `क्या आप मालिक का नाम देखना चाहते हैं? CNAME प्रति 1000 लीड्स के लिए अतिरिक्त 15 डॉलर की लागत है।`,
  buyLeadsSelectAmount: (min, max) =>
    `आप कितनी लीड्स खरीदना चाहते हैं? एक संख्या चुनें या दर्ज करें। न्यूनतम ${min} और अधिकतम ${max}।`,

  buyLeadsSelectFormat: `फॉर्मेट चुनें, जैसे लोकल (212) या इंटरनेशनल (+1212)`,

  buyLeadsSuccess: n => `बधाई हो, आपकी ${n} लीड्स डाउनलोड की गई हैं।`,

  buyLeadsNewPrice: (leads, price, newPrice) => ` ${leads} लीड्स की कीमत अब $${view(newPrice)} <s>($${price})</s> है।`,
  buyLeadsPrice: (leads, price) => ` ${leads} लीड्स की कीमत $${price} है।`,

  confirmNgn: (usd, ngn) => `${usd} USD ≈ ${ngn} NGN `,

  walletSelectCurrencyConfirm: `पुष्ट करें?`,

  validatorSelectCountry: `कृपया देश का चयन करें`,
  validatorPhoneNumber: `कृपया अपने नंबर पेस्ट करें या फाइल अपलोड करें जिसमें देश का कोड शामिल हो।`,
  validatorSelectSmsVoice: n =>
    `${n} फ़ोन नंबर पाए गए हैं। कृपया एसएमएस या वॉयस कॉल लीड्स की मान्यता के लिए विकल्प चुनें।`,
  validatorSelectCarrier: `कृपया ऑपरेटर का चयन करें`,
  validatorSelectCnam: `क्या आप मालिक का नाम देखना चाहते हैं? CNAME प्रति 1000 लीड्स के लिए अतिरिक्त 15 डॉलर की लागत है।`,
  validatorSelectAmount: (min, max) =>
    `आप कितने नंबरों की मान्यता चाहते हैं? एक संख्या चुनें या दर्ज करें। न्यूनतम ${min} और अधिकतम ${max}`,

  validatorSelectFormat: `फॉर्मेट चुनें, जैसे लोकल (212) या इंटरनेशनल (+1212)`,

  validatorSuccess: (n, m) => `${n} लीड्स की मान्यता हुई। ${m} मान्य फ़ोन नंबर पाए गए हैं।`,
  validatorProgress: (i, total) =>
    `${((i * 100) / total).toFixed()}% लीड्स मान्य किए जा रहे हैं। कृपया प्रतीक्षा करें.`,
  validatorProgressFull: (i, total) => `${((i * 100) / total).toFixed()}% लीड्स मान्य किए जा रहे हैं।`,

  validatorError: `दुर्भाग्यवश चयनित फ़ोन नंबर उपलब्ध नहीं हैं और आपका वॉलेट चार्ज नहीं किया गया है।`,
  validatorErrorFileData: `अवैध देश फ़ोन नंबर पाया गया। कृपया चयनित देश के लिए फ़ोन नंबर अपलोड करें।`,
  validatorErrorNoPhonesFound: `कोई फ़ोन नंबर नहीं मिला। पुनः प्रयास करें।`,

  validatorBulkNumbersStart: `लीड्स मान्यता की शुरुआत हो गई है और जल्द ही समाप्त होगी।`,

  // url re-director
  redSelectUrl: `कृपया वह यूआरएल साझा करें जिसे आप संक्षिप्त और विश्लेषित करना चाहते हैं। उदाहरण के लिए https://cnn.com`,
  redSelectRandomCustom: `कृपया अपने चयन के लिए यादृच्छिक या कस्टम लिंक चुनें`,
  redSelectProvider: `लिंक प्रदाता चुनें`,
  redSelectCustomExt: `कस्टम पिछला भाग दर्ज करें`,

  redValidUrl: `कृपया एक मान्य यूआरएल प्रदान करें। उदाहरण के लिए https://google.com`,
  redTakeUrl: url => `आपका संक्षिप्त यूआरएल है: ${url}`,
  redIssueUrlBitly: `लिंक शॉर्टनिंग विफल हुई। आपका वॉलेट चार्ज नहीं हुआ। कृपया पुनः प्रयास करें या 💬 सहायता प्राप्त करें बटन दबाएं।`,
  redIssueSlugCuttly: `वांछित लिंक नाम पहले से ही लिया गया है, कृपया दूसरा प्रयास करें।`,
  redIssueUrlCuttly: `लिंक शॉर्टनिंग विफल हुई। कृपया पुनः प्रयास करें या 💬 सहायता प्राप्त करें बटन दबाएं।`,
  freeLinksExhausted: `आपके सभी ${FREE_LINKS} Shortit ट्रायल लिंक समाप्त हो गए हैं! असीमित Shortit लिंक, मुफ्त ".sbs/.xyz" डोमेन और अधिक के लिए सब्सक्राइब करें। प्लान चुनने के लिए "🔔 सब्सक्राइब करें" दबाएं।`,
  linksRemaining: (count, total) => `आपके पास ${count}/${total || FREE_LINKS} Shortit ट्रायल लिंक शेष हैं।`,
  redNewPrice: (price, newPrice) =>
    `कीमत अब $${view(newPrice)} <s>($${price})</s> है। कृपया भुगतान पद्धति का चयन करें।`,
  customLink: 'कस्टम लिंक',
  randomLink: 'रैंडम लिंक',
  askShortLinkExtension: 'कृपया हमें अपनी पसंदीदा शॉर्ट लिंक एक्सटेंशन बताएं: जैसे payer',
  linkAlreadyExist: `लिंक पहले से मौजूद है। कृपया 'ok' टाइप करें और दूसरा प्रयास करें।`,
  yourShortendUrl: shortUrl => `आपका शॉर्ट किया हुआ URL है: ${shortUrl}`,

  availablefreeDomain: (plan, available, s) =>
    `याद रखें, आपके ${plan} योजना में ${available} ".sbs/.xyz" डोमेन फ्री शामिल हैं${s}. आज ही अपना डोमेन प्राप्त करें!`,
  shortenedUrlLink: `कृपया वह यूआरएल साझा करें जिसे आप छोटा और विश्लेषित करना चाहते हैं। ई.g https://cnn.com`,
  selectedTrialPlan: `आपने फ्री ट्रायल योजना चुनी है`,
  userPressedBtn: message => `उपयोगकर्ता ने ${message} बटन दबाया।`,
  userToBlock: userToBlock => `उपयोगकर्ता ${userToBlock} नहीं मिला।`,
  userBlocked: userToBlock => `उपयोगकर्ता ${userToBlock} को ब्लॉक कर दिया गया है।`,
  checkingDomainAvail: `डोमेन उपलब्धता की जांच की जा रही है...`,
  checkingExistingDomainAvail: `मौजूदा डोमेन की उपलब्धता की जांच की जा रही है...`,
  subscribeFirst: `📋 सबसे पहले सदस्यता लें`,
  freeValidationUsed: (amount, remaining) => `${amount} USA फोन नंबर आपकी सब्सक्रिप्शन से वैलिडेट हुए! शेष मुफ्त वैलिडेशन: ${remaining.toLocaleString()}।`,
  partialFreeValidation: (freeAmount, totalAmount, paidAmount, paidPrice) => `आपके पास ${freeAmount.toLocaleString()} मुफ्त वैलिडेशन शेष हैं। आपने ${totalAmount.toLocaleString()} नंबरों का अनुरोध किया है।\n\n${freeAmount.toLocaleString()} मुफ्त में होंगे, और शेष ${paidAmount.toLocaleString()} के लिए $${paidPrice} का भुगतान करना होगा। कृपया नीचे भुगतान करें।`,
  notValidHalf: `एक वैध बैक हाफ दर्ज करें`,
  linkAlreadyExist: `लिंक पहले से मौजूद है। कृपया कोई अन्य आजमाएं।`,
  issueGettingPrice: `मूल्य प्राप्त करने में समस्या`,
  domainInvalid: `डोमेन नाम अमान्य है। कृपया कोई अन्य डोमेन नाम आजमाएं। उपयोग प्रारूप abcpay.com`,
  chooseValidPlan: `कृपया एक वैध योजना चुनें`,
  noDomainFound: `कोई डोमेन नाम नहीं मिला`,
  chooseValidDomain: `कृपया एक वैध डोमेन चुनें`,
  errorDeletingDns: error => `डीएनएस रिकॉर्ड को हटाने में त्रुटि, ${error}, कृपया फिर से मूल्य प्रदान करें`,
  selectValidOption: `सही विकल्प चुनें`,
  maxDnsRecord: `अधिकतम 4 NS रिकॉर्ड जोड़े जा सकते हैं, आप पहले के NS रिकॉर्ड को अपडेट या हटा सकते हैं`,
  errorSavingDns: error => `डीएनएस रिकॉर्ड को बचाने में त्रुटि, ${error}, कृपया फिर से मूल्य प्रदान करें`,
  fileError: `फाइल प्रोसेसिंग के दौरान त्रुटि हुई।`,
  ammountIncorrect: `राशि गलत है`,
  subscriptionExpire: (subscribedPlan, timeEnd) => `आपका ${subscribedPlan} योजना समाप्त हो गया है ${timeEnd}`,
  plansSubscripedtill: (subscribedPlan, timeEnd) =>
    `आप ${subscribedPlan} योजना में सदस्यता ले चुके हैं। आपका प्लान ${timeEnd} तक वैध है`,
  planNotSubscriped: `आप वर्तमान में किसी भी योजना के सदस्य नहीं हैं।`,
  noShortenedUrlLink: `आपके पास अभी कोई संक्लिष्ट लिंक नहीं है।`,
  shortenedLinkText: linksText => `यहां आपके संक्लिष्ट लिंक हैं:\n${linksText}`,

  qrCodeText: `यह आपका क्यूआर कोड है!`,
  scanQrOrUseChat: chatId =>
    `क्यूआर को स्कैन करें SMS मार्केटिंग ऐप के साथ लॉगिन करने के लिए। आप इस कोड का उपयोग करके भी लॉगिन कर सकते हैं: ${chatId}`,
  domainPurchasedFailed: (domain, buyDomainError) =>
    `डोमेन खरीद विफल, एक अन्य नाम का प्रयास करें। ${domain} ${buyDomainError}`,
  noDomainRegistered: 'आपके पास अभी तक कोई खरीदा हुआ डोमेन नहीं है।',
  registeredDomainList: domainsText => `यहाँ आपके खरीदे हुए डोमेन हैं:\n${domainsText}`,
  comingSoon: `जल्द आ रहा है`,
  goBackToCoupon: '❌ वापस जाएं और कूपन लागू करें',
  errorFetchingCryptoAddress: 'क्रिप्टोक्यूरेंसी पता प्राप्त करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।',
  paymentSuccessFul: '✅ भुगतान सफल! आपका आदेश प्रोसेस हो रहा है। विवरण जल्द ही उपलब्ध होंगे।',

  // कॉल फॉरवर्डिंग (Cloud Phone)
  fwdInsufficientBalance: (walletBal, rate) => `🚫 <b>अपर्याप्त बैलेंस</b>\n\n💳 $${(walletBal || 0).toFixed(2)} · $${rate}/मिनट आवश्यक\n👉 👛 वॉलेट से <b>$25</b> रिचार्ज करें।`,
  fwdBlocked: (number) => `🚫 <b>अवरुद्ध</b> — ${number} प्रीमियम गंतव्य है।\n💬 <b>सहायता प्राप्त करें</b> दबाएं।`,
  fwdNotRoutable: (number) => `⚠️ ${number} उपलब्ध नहीं। नंबर जांचें या 💬 <b>सहायता प्राप्त करें</b> दबाएं।`,
  fwdValidating: '⏳ सत्यापन हो रहा है...',
  fwdEnterNumber: (rate, walletBal) => {
    let text = `देश कोड सहित नंबर दर्ज करें (उदा: +14155551234)\n💰 <b>$${rate}/मिनट</b>`
    if (walletBal !== undefined) {
      text += ` · 💳 $${walletBal.toFixed(2)}`
      if (walletBal < rate) text += `\n⚠️ पहले 👛 वॉलेट से <b>$25</b> रिचार्ज करें।`
    }
    return text
  },
}

const phoneNumberLeads = ['🎯 प्रीमियम टार्गेटेड लीड्स', '✅📲 फोन लीड्स सत्यापित करें']

const buyLeadsSelectCountry = Object.keys(areasOfCountry)
const buyLeadsSelectSmsVoice = ['एसएमएस (कीमत 20$ प्रति 1000)', 'वॉयस (कीमत 0$ प्रति 1000)']
const buyLeadsSelectArea = country => Object.keys(areasOfCountry?.[country])
const buyLeadsSelectAreaCode = (country, area) => {
  const codes = areasOfCountry?.[country]?.[area].map(c => format(countryCodeOf[country], c))
  return codes.length > 1 ? ['Mixed Area Codes'].concat(codes) : codes
}
const _buyLeadsSelectAreaCode = (country, area) => areasOfCountry?.[country]?.[area]
const buyLeadsSelectCnam = yesNo
const buyLeadsSelectCarrier = country => carriersOf[country]
const buyLeadsSelectAmount = ['1000', '2000', '3000', '4000', '5000']
const buyLeadsSelectFormat = ['स्थानीय प्रारूप', 'अंतर्राष्ट्रीय प्रारूप']

const validatorSelectCountry = Object.keys(areasOfCountry)
const validatorSelectSmsVoice = ['एसएमएस (कीमत 20$ प्रति 1000)', 'वॉयस (कीमत 0$ प्रति 1000)']
const validatorSelectCarrier = country => carriersOf[country]
const validatorSelectCnam = yesNo
const validatorSelectAmount = ['ALL', '1000', '2000', '3000', '4000', '5000']
const validatorSelectFormat = ['स्थानीय प्रारूप', 'अंतर्राष्ट्रीय प्रारूप']

const selectFormatOf = {
  'स्थानीय प्रारूप': 'Local Format',
  'अंतर्राष्ट्रीय प्रारूप': 'International Format',
}

//redSelectRandomCustom

const redSelectRandomCustom = ['यादृच्छिक शॉर्ट लिंक']

const redSelectProvider = ['Bit.ly $10', `Shortit (ट्रायल ${FREE_LINKS})`]

const tickerOf = {
  BTC: 'btc',
  LTC: 'ltc',
  ETH: 'eth',
  'USDT (TRC20)': 'trc20_usdt',
  BCH: 'bch',
  'USDT (ERC20)': 'erc20_usdt',
  DOGE: 'doge',
  TRON: 'trx',
  // Matic: 'polygon_matic',
}

const supportedCrypto = {
  BTC: '₿ बिटकॉइन (BTC)',
  LTC: 'Ł लाइटकॉइन (LTC)',
  DOGE: 'Ð डोजकॉइन (DOGE)',
  BCH: 'Ƀ बिटकॉइन कैश (BCH)',
  ETH: 'Ξ एथेरियम (ETH)',
  TRON: '🌐 ट्रॉन (TRX)',
  'USDT (TRC20)': '₮ टेथर (USDT - TRC20)',
  'USDT (ERC20)': '₮ टेथर (USDT - ERC20)',
}

/////////////////////////////////////////////////////////////////////////////////////
const _bc = ['वापस', 'रद्द करें']

const payIn = {
  crypto: 'क्रिप्टो',
  ...(HIDE_BANK_PAYMENT !== 'true' && { bank: 'बैंक ₦नायरा + कार्ड🏦💳' }),
  wallet: '👛 वॉलेट',
}

const tickerViews = Object.keys(tickerOf)
const reverseObject = o => Object.fromEntries(Object.entries(o).map(([key, val]) => [val, key]))
const tickerViewOf = reverseObject(tickerOf)
const supportedCryptoView = reverseObject(supportedCrypto)
const supportedCryptoViewOf = Object.keys(supportedCryptoView)

const kOf = list => ({
  reply_markup: {
    // Handle if there are multiples buttons in a row
    keyboard: [
      ...list.map(a => (Array.isArray(a) ? a : [a])),
      ...(list.some(
        a =>
          Array.isArray(a) &&
          a.some(
            item =>
              typeof item === 'string' &&
              (item.includes(t.backButton) ||
                item.includes(user.backToHostingPlans) ||
                item.includes(user.backToStarterPlanDetails) ||
                item.includes(user.backToPurchaseOptions)),
          ),
      )
        ? []
        : [_bc]),
    ],
  },
  parse_mode: 'HTML',
})
const yes_no = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [yesNo, _bc],
  },
  disable_web_page_preview: true,
}
const k = {
  of: kOf,

  wallet: {
    reply_markup: {
      keyboard: [[u.deposit], [u.withdraw], _bc],
    },
  },

  pay: {
    reply_markup: {
      keyboard: [Object.values(payIn), _bc],
    },
    parse_mode: 'HTML',
  },

  phoneNumberLeads: kOf(phoneNumberLeads),
  buyLeadsSelectCountry: kOf(buyLeadsSelectCountry),
  buyLeadsSelectSmsVoice: kOf(buyLeadsSelectSmsVoice),
  buyLeadsSelectArea: country => kOf(buyLeadsSelectArea(country)),
  buyLeadsSelectAreaCode: (country, area) => kOf(buyLeadsSelectAreaCode(country, area)),
  buyLeadsSelectCarrier: country => kOf(buyLeadsSelectCarrier(country)),
  buyLeadsSelectCnam: kOf(yesNo),
  buyLeadsSelectAmount: kOf(buyLeadsSelectAmount),
  buyLeadsSelectFormat: kOf(buyLeadsSelectFormat),
  // changing here for validatorSelectCountry
  validatorSelectCountry: kOf(validatorSelectCountry),
  validatorSelectSmsVoice: kOf(validatorSelectSmsVoice),
  validatorSelectCarrier: country => kOf(validatorSelectCarrier(country)),
  validatorSelectCnam: kOf(validatorSelectCnam),
  validatorSelectAmount: kOf(validatorSelectAmount),
  validatorSelectFormat: kOf(validatorSelectFormat),

  //url shortening
  redSelectRandomCustom: kOf(redSelectRandomCustom),

  redSelectProvider: kOf(redSelectProvider),
}
const payOpts = HIDE_BANK_PAYMENT !== 'true' ? k.of([u.usd, u.ngn]) : k.of([u.usd])

const adminKeyboard = {
  reply_markup: {
    keyboard: Object.values(admin).map(b => [b]),
  },
}

const userKeyboard = {
  reply_markup: {
    keyboard: [
      [user.urlShortenerMain],
      [user.hostingDomainsRedirect],
      [user.cloudPhone],
      [user.phoneNumberLeads],
      HIDE_SMS_APP === 'true' ? [user.domainNames] : [user.freeTrialAvailable, user.domainNames],
      [user.wallet, user.viewPlan, user.buyPlan],
      HIDE_BECOME_RESELLER === 'true'
        ? [user.changeSetting, user.getSupport, user.joinChannel]
        : [user.changeSetting, user.becomeReseller, user.getSupport],
    ],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const languages = {
  en: '🇬🇧 अंग्रेज़ी',
  fr: '🇫🇷 फ़्रेंच',
  zh: '🇨🇳 चीनी',
  hi: '🇮🇳 हिंदी',
}
const supportedLanguages = reverseObject(languages)

const languageMenu = {
  reply_markup: {
    keyboard: [[languages.en], [languages.fr], [languages.zh], [languages.hi]],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const l = {
  continueAtHostbay: '🚀 सेवाएं होस्टिंग, डोमेन, SMS और URLs के लिए @Hostbay_bot में स्थानांतरित हो गई हैं।',
  redirectMessage: '🚀 सेवाएं होस्टिंग, डोमेन, SMS और URLs के लिए @Hostbay_bot में स्थानांतरित हो गई हैं।',
  askPreferredLanguage: `🌍 सुनिश्चित करें कि सब कुछ आपकी वरीय भाषा में है, नीचे एक का चयन करें:
  
आप हमेशा बाद में अपनी भाषा सेटिंग्स में बदल सकते हैं।`,
  askValidLanguage: 'कृपया एक मान्य भाषा का चयन करें:',
  welcomeMessage: `👋 ${CHAT_BOT_NAME} में आपका स्वागत है!
हम आपको यहाँ पाकर बहुत खुश हैं! 🎉
चलिए शुरू करते हैं ताकि आप हमारी सभी रोमांचक विशेषताओं का अनुभव कर सकें। 🌟

इस सेटअप को जल्दी और आसानी से पूरा करें—आओ कूदते हैं! 🚀`,
  askUserEmail: 'आपका ईमेल क्या है? हमें आपकी व्यक्तिगत अनुभव को अनुकूलित करने दें! (उदाहरण: davidsen@gmail.com)',
  processUserEmail: `धन्यवाद 😊 हम आपके खाते को अब सेट कर रहे हैं।
कृपया कुछ क्षण प्रतीक्षा करें जब हम विवरण को अंतिम रूप दे रहे हैं। ⏳
 
हम बैकएंड में काम कर रहे हैं। बस कदमों का पालन करें!`,
  confirmUserEmail: `✨ बड़ी खबर! आपका खाता तैयार है! 🎉💃🎉

फ्री ट्रायल अवधि के दौरान प्रीमियम विशेषताओं का आनंद लें!`,
  termsAndCond: `📜 आगे बढ़ने से पहले, कृपया हमारे शर्तें और नीतियाँ समीक्षा और स्वीकृत करें।`,
  acceptTermMsg: `कृपया ${CHAT_BOT_NAME} का उपयोग जारी रखने के लिए शर्तें और नीतियों को स्वीकृत करें।`,
  acceptTermButton: '✅ स्वीकृत करें',
  declineTermButton: '❌ अस्वीकार करें',
  viewTermsAgainButton: '🔄 पुनः देखें शर्तें',
  exitSetupButton: '❌ सेटअप छोड़ें',
  acceptedTermsMsg: `✅ आपने सफलतापूर्वक शर्तें और नीतियाँ स्वीकार की हैं! 🎉
आप ${CHAT_BOT_NAME} का उपयोग शुरू करने के लिए तैयार हैं। चलिए मज़ेदार हिस्से में चलते हैं! 🎯`,
  declinedTermsMsg: `⚠️ आपको ${CHAT_BOT_NAME} का उपयोग जारी रखने के लिए शर्तें और नीतियाँ स्वीकार करनी होंगी। 
जब आप तैयार हों, तो उन्हें पुनः समीक्षा करें।`,
  userExitMsg: 'उपयोगकर्ता ने निकास बटन दबाया।',
  termsAndCondMsg: `<h1>${CHAT_BOT_NAME} उपयोग की शर्तें</h1>
        <p><strong>प्रभावी तिथि:</strong> 01/01/2022</p>
        <p>${CHAT_BOT_NAME} का उपयोग करने का अर्थ है कि आप इन उपयोग की शर्तों को स्वीकार करते हैं।</p>

        <h2>1. शर्तों की स्वीकृति</h2>
        <p>आपकी उम्र 18 वर्ष या उससे अधिक होनी चाहिए, या आपके पास अभिभावक की सहमति होनी चाहिए, और आपको इन शर्तों और हमारी गोपनीयता नीति से सहमत होना होगा।</p>

        <h2>2. प्रदान की जाने वाली सेवाएँ</h2>
        <p>हम डोमेन पंजीकरण, वेब होस्टिंग, और साइट/एप्लिकेशन सेटअप सहायता प्रदान करते हैं।</p>

        <h2>3. उपयोगकर्ता की जिम्मेदारियाँ</h2>
        <p>सटीक जानकारी प्रदान करें, अवैध गतिविधियों से बचें, और अपने Telegram खाते को सुरक्षित रखें।</p>

        <h2>4. भुगतान की शर्तें</h2>
        <p>सभी भुगतान अंतिम हैं जब तक कि अन्यथा उल्लेख न किया गया हो। भुगतान न करने पर सेवाएं निलंबित की जा सकती हैं।</p>

        <h2>5. सेवाओं की सीमाएँ</h2>
        <p>हम संसाधन सीमाएँ लगा सकते हैं या रखरखाव या तकनीकी समस्याओं के कारण सेवा में व्यवधान हो सकता है।</p>

        <h2>6. समाप्ति</h2>
        <p>उल्लंघन या भुगतान न करने की स्थिति में हम सेवाएँ समाप्त कर सकते हैं। उपयोगकर्ता किसी भी समय रद्द कर सकते हैं, लेकिन शुल्क वापस नहीं किया जाएगा।</p>

        <h2>7. जिम्मेदारी</h2>
        <p>सेवाएँ "जैसी हैं" के आधार पर प्रदान की जाती हैं। हम डेटा हानि, व्यवधान, या उपयोगकर्ता सुरक्षा उल्लंघनों के लिए उत्तरदायी नहीं हैं।</p>

        <h2>8. गोपनीयता</h2>
        <p>हम आपके डेटा को हमारी गोपनीयता नीति के अनुसार प्रबंधित करते हैं और केवल कानूनी आवश्यकताओं के अनुसार साझा करते हैं।</p>

        <h2>9. शर्तों में बदलाव</h2>
        <p>हम इन शर्तों को अपडेट कर सकते हैं, और निरंतर उपयोग का मतलब है कि आप इसे स्वीकार करते हैं।</p>

        <h2>10. संपर्क करें</h2>
        <p>सहायता के लिए, कृपया <a href="${APP_SUPPORT_LINK}" target="_blank">${APP_SUPPORT_LINK}</a> पर संपर्क करें।</p>

        <p>${CHAT_BOT_NAME} का उपयोग करने का अर्थ है कि आप इन शर्तों से सहमत हैं। धन्यवाद!</p>`,
}

const termsAndConditionType = lang => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'नियम और शर्तें देखें',
          web_app: {
            url: `${SELF_URL}/terms-condition?lang=${lang}`,
          },
        },
      ],
    ],
  },
})

const planOptions = ['दैनिक', 'साप्ताहिक', 'मासिक']
const planOptionsOf = {
  दैनिक: 'Daily',
  साप्ताहिक: 'Weekly',
  मासिक: 'Monthly',
}

const linkOptions = [t.randomLink, t.customLink]

const chooseSubscription = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [...planOptions.map(a => [a]), _bc],
  },
}

const dO = {
  reply_markup: {
    keyboard: [_bc, ['Backup Data'], ['Restore Data']],
  },
}

const bc = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [_bc],
  },
  disable_web_page_preview: true,
}

const dns = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [[t.addDns], [t.updateDns], [t.deleteDns], _bc],
  },
  disable_web_page_preview: true,
}
const dnsRecordType = {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [[t.cname], [t.ns], [t.a], _bc],
  },
  disable_web_page_preview: true,
}

const linkType = {
  reply_markup: {
    keyboard: [linkOptions, _bc],
  },
}

const show = domains => ({
  reply_markup: {
    keyboard: [[user.buyDomainName], ...domains.map(d => [d]), _bc],
  },
})

const payBank = url => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'भुगतान करें',
          web_app: {
            url,
          },
        },
      ],
    ],
  },
})

const html = (text = t.successPayment) => {
  return `
        <html>
            <body>
                <p style="font-family: 'system-ui';" >${text}</p>
            </body>
        </html>
    `
}

const plans = hostingType => {
  return {
    starterPlan: {
      name: 'स्टार्टर प्लान',
      price: HOSTING_STARTER_PLAN_PRICE,
      duration: '30 दिन',
      storage: '10 जीबी SSD',
      bandwidth: '100 जीबी',
      domains: 'अनलिमिटेड डोमेन्स',
      emailAccounts: '5 ईमेल खाते',
      databases: '1 MySQL डेटाबेस',
      features: `${hostingType} का पूर्ण एक्सेस फाइलें, डेटाबेस, ईमेल आदि प्रबंधित करने के लिए।`,
      idealFor: 'पर्सनल ब्लॉग्स, छोटे व्यवसाय की वेबसाइट्स, या पोर्टफोलियो।',
    },
    proPlan: {
      name: 'प्रो प्लान',
      price: HOSTING_PRO_PLAN_PRICE,
      duration: '30 दिन',
      storage: '50 जीबी SSD',
      bandwidth: '500 जीबी',
      domains: 'अनलिमिटेड डोमेन्स',
      emailAccounts: '25 ईमेल खाते',
      databases: '10 MySQL डेटाबेस',
      features: `${hostingType} का पूर्ण एक्सेस बैकअप्स, सुरक्षा, और विश्लेषण के लिए उन्नत उपकरणों के साथ।`,
      additionalFeatures: 'मुफ़्त वेबसाइट माइग्रेशन, दैनिक बैकअप्स।',
      idealFor: 'छोटे से मध्यम व्यवसाय की वेबसाइट्स, ई-कॉमर्स साइट्स।',
    },
    businessPlan: {
      name: 'बिजनेस प्लान',
      price: HOSTING_BUSINESS_PLAN_PRICE,
      duration: '30 दिन',
      storage: '100 जीबी SSD',
      bandwidth: 'अनलिमिटेड',
      domains: 'अनलिमिटेड डोमेन्स',
      emailAccounts: 'अनलिमिटेड ईमेल खाते',
      databases: 'अनलिमिटेड MySQL डेटाबेस',
      features: `${hostingType} का पूर्ण एक्सेस सभी उन्नत सुविधाओं और प्राथमिकता समर्थन के साथ।`,
      additionalFeatures: 'मुफ़्त वेबसाइट माइग्रेशन, दैनिक बैकअप्स, स्टेजिंग एनवायरनमेंट, उन्नत सुरक्षा सुविधाएं।',
      idealFor: 'बड़े व्यवसाय, उच्च ट्रैफ़िक वेबसाइट्स, और अधिक लचीलापन चाहने वाले डेवलपर्स।',
    },
  }
}

const hostingPlansText = {
  plans: plans,

  generatePlanText: (hostingType, planKey) => {
    const plan = plans(hostingType)[planKey]
    return `
    🚀 <b>${plan.name}: $${plan.price}</b>
    
    <b>- अवधि:</b> ${plan.duration}
    <b>- स्टोरेज:</b> ${plan.storage}
    <b>- बैंडविड्थ:</b> ${plan.bandwidth}
    <b>- डोमेन्स:</b> ${plan.domains}
    <b>- ईमेल खाते:</b> ${plan.emailAccounts}
    <b>- डेटाबेस:</b> ${plan.databases}
    <b>- मुफ्त SSL:</b> हां
    <b>- ${hostingType} की विशेषताएं:</b> ${plan.features}
    ${plan.additionalFeatures ? `<b>- अतिरिक्त सुविधाएं:</b> ${plan.additionalFeatures}` : ''}
    <b>- उपयुक्त के लिए:</b> ${plan.idealFor}`
  },
  generatePlanStepText: step => {
    const commonSteps = {
      buyText: 'शानदार चयन! क्या आप एक नया डोमेन चाहते हैं या मौजूदा का उपयोग करना चाहते हैं?',
      registerNewDomainText: 'कृपया वह डोमेन नाम दर्ज करें जिसे आप पंजीकृत करना चाहते हैं (जैसे, example.com)।',
      domainNotFound:
        'आपके द्वारा दर्ज किया गया डोमेन नहीं मिला। कृपया सुनिश्चित करें कि यह सही है या कोई और कोशिश करें।',
      useExistingDomainText: 'कृपया अपना मौजूदा डोमेन नाम दर्ज करें (जैसे, example.com)।',
      useExistingDomainNotFound:
        'आपके द्वारा दर्ज किया गया डोमेन आपके खाते से संबद्ध नहीं है। कृपया जांचें या समर्थन से संपर्क करें।',
      enterYourEmail: 'कृपया अपना ईमेल पता प्रदान करें ताकि हम आपका खाता बना सकें और रसीद भेज सकें।',
      invalidEmail: 'कृपया एक वैध ईमेल प्रदान करें।',
      paymentConfirmation: 'कृपया अपना खरीदारी जारी रखने के लिए लेनदेन की पुष्टि करें।',
      paymentSuccess: `हम आपके भुगतान की पुष्टि कर रहे हैं। जैसे ही यह पुष्टि होगी, आपको सूचित किया जाएगा। धन्यवाद!`,
      paymentFailed: 'भुगतान असफल। कृपया पुनः प्रयास करें।',
    }

    return `${commonSteps[step]}`
  },

  generateDomainFoundText: (websiteName, price) => `डोमेन ${websiteName} उपलब्ध है! इसकी लागत $${price} है।`,
  generateExistingDomainText: websiteName => `आपने ${websiteName} को अपने डोमेन के रूप में चुना है।`,
  domainNotFound: websiteName => `डोमेन ${websiteName} उपलब्ध नहीं है।`,
  nameserverSelectionText: websiteName =>
    `कृपया ${websiteName} के लिए आप जिस नेमसर्वर प्रदाता का उपयोग करना चाहते हैं, उसे चुनें।`,
  confirmEmailBeforeProceeding: email => `क्या आप वाकई इस ईमेल ${email} के साथ जारी रखना चाहते हैं?`,

  generateInvoiceText: payload => `
<b>डोमेन पंजीकरण</b>
<b>- डोमेन: </b> ${payload.domainName}
<b>- मूल्य: </b> $${payload?.existingDomain ? '0 (मौजूदा डोमेन का उपयोग)' : payload.domainPrice}
  
<b>वेब होस्टिंग</b>
<b>- अवधि: </b> 1 माह
<b>- मूल्य: </b> $${payload.hostingPrice}
  
<b>कुल देय राशि:</b>
<b>- कूपन छूट: </b> $${payload.couponDiscount}
<b>- USD: </b> $${payload?.couponApplied ? payload.newPrice : payload.totalPrice}
<b>- कर: </b> $0.00
  
<b>भुगतान की शर्तें</b>
यह एक अग्रिम भुगतान चालान है। कृपया सुनिश्चित करें कि भुगतान 1 घंटे के भीतर पूरा हो ताकि आपका डोमेन और होस्टिंग सेवाएं सक्रिय हो सकें। भुगतान प्राप्त होने के बाद, हम आपकी सेवा को सक्रिय करेंगे।
`,

  showCryptoPaymentInfo: (priceCrypto, tickerView, address, plan) => `
कृपया ${priceCrypto} ${tickerView} को निम्नलिखित पते पर भेजें:
  
<code>${address}</code>
  
कृपया ध्यान दें कि क्रिप्टो लेनदेन को पूरा होने में 30 मिनट तक का समय लग सकता है। जैसे ही लेनदेन की पुष्टि होगी, आपको तुरंत सूचित किया जाएगा और आपका ${plan} सक्रिय कर दिया जाएगा।
  
सादर,
${CHAT_BOT_NAME}`,

  successText: (info, response) =>
    `यहां आपके ${info.hostingType} क्रेडेंशियल्स हैं ${info.plan} के लिए :

डोमेन : ${info.website_name}
यूज़रनेम : ${response.username}
ईमेल : ${info.email}
पासवर्ड : ${response.password}
यूआरएल : ${response.url}

<b>नामसर्वर</b>
- ${response.nameservers.ns1}
- ${response.nameservers.ns2}
  
आपके ${info.hostingType} क्रेडेंशियल्स को आपके ईमेल ${info.email} पर सफलतापूर्वक भेज दिया गया है।`,

  support: (plan, statusCode) => `किसी तकनीकी समस्या का सामना हुआ है ${plan} के साथ | ${statusCode}. 
                                              कृपया 💬 सहायता प्राप्त करें बटन दबाएं।
                                              अधिक जानकारी के लिए ${TG_HANDLE}.`,

  bankPayDomain: (
    priceNGN,
    plan,
  ) => `कृपया ${priceNGN} NGN का भुगतान करें और “भुगतान करें” पर क्लिक करें। एक बार लेनदेन की पुष्टि हो जाने पर, आपको तुरंत सूचित कर दिया जाएगा और आपका ${plan} बिना किसी परेशानी के सक्रिय कर दिया जाएगा।

सादर,
${CHAT_BOT_NAME}`,
}

const vpsBC = ['🔙 वापस', 'रद्द करें']

const vpsOptionsOf = list => ({
  reply_markup: {
    // Handle if there are multiples buttons in a row
    keyboard: [
      ...list.map(a => (Array.isArray(a) ? a : [a])),
      ...(list.some(
        a => Array.isArray(a) && a.some(item => typeof item === 'string' && item.includes(t.goBackToCoupon)),
      )
        ? []
        : [vpsBC]),
    ],
  },
  parse_mode: 'HTML',
})

const vpsPlans = {
  hourly: 'प्रति घंटा',
  monthly: 'मासिक',
  quaterly: 'त्रैमासिक',
  annually: 'वार्षिक',
}

const vpsPlanMenu = ['प्रति घंटा', 'मासिक', 'त्रैमासिक', 'वार्षिक']
const vpsConfigurationMenu = ['मूल', 'मानक', 'प्रीमियम', 'एंटरप्राइज़']
const vpsCpanelOptional = ['WHM', 'Plesk', '❌ कंट्रोल पैनल छोड़ें']

const vpsPlanOf = {
  'प्रति घंटा': 'hourly',
  मासिक: 'monthly',
  त्रैमासिक: 'quaterly',
  वार्षिक: 'annually',
}

const vp = {
  of: vpsOptionsOf,
  back: '🔙 वापस',
  skip: '❌ छोड़ें',
  cancel: '❌ रद्द करें',

  askCountryForUser: `🌍 इष्टतम प्रदर्शन और कम विलंबता के लिए सर्वश्रेष्ठ क्षेत्र चुनें।

  💡 कम विलंबता = तेज़ प्रतिक्रिया समय। बेहतर प्रदर्शन के लिए अपने उपयोगकर्ताओं के सबसे नज़दीकी क्षेत्र का चयन करें।`,
  chooseValidCountry: 'कृपया सूची से एक देश चुनें:',
  askRegionForUser: country => `📍 ${country} में एक डेटा सेंटर चुनें (स्थान के अनुसार मूल्य अलग-अलग हो सकता है।)`,
  chooseValidRegion: 'कृपया सूची से एक मान्य क्षेत्र चुनें:',
  askZoneForUser: region => `📍 ${region} के भीतर एक ज़ोन चुनें।`,

  chooseValidZone: 'कृपया सूची से वैध जोन चुनें:',
  confirmZone: (region, zone) =>
    `✅  आपने ${region} (${zone}) का चयन किया है। क्या आप इस चयन के साथ आगे बढ़ना चाहते हैं?`,
  failedFetchingData: 'डेटा प्राप्त करने में त्रुटि, कृपया कुछ समय बाद पुनः प्रयास करें।',
  confirmBtn: `✅ चयन की पुष्टि करें`,

  askVpsDiskType: list => `💾 प्रदर्शन और बजट के आधार पर अपनी स्टोरेज प्रकार चुनें:

${list?.map(item => `• ${item.description}`).join('\n')}`,
  chooseValidDiskType: 'कृपया एक वैध डिस्क प्रकार चुनें',

  askPlanType: plans => `💳 बिलिंग चक्र चुनें:

${plans
  .map(
    item =>
      `<strong>• ${item.type === 'Hourly' ? '⏳' : '📅'} ${item.type} –</strong> $${item.originalPrice} ${
        item.discount === 0 ? '(कोई छूट नहीं)' : `(${item.discount}% छूट शामिल है)`
      }`,
  )
  .join('\n')}`,

  planTypeMenu: vpsOptionsOf(vpsPlanMenu),
  hourlyBillingMessage: `⚠️ प्रति घंटा बिलिंग के लिए $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD की वापसी योग्य जमा राशि आवश्यक है। यह निर्बाध सेवा सुनिश्चित करता है और यदि अप्रयुक्त रहता है तो वापस कर दिया जाता है।

✅ बिलिंग आपके वॉलेट बैलेंस से प्रति घंटे काटी जाती है।
🔹 मासिक लाइसेंस (Windows/WHM/Plesk) पहले से ही बिल किए जाते हैं।`,

  askVpsConfig: list => `⚙️ अपनी आवश्यकताओं के अनुसार एक VPS योजना चुनें (घंटे या मासिक बिलिंग उपलब्ध है):
  
${list
  .map(
    config =>
      `<strong>• ${config.name} -</strong>  ${config.specs.vCPU} vCPU, ${config.specs.RAM}GB RAM, ${config.specs.disk}GB डिस्क`,
  )
  .join('\n')}`,

  validVpsConfig: 'कृपया एक वैध VPS कॉन्फ़िगरेशन चुनें:',

  configMenu: vpsOptionsOf(vpsConfigurationMenu),

  askForCoupon:
    '🎟️ क्या आपके पास कूपन कोड है? यदि लागू हो तो इसे अतिरिक्त छूट के लिए दर्ज करें, या इस चरण को छोड़ दें। कोई भी बिलिंग चक्र छूट पहले से ही शामिल है।',
  couponInvalid: `❌ अमान्य: कोड समाप्त हो गया है, लागू नहीं है या गलत है। कृपया पुनः प्रयास करें।`,
  couponValid: amt => `✅ वैध: छूट लागू की गई: -$${amt}।`,
  skipCouponwarning: `⚠️ छोड़ने का मतलब है कि आप बाद में छूट लागू नहीं कर सकते।`,
  confirmSkip: '✅ छोड़ने की पुष्टि करें',
  goBackToCoupon: '❌ वापस जाएं और कूपन लागू करें',

  askVpsOS: price => `💡 डिफ़ॉल्ट ऑपरेटिंग सिस्टम: उबंटू (लिनक्स) (यदि कोई चयन नहीं किया जाता है)।
💻 एक ऑपरेटिंग सिस्टम चुनें (Windows Server के लिए $${price}/महीना अतिरिक्त शुल्क)।  

<strong>💡 अनुशंसित: </strong>  
<strong>• Ubuntu –</strong> सामान्य उपयोग और विकास के लिए सर्वश्रेष्ठ  
<strong>• CentOS –</strong> एंटरप्राइज़ अनुप्रयोगों के लिए स्थिर  
<strong>• Windows Server –</strong> Windows-आधारित अनुप्रयोगों के लिए (+$${price}/महीना)`,
  chooseValidOS: `कृपया उपलब्ध सूची से एक वैध OS चुनें:`,
  skipOSBtn: '❌ OS चयन छोड़ें',
  skipOSwarning:
    '⚠️ आपका VPS बिना OS के लॉन्च होगा। आपको इसे मैन्युअली SSH या रिकवरी मोड के माध्यम से इंस्टॉल करना होगा।',

  askVpsCpanel: `🛠️ आसान सर्वर प्रबंधन के लिए एक नियंत्रण पैनल चुनें (वैकल्पिक)।

<strong>• ⚙️ WHM –</strong> कई वेबसाइटों की होस्टिंग के लिए अनुशंसित
<strong>• ⚙️ Plesk –</strong> व्यक्तिगत वेबसाइटों और अनुप्रयोगों के प्रबंधन के लिए उपयुक्त
<strong>• ❌ छोड़ें –</strong> कोई नियंत्रण पैनल नहीं`,

  cpanelMenu: vpsOptionsOf(vpsCpanelOptional),
  noControlPanel: vpsCpanelOptional[2],
  skipPanelMessage: '⚠️ कोई नियंत्रण पैनल स्थापित नहीं किया जाएगा। आप इसे बाद में मैन्युअल रूप से जोड़ सकते हैं।',
  validCpanel: 'कृपया एक मान्य नियंत्रण पैनल चुनें या इसे छोड़ दें।',

  askCpanelOtions: (name, list) => `⚙️ एक ${name == 'whm' ? 'WHM' : 'Plesk Web Host Edition'} लाइसेंस चुनें या ${
    name == 'whm' ? '15' : '7'
  } दिनों के लिए एक निःशुल्क परीक्षण का चयन करें।

💰 ${name == 'whm' ? 'WHM' : 'Plesk'} लाइसेंस मूल्य निर्धारण:

${list.map(item => `${name == 'whm' ? `<strong>• ${item.name} - </strong>` : ''}${item.label}`).join('\n')}`,

  trialCpanelMessage: panel =>
    `✅ ${panel.name == 'whm' ? 'WHM' : 'Plesk'} निःशुल्क परीक्षण (${
      panel.duration
    } दिन) सक्रिय किया गया। आप किसी भी समय समर्थन से संपर्क करके अपग्रेड कर सकते हैं।`,

  vpsWaitingTime: '⚙️ विवरण प्राप्त कर रहे हैं... इसमें बस एक क्षण लगेगा।',
  failedCostRetrieval: 'लागत जानकारी प्राप्त करने में विफल... कृपया कुछ समय बाद पुनः प्रयास करें।',

  errorPurchasingVPS: plan => `कुछ गलत हो गया जब आप अपना ${plan} VPS योजना सेटअप कर रहे थे।

कृपया सहायता के लिए 💬 सहायता प्राप्त करें बटन दबाएं।
अधिक जानने के लिए ${TG_HANDLE} पर जाएं।`,

  generateBillSummary: vpsDetails => `<strong>📋 अंतिम लागत विवरण :</strong>

<strong>•📅 डिस्क प्रकार –</strong> ${vpsDetails.diskType}
<strong>•🖥️ VPS योजना :</strong> ${vpsDetails.config.name}
<strong>•📅 बिलिंग चक्र (${vpsDetails.plan} योजना) –</strong> $${vpsDetails.plantotalPrice} USD
<strong>•💻 OS लाइसेंस (${vpsDetails.os ? vpsDetails.os.name : 'चयन नहीं किया गया'}) –</strong> $${
    vpsDetails.selectedOSPrice
  } USD
<strong>•🛠️ नियंत्रण पैनल (${
    vpsDetails.panel
      ? `${vpsDetails.panel.name == 'whm' ? 'WHM' : 'Plesk'} ${vpsDetails.panel.licenseName}`
      : 'चयन नहीं किया गया'
  }) –</strong> $${vpsDetails.selectedCpanelPrice} USD
<strong>•🎟️ कूपन छूट –</strong> -$${vpsDetails.couponDiscount} USD
<strong>•🔄 स्वचालित नवीनीकरण –</strong>  ${
    vpsDetails.plan === 'Hourly' ? '⏳ प्रति घंटा' : vpsDetails.autoRenewalPlan ? '✅ सक्षम' : '❌ अक्षम'
  }

${
  vpsDetails.plan === 'Hourly'
    ? `नोट: आपकी कुल राशि में $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD जमा शामिल है। पहली घंटे की कटौती के बाद, शेष जमा राशि आपके वॉलेट में जमा कर दी जाएगी।`
    : ''
}

<strong>💰 कुल :</strong> $${
    vpsDetails.plan === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      : vpsDetails.totalPrice
  } USD

<strong>✅ क्या आप ऑर्डर जारी रखना चाहते हैं?</strong>`,
  no: '❌ आदेश रद्द करें',
  yes: '✅ आदेश की पुष्टि करें',

  askPaymentMethod: 'भुगतान विधि चुनें:',

  showDepositCryptoInfoVps: (priceCrypto, tickerView, address, vpsDetails) =>
    `कृपया ${priceCrypto} ${tickerView} को\n\n<code>${address}</code> पर भेजें

कृपया ध्यान दें, क्रिप्टो लेन-देन को पूरा होने में 30 मिनट तक का समय लग सकता है। एक बार लेन-देन की पुष्टि हो जाने पर, आपको तुरंत सूचित किया जाएगा और आपकी VPS योजना सक्रिय हो जाएगी।

सादर,
${CHAT_BOT_NAME}`,

  extraMoney: 'आपकी घंटे की योजना के लिए शेष राशि आपके वॉलेट में जमा कर दी गई है।',
  paymentRecieved: `✅ भुगतान सफल! आपकी VPS सेटअप हो रही है। विवरण जल्द ही उपलब्ध होंगे और आपके ईमेल पर भेजे जाएंगे।`,
  paymentFailed: `❌ भुगतान विफल। कृपया अपनी भुगतान विधि जांचें या पुनः प्रयास करें।`,

  lowWalletBalance: vpsName => `
आपकी VPS योजना उदाहरण ${vpsName} को कम बैलेंस के कारण रोक दिया गया है।

कृपया अपनी वॉलेट को टॉप-अप करें ताकि आप अपनी VPS योजना का उपयोग जारी रख सकें।`,

  vpsBoughtSuccess: (vpsDetails, response) =>
    `<strong>🎉 VPS [${response.label}] सक्रिय हो गया!</strong>

<strong>🔑 लॉगिन विवरण:</strong>
  <strong>• IP:</strong> ${response.host}
  <strong>• OS:</strong> ${vpsDetails.os ? vpsDetails.os.name : 'चयनित नहीं'}
  <strong>• उपयोगकर्ता नाम:</strong> ${credentials.username}
  <strong>• पासवर्ड:</strong> ${credentials.password} (तुरंत बदलें).
    
📧 यह विवरण आपके पंजीकृत ईमेल पर भी भेजे गए हैं। कृपया इन्हें सुरक्षित रखें।

⚙️ नियंत्रण पैनल इंस्टॉलेशन (WHM/Plesk)
यदि आपने WHM या Plesk ऑर्डर किया है, तो इंस्टॉलेशन प्रगति पर है। आपका नियंत्रण पैनल लॉगिन विवरण सेटअप पूरा होने के बाद अलग से भेजा जाएगा।

हमारी सेवा चुनने के लिए धन्यवाद
${CHAT_BOT_NAME}
`,
  vpsHourlyPlanRenewed: (vpsName, price) => `
आपकी VPS योजना उदाहरण ${vpsName} को सफलतापूर्वक नवीनीकरण किया गया है।
${price}$ आपके वॉलेट से काटे गए हैं।`,

  bankPayVPS: (
    priceNGN,
    plan,
  ) => `कृपया “भुगतान करें” पर क्लिक करके ${priceNGN} NGN भेजें। एक बार लेन-देन की पुष्टि हो जाने पर, आपको तुरंत सूचित किया जाएगा और आपकी ${plan} VPS योजना सक्रिय हो जाएगी।

सादर,
${CHAT_BOT_NAME}`,

  askAutoRenewal: `🔄 निर्बाध सेवा के लिए ऑटो-नवीनीकरण सक्षम करें?  

🛑 नवीनीकरण से पहले आपको एक अनुस्मारक मिलेगा। आप इसे किसी भी समय अक्षम कर सकते हैं।`,
  enable: '✅ सक्षम करें',
  skipAutoRenewalWarming: expiresAt =>
    `⚠️ आपका VPS ${new Date(expiresAt).toLocaleDateString('hi-IN').replace(/\//g, '-')} को ${new Date(
      expiresAt,
    ).toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} पर समाप्त हो जाएगा, और सेवा बाधित हो सकती है।`,

  generateSSHKeyBtn: '✅ नई कुंजी जेनरेट करें',
  linkSSHKeyBtn: '🗂️ मौजूदा कुंजी लिंक करें',
  skipSSHKeyBtn: '❌ छोड़ें (पासवर्ड लॉगिन का उपयोग करें)',
  noExistingSSHMessage:
    '🔑 कोई SSH कुंजी नहीं मिली। क्या आप सुरक्षित पहुंच के लिए एक नई SSH कुंजी बनाना चाहते हैं, या पासवर्ड लॉगिन (कम सुरक्षित) का उपयोग करना चाहते हैं?',
  existingSSHMessage: '🔑 आपके पास मौजूदा SSH कुंजियाँ हैं। कोई विकल्प चुनें:',
  confirmSkipSSHMsg: `⚠️ चेतावनी: पासवर्ड लॉगिन कम सुरक्षित है और हमलों के लिए संवेदनशील हो सकता है।
🔹 हम SSH कुंजी का उपयोग करने की अत्यधिक अनुशंसा करते हैं। क्या आप वाकई जारी रखना चाहते हैं?`,
  confirmSkipSSHBtn: '✅ फिर भी जारी रखें',
  setUpSSHBtn: '🔄 SSH कुंजी सेटअप करें',
  sshLinkingSkipped: '❌ SSH कुंजी लिंकिंग छोड़ दी गई। कोई परिवर्तन नहीं किया गया।',
  newSSHKeyGeneratedMsg: name => `✅ SSH कुंजी (${name}) बनाई गई।
⚠️ इस कुंजी को सुरक्षित रूप से सहेजें – इसे बाद में भी पुनः प्राप्त किया जा सकता है।`,
  selectSSHKey: '🗂️ अपने VPS से लिंक करने के लिए मौजूदा SSH कुंजी चुनें:',
  uploadNewKeyBtn: '➕ नई कुंजी अपलोड करें',
  cancelLinkingSSHKey: `❌ SSH कुंजी लिंकिंग रद्द कर दी गई। कोई परिवर्तन नहीं किया गया।`,
  selectValidSShKey: 'कृपया सूची से एक वैध SSH कुंजी चुनें।',
  sshKeySavedForVPS: name => `✅ SSH कुंजी (${name}) नए VPS से लिंक की जाएगी।`,
  askToUploadSSHKey: `📤 अपनी SSH सार्वजनिक कुंजी (.pub फ़ाइल) अपलोड करें या नीचे कुंजी पेस्ट करें।`,
  failedGeneratingSSHKey: 'नई SSH कुंजी बनाने में विफल। कृपया पुनः प्रयास करें या कोई अन्य विधि आज़माएँ।',
  newSSHKeyUploadedMsg: name => `✅ SSH कुंजी (${name}) सफलतापूर्वक अपलोड की गई और VPS से लिंक की जाएगी।`,
  fileTypePub: 'फ़ाइल प्रकार .pub होना चाहिए',

  vpsList: list => `<strong>🖥️ सक्रिय VPS इंस्टेंस:</strong>

${list
  .map(vps => `<strong>• ${vps.name} :</strong> ${vps.status === 'RUNNING' ? '🟢' : '🔴'} ${vps.status}`)
  .join('\n')}
`,
  noVPSfound: 'कोई सक्रिय VPS इंस्टेंस मौजूद नहीं है। एक नया बनाएं।',
  selectCorrectOption: 'कृपया सूची में से एक विकल्प चुनें',
  selectedVpsData: data => `<strong>🖥️ VPS आईडी:</strong> ${data.name}

<strong>• योजना:</strong> ${data.planDetails.name}
<strong>• vCPUs:</strong> ${data.planDetails.specs.vCPU} | RAM: ${data.planDetails.specs.RAM} GB | डिस्क: ${
    data.planDetails.specs.disk
  } GB (${data.diskTypeDetails.type})
<strong>• OS:</strong> ${data.osDetails.name}
<strong>• नियंत्रण पैनल:</strong> ${
    data.cPanelPlanDetails && data.cPanelPlanDetails.type ? data.cPanelPlanDetails.type : 'कोई नहीं'
  }
<strong>• स्थिति:</strong> ${data.status === 'RUNNING' ? '🟢' : '🔴'} ${data.status}
<strong>• स्वचालित नवीनीकरण:</strong> ${data.autoRenewable ? 'सक्षम' : 'अक्षम'}
<strong>• आईपी पता:</strong> ${data.host}`,
  stopVpsBtn: '⏹️ रोकें',
  startVpsBtn: '▶️ शुरू करें',
  restartVpsBtn: '🔄 पुनः प्रारंभ करें',
  deleteVpsBtn: '🗑️ हटाएं',
  subscriptionBtn: '🔄 सदस्यता',
  VpsLinkedKeysBtn: '🔑 SSH कुंजी',
  confirmChangeBtn: '✅ पुष्टि करें',

  confirmStopVpstext: name => `⚠️ क्या आप वास्तव में VPS <strong>${name}</strong> को रोकना चाहते हैं?`,
  vpsBeingStopped: name => `⚙️ कृपया प्रतीक्षा करें, आपका VPS (${name}) रोका जा रहा है`,
  vpsStopped: name => `✅ VPS (${name}) रोक दिया गया है।`,
  failedStoppingVPS: name => `❌ VPS (${name}) को रोकने में विफल।

कृपया कुछ समय बाद पुनः प्रयास करें।`,
  vpsBeingStarted: name => `⚙️ कृपया प्रतीक्षा करें, आपका VPS (${name}) शुरू किया जा रहा है`,
  vpsStarted: name => `✅ VPS (${name}) अब चल रहा है।`,
  failedStartedVPS: name => `❌ VPS (${name}) को शुरू करने में विफल।

कृपया कुछ समय बाद पुनः प्रयास करें।`,
  vpsBeingRestarted: name => `⚙️ कृपया प्रतीक्षा करें, आपका VPS (${name}) पुनः प्रारंभ किया जा रहा है`,
  vpsRestarted: name => `✅ VPS (${name}) सफलतापूर्वक पुनः प्रारंभ हो गया है।`,
  failedRestartingVPS: name => `❌ VPS (${name}) को पुनः प्रारंभ करने में विफल।

कृपया कुछ समय बाद पुनः प्रयास करें।`,
  confirmDeleteVpstext: name =>
    `⚠️ चेतावनी: इस VPS ${name} को हटाना स्थायी है, और सभी डेटा खो जाएगा।
  • अप्रयुक्त सदस्यता समय के लिए कोई धनवापसी नहीं।
  • स्वत: नवीनीकरण रद्द कर दिया जाएगा, और कोई अतिरिक्त शुल्क लागू नहीं होगा।
  
क्या आप आगे बढ़ना चाहते हैं?`,
  vpsBeingDeleted: name => `⚙️ कृपया प्रतीक्षा करें, आपका VPS (${name}) हटाया जा रहा है`,
  vpsDeleted: name => `✅ VPS (${name}) स्थायी रूप से हटा दिया गया है।`,
  failedDeletingVPS: name => `❌ VPS (${name}) को हटाने में विफल।

कृपया कुछ समय बाद पुनः प्रयास करें।`,

  upgradeVpsBtn: '⬆️ उन्नत करें',
  upgradeVpsPlanBtn: '⬆️ VPS योजना',
  upgradeVpsDiskBtn: '📀 डिस्क प्रकार',
  upgradeVpsDiskTypeBtn: '💾 डिस्क प्रकार उन्नत करें',
  upgradeVPS: 'उन्नयन प्रकार चुनें',
  upgradeOptionVPSBtn: to => {
    return `🔼 ${to} पर उन्नत करें`
  },
  upgradeVpsPlanMsg: options => `⚙️ अपने VPS संसाधनों को स्केल करने के लिए एक नई योजना चुनें।
💡 उन्नयन vCPUs, RAM, और स्टोरेज बढ़ाता है लेकिन इसे वापस नहीं किया जा सकता।

📌 उपलब्ध उन्नयन:
${options
  .map(
    planDetails =>
      `<strong>• ${planDetails.from} ➡ ${planDetails.to} –</strong> $${planDetails.monthlyPrice}/महीना ($${planDetails.hourlyPrice}/घंटा)`,
  )
  .join('\n')}

💰 बिलिंग नोटिस: आपका वर्तमान योजना अप्रयुक्त दिनों के लिए क्रेडिट किया जाएगा, और नया दर बिलिंग चक्र के शेष भाग के लिए लागू होगा (प्रोरेटेड समायोजन)।`,

  alreadyEnterprisePlan: '⚠️ आप पहले से ही उच्चतम उपलब्ध योजना (Enterprise) पर हैं। आगे कोई उन्नयन संभव नहीं है।',

  alreadyHighestDisk: vpsData =>
    `⚠️ आप पहले से ही उच्चतम उपलब्ध डिस्क (${vpsData.diskTypeDetails.type}) पर हैं। आगे कोई उन्नयन संभव नहीं है।`,
  newVpsDiskBtn: type => `उन्नत करें ${type} पर`,
  upgradeVpsDiskMsg: upgrades => `💾 बेहतर प्रदर्शन के लिए अपने स्टोरेज प्रकार को उन्नत करें।
⚠️ डिस्क उन्नयन स्थायी होते हैं और डाउनग्रेड नहीं किए जा सकते।

📌 उपलब्ध विकल्प:
${upgrades.map(val => `<strong>• ${val.from} ➡ ${val.to} –</strong> +$${val.price}/${val.duration}`).join('\n')}

💰 बिलिंग नोटिस: यदि उन्नयन मध्य चक्र में लागू किया जाता है, तो आपके वर्तमान बिलिंग अवधि के अप्रयुक्त भाग के लिए प्रोरेटेड समायोजन लागू किया जाएगा।`,
  upgradePlanSummary: (newData, vpsDetails, lowBal) => `<strong>📜 ऑर्डर सारांश:</strong>

<strong>• VPS ID:</strong> ${vpsDetails.name}
<strong>• पुरानी योजना:</strong> ${newData.upgradeOption.from}
<strong>• नई योजना:</strong> ${newData.upgradeOption.to}
<strong>• बिलिंग चक्र:</strong> ${newData.billingCycle}
<strong>• नई बिलिंग दर:</strong> $${newData.totalPrice} USD${
    newData.billingCycle === 'Hourly' ? '/घंटा' : ' (प्रोरेटेड समायोजन लागू किया गया)'
  }
<strong>• प्रभावी तिथि:</strong> तुरंत लागू
${
  lowBal
    ? `
💡 नोट: आपके कुल शुल्क में $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD की अग्रिम जमा राशि शामिल है। पहले घंटे की कटौती के बाद, शेष जमा राशि आपके वॉलेट में जमा कर दी जाएगी।
`
    : ''
}
<strong>• कुल मूल्य:</strong> $${lowBal ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE : newData.totalPrice} USD

<strong>✅ क्या आप ऑर्डर जारी रखना चाहते हैं?</strong>`,

  upgradeDiskSummary: (newData, vpsDetails, lowBal) => `<strong>📜 ऑर्डर सारांश:</strong>

<strong>• VPS ID:</strong> ${vpsDetails.name}
<strong>• पुराना डिस्क प्रकार:</strong> ${newData.upgradeOption.from}
<strong>• नया डिस्क प्रकार:</strong> ${newData.upgradeOption.to}
<strong>• बिलिंग चक्र:</strong> ${newData.billingCycle}
<strong>• नई बिलिंग दर:</strong> $${newData.totalPrice} USD${
    newData.billingCycle === 'Hourly' ? '/घंटा' : ' (आनुपातिक समायोजन लागू)'
  }
${
  lowBal
    ? `
नोट: आपके कुल में $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD की जमा राशि शामिल है। पहली घंटे की दर कटने के बाद, शेष जमा राशि आपके वॉलेट में क्रेडिट की जाएगी।
`
    : ''
}
<strong>• कुल मूल्य:</strong> $${lowBal ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE : newData.totalPrice} USD

<strong>✅ क्या आप ऑर्डर जारी रखना चाहते हैं?</strong>`,

  vpsSubscriptionData: (vpsData, planExpireDate, panelExpireDate) => `<strong>🗂️ आपकी सक्रिय सदस्यताएँ:</strong>

<strong>• VPS ${vpsData.name} </strong> – समाप्ति तिथि: ${planExpireDate}  (स्वचालित नवीनीकरण: ${
    vpsData.autoRenewable ? 'सक्रिय' : 'निष्क्रिय'
  })
<strong>• नियंत्रण पैनल ${vpsData?.cPanelPlanDetails ? vpsData.cPanelPlanDetails.type : ': चयनित नहीं'} </strong> ${
    vpsData?.cPanelPlanDetails
      ? `${
          vpsData?.cPanelPlanDetails.status === 'active' ? '- समाप्ति तिथि: ' : '- समाप्त हो चुका: '
        }${panelExpireDate}`
      : ''
  } `,

  manageVpsSubBtn: '🖥️ VPS सदस्यता प्रबंधित करें',
  manageVpsPanelBtn: '🛠️ नियंत्रण पैनल सदस्यता प्रबंधित करें',

  vpsSubDetails: (data, date) => `<strong>📅 VPS सदस्यता विवरण:</strong>

<strong>• VPS आईडी:</strong> ${data.name}
<strong>• योजना:</strong> ${data.planDetails.name}
<strong>• वर्तमान समाप्ति तिथि:</strong> ${date}
<strong>• स्वचालित नवीनीकरण:</strong> ${data.autoRenewable ? 'सक्रिय' : 'निष्क्रिय'}`,

  vpsCPanelDetails: (data, date) => `<strong>📅 नियंत्रण पैनल सदस्यता विवरण:</strong>

<strong>• संबंधित VPS आईडी:</strong> ${data.name}
<strong>• नियंत्रण पैनल प्रकार:</strong> ${data.cPanelPlanDetails.type} (${data.cPanelPlanDetails.name})
<strong>• वर्तमान समाप्ति तिथि:</strong> ${date}
<strong>• स्वचालित नवीनीकरण:</strong> ${data.autoRenewable ? 'सक्रिय' : 'निष्क्रिय'}
`,

  vpsEnableRenewalBtn: '🔄 स्वचालित नवीनीकरण सक्षम करें',
  vpsDisableRenewalBtn: '❌ स्वचालित नवीनीकरण निष्क्रिय करें',
  vpsPlanRenewBtn: '📅 अब नवीनीकरण करें',
  unlinkVpsPanelBtn: '❌ VPS से अनलिंक करें',
  bankPayVPSUpgradePlan: (priceNGN, vpsDetails) =>
    `कृपया नीचे दिए गए "भुगतान करें" बटन पर क्लिक करके ${priceNGN} NGN का भुगतान करें। एक बार लेनदेन की पुष्टि हो जाने के बाद, आपको तुरंत सूचित किया जाएगा, और आपकी नई ${vpsDetails.upgradeOption.to} VPS योजना बिना किसी रुकावट के सक्रिय हो जाएगी।`,

  bankPayVPSUpgradeDisk: (priceNGN, vpsDetails) =>
    `कृपया “भुगतान करें” पर क्लिक करके ${priceNGN} NGN जमा करें। एक बार लेन-देन की पुष्टि हो जाने पर, आपको तुरंत सूचित किया जाएगा, और आपका VPS योजना नए डिस्क प्रकार ${vpsDetails.upgradeOption.toType} के साथ सुचारू रूप से सक्रिय हो जाएगा।`,

  showDepositCryptoInfoVpsUpgrade: (priceCrypto, tickerView, address) =>
    `कृपया ${priceCrypto} ${tickerView} जमा करें\n\n<code>${address}</code>

कृपया ध्यान दें कि क्रिप्टो लेन-देन को पूरा होने में 30 मिनट तक का समय लग सकता है। एक बार लेन-देन की पुष्टि हो जाने पर, आपको तुरंत सूचित किया जाएगा, और आपकी नई VPS योजना सक्रिय हो जाएगी।

सादर,
${CHAT_BOT_NAME}`,

  linkVpsSSHKeyBtn: '➕ नई कुंजी जोड़ें',
  unlinkSSHKeyBtn: '❌ कुंजी हटाएं',
  downloadSSHKeyBtn: '⬇️ कुंजी डाउनलोड करें',

  noLinkedKey: name => `⚠️ वर्तमान में इस VPS [${name}] से कोई SSH कुंजी जुड़ी नहीं है। 

कृपया एक SSH कुंजी को अपने खाते से जोड़ें ताकि सुरक्षित पहुँच सुनिश्चित हो सके।`,

  linkedKeyList: (list, name) => `🗂️ VPS ${name} से जुड़ी SSH कुंजियाँ:

${list.map(val => `<strong>• ${val}</strong>`).join('\n')}`,

  unlinkSSHKeyList: name => `🗂️ VPS [${name}] से SSH कुंजी हटाने के लिए चयन करें:`,

  confirmUnlinkKey: data =>
    `⚠️ क्या आप सुनिश्चित हैं कि आप [${data.keyForUnlink}] को VPS [${data.name}] से अनलिंक करना चाहते हैं?`,
  confirmUnlinkBtn: '✅ अनलिंक की पुष्टि करें',
  keyUnlinkedMsg: data =>
    `✅ SSH कुंजी [${data.keyForUnlink}] को VPS [${data.name}] से सफलतापूर्वक अनलिंक कर दिया गया है।`,
  failedUnlinkingKey: data => `❌ SSH कुंजी को VPS (${data.name}) से अनलिंक करने में विफल। 

कृपया कुछ समय बाद पुनः प्रयास करें।`,

  userSSHKeyList: name => `🗂️ VPS [${name}] से लिंक करने के लिए एक SSH कुंजी चुनें:`,
  noUserKeyList: `🔑 कोई SSH कुंजी नहीं मिली। क्या आप एक नई SSH कुंजी अपलोड करना चाहेंगे?`,
  linkKeyToVpsSuccess: (key, name) => `✅ SSH कुंजी [${key}] को VPS [${name}] से सफलतापूर्वक जोड़ा गया है।`,
  failedLinkingSSHkeyToVps: (key, name) => `❌ SSH कुंजी [${key}] को VPS (${name}) से जोड़ने में विफल। 

कृपया कुछ समय बाद पुनः प्रयास करें।`,

  selectSSHKeyToDownload: '🗂️ वह SSH कुंजी चुनें जिसे आप डाउनलोड करना चाहते हैं:',

  disabledAutoRenewal: (
    data,
    expiryDate,
  ) => `⚠️ स्वत: नवीनीकरण अक्षम कर दिया गया है। यदि मैन्युअल रूप से नवीनीकरण नहीं किया गया, तो आपका VPS ${expiryDate} को समाप्त हो जाएगा।
✅ स्वत: नवीनीकरण सफलतापूर्वक अक्षम कर दिया गया है।`,

  enabledAutoRenewal: (data, expiryDate) =>
    `✅ स्वत: नवीनीकरण सक्षम कर दिया गया है। आपका VPS ${expiryDate} को स्वचालित रूप से नवीनीकृत होगा।`,

  renewVpsPlanConfirmMsg: (data, vpsDetails, expiryDate, low) => `<strong>📜 चालान सारांश</strong>

<strong>• VPS आईडी:</strong> ${vpsDetails.name}
<strong>• प्लान:</strong> ${vpsDetails.planDetails.name}
<strong>• बिलिंग साइकिल:</strong> ${vpsDetails.billingCycleDetails.type}
<strong>• वर्तमान समाप्ति तिथि:</strong> ${expiryDate}
<strong>• देय राशि:</strong> ${data.totalPrice} USD

${
  lowBal
    ? `नोट: आपकी कुल राशि में $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD की जमा राशि शामिल है। पहले घंटे की कटौती के बाद, शेष राशि आपके वॉलेट में क्रेडिट कर दी जाएगी।`
    : ''
}

<strong>• कुल मूल्य:</strong> $${
    lowBal
      ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      : data.totalPrice
  } USD

<strong>💳 क्या आप VPS नवीनीकरण जारी रखना चाहते हैं?</strong>`,

  payNowBtn: '✅ अभी भुगतान करें',

  vpsChangePaymentRecieved: `✅ भुगतान सफल! आपका VPS सेट किया जा रहा है। विवरण जल्द ही उपलब्ध होगा।`,

  bankPayVPSRenewPlan: priceNGN =>
    `कृपया नीचे "भुगतान करें" पर क्लिक करके ${priceNGN} NGN भेजें। जैसे ही लेन-देन की पुष्टि होगी, आपको तुरंत सूचित किया जाएगा, और आपका VPS प्लान सक्रिय और नवीनीकृत कर दिया जाएगा।`,

  renewVpsPanelConfirmMsg: (
    data,
    panelDetails,
    date,
  ) => `<strong>💳 क्या आप नियंत्रण पैनल का नवीनीकरण करना चाहते हैं?</strong>

<strong>📜 चालान सारांश</strong>
  <strong>• संबंधित VPS आईडी:</strong> ${data.name}
  <strong>• नियंत्रण पैनल:</strong> ${panelDetails.type}
  <strong>• नवीनीकरण अवधि:</strong> ${panelDetails.durationValue}${' '}महीने
  <strong>• वर्तमान समाप्ति तिथि:</strong> ${date}
  <strong>• देय राशि:</strong> ${data.totalPrice} USD`,

  bankPayVPSRenewCpanel: (priceNGN, vpsDetails) =>
    `कृपया नीचे "भुगतान करें" पर क्लिक करके ${priceNGN} NGN भेजें। जैसे ही लेन-देन की पुष्टि होगी, आपको तुरंत सूचित किया जाएगा, और आपका VPS प्लान सक्रिय हो जाएगा और ${vpsDetails.cPanelPlanDetails.type} नियंत्रण पैनल नवीनीकृत किया जाएगा।`,

  vpsUnlinkCpanelWarning: vpsDetails =>
    `⚠️ चेतावनी: अलग करने से VPS ${vpsDetails.name} से ${vpsDetails.cPanel} लाइसेंस हटा दिया जाएगा, और आप इसकी सुविधाओं तक पहुंच खो देंगे। क्या आप आगे बढ़ना चाहते हैं?`,

  unlinkCpanelConfirmed: data => `✅ नियंत्रण पैनल ${data.cPanel} को VPS ${data.name} से सफलतापूर्वक हटा दिया गया है।`,

  errorUpgradingVPS: vpsName => `आपके VPS योजना ${vpsName} को अपग्रेड करते समय कुछ गलत हो गया।

कृपया 💬 सहायता प्राप्त करें बटन दबाएं।
अधिक जानकारी प्राप्त करें ${TG_HANDLE}.`,

  vpsUpgradePlanTypeSuccess: vpsDetails => `
✅ VPS ${vpsDetails.name} को ${vpsDetails.upgradeOption.to} में अपग्रेड कर दिया गया है। आपके नए संसाधन अब उपलब्ध हैं।`,

  vpsUpgradeDiskTypeSuccess: vpsDetails =>
    `✅ VPS ${vpsDetails.name} के लिए डिस्क को ${vpsDetails.upgradeOption.to} में अपग्रेड कर दिया गया है। आपका नया डिस्क प्रकार अब सक्रिय है।`,
  vpsRenewPlanSuccess: (vpsDetails, expiryDate) =>
    `✅ ${vpsDetails.name} के लिए VPS सदस्यता सफलतापूर्वक नवीनीकृत हो गई है!

• नई समाप्ति तिथि: ${expiryDate}
`,
  vpsRenewCPanelSuccess: (vpsDetails, expiryDate) =>
    `✅ ${vpsDetails.name} के लिए नियंत्रण पैनल सदस्यता सफलतापूर्वक नवीनीकृत हो गई है!

• नई समाप्ति तिथि: ${expiryDate}
`,
}

const hi = {
  k,
  t,
  u,
  dO,
  bc,
  npl,
  dns,
  kOf,
  user,
  show,
  yesNo,
  html,
  payIn,
  admin,
  payOpts,
  yes_no,
  payBank,
  alcazar,
  planOptionsOf,
  tickerOf,
  linkType,
  tickerViews,
  linkOptions,
  planOptions,
  tickerViewOf,
  dnsRecordType,
  o: userKeyboard,
  phoneNumberLeads,
  aO: adminKeyboard,
  chooseSubscription,
  buyLeadsSelectArea,
  buyLeadsSelectCnam,
  buyLeadsSelectAmount,
  buyLeadsSelectFormat,
  buyLeadsSelectCountry,
  buyLeadsSelectCarrier,
  buyLeadsSelectSmsVoice,
  buyLeadsSelectAreaCode,
  _buyLeadsSelectAreaCode,
  validatorSelectCountry,
  validatorSelectSmsVoice,
  validatorSelectCarrier,
  validatorSelectCnam,
  validatorSelectAmount,
  validatorSelectFormat,
  redSelectRandomCustom,
  redSelectProvider,
  supportedCrypto,
  supportedCryptoView,
  supportedCryptoViewOf,
  languageMenu,
  supportedLanguages,
  l,
  termsAndConditionType,
  hP: hostingPlansText,
  selectFormatOf,
  vp,
  vpsPlanOf,
  vpsCpanelOptional,
}

module.exports = {
  hi,
}
