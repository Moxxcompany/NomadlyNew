// Auto-Promo System - Sends 3 daily promotional messages to all bot users
// Messages are language-aware and rotate to avoid repetition

const schedule = require('node-schedule')
const { log } = require('console')
const BROADCAST_CONFIG = require('./broadcast-config.js')

// Promo themes: domains, url-shortener, phone-leads
// Each theme has 5 rotating variations per language

const promoMessages = {
  en: {
    domains: [
      `<b>🛡️ YOUR WEBSITE, YOUR RULES</b>

Register DMCA-ignored domains — no takedowns, no interference.

🌐 .sbs, .com, .net, .org & 400+ extensions
🔒 Offshore registration — total content privacy
⚡ Instant DNS setup + full management panel
💰 Pay with BTC, ETH, USDT or bank transfer

Your content stays online. Period.

👉 Tap <b>🌐 Register Domain Names</b> to claim yours!

━━━━━━━━━━━━━━━━━
🏢 Need cPanel hosting or country TLDs (.ng .za .ke .gh)?
👉 Visit @hostbay_bot`,

      `<b>🔥 DOMAIN FLASH DEAL</b>

Why risk your website being taken down?

✅ DMCA-Ignored domain registration
✅ No government interference
✅ Full DNS control from day one
✅ Free .sbs domains with subscription plans

Thousands of businesses trust us to keep their sites live.

👉 Type <b>/start</b> → <b>🌐 Register Domain Names</b>

━━━━━━━━━━━━━━━━━
🏢 Country-level domains (.ng .za .ke .cm .tz)?
👉 @hostbay_bot has you covered!`,

      `<b>🌐 OWN YOUR DIGITAL IDENTITY</b>

Every serious brand needs a domain. Get yours today:

🔐 Offshore, privacy-first registration
📋 .sbs .com .net .org .io and more
🛡️ DMCA-ignored — your content, your decision
🔧 Manage DNS records directly from the bot

Starting from just a few dollars.

👉 Tap <b>🌐 Register Domain Names</b> now!

━━━━━━━━━━━━━━━━━
🏢 Looking for web hosting with cPanel?
👉 Head to @hostbay_bot`,

      `<b>⚡ STOP WORRYING ABOUT TAKEDOWNS</b>

Your competitors are already using DMCA-ignored domains. Are you?

🛡️ Content stays up — guaranteed
🌍 Register from anywhere in the world
💳 Crypto & bank payments accepted
📂 Manage all your domains in one place

Don't let a takedown notice destroy your business.

👉 <b>🌐 Register Domain Names</b> — start now!

━━━━━━━━━━━━━━━━━
🏢 Need .ng .za .ke .gh country domains?
👉 Visit @hostbay_bot`,

      `<b>🏆 TRUSTED BY THOUSANDS</b>

Why do smart businesses choose offshore domains?

1️⃣ Zero DMCA takedowns
2️⃣ Full privacy protection
3️⃣ Lightning-fast DNS propagation
4️⃣ Free .sbs domains with plans
5️⃣ Crypto payments for anonymity

Join them today.

👉 Tap <b>🌐 Register Domain Names</b>

━━━━━━━━━━━━━━━━━
🏢 cPanel hosting & country TLD domains?
👉 @hostbay_bot`,
    ],

    shortener: [
      `<b>✂️ SHORTEN. BRAND. TRACK. DOMINATE.</b>

Stop using boring generic links that nobody clicks!

🔗 Custom branded short URLs with YOUR domain
📊 Real-time click analytics & tracking
⚡ Bit.ly integration available ($10)
🆓 Free trial — shorten your first links NOW
🌐 Use any domain you own as your shortener

Turn every link into a conversion machine.

👉 Tap <b>🔗✂️ URL Shortener</b> to get started!

━━━━━━━━━━━━━━━━━
🏢 Need cPanel hosting or country TLDs?
👉 Visit @hostbay_bot`,

      `<b>📊 ARE YOUR LINKS WORKING FOR YOU?</b>

Every click tells a story. Are you listening?

✅ Shorten any URL in seconds
✅ Brand links with YOUR custom domain
✅ Track every single click
✅ Bit.ly premium integration
✅ Unlimited links with subscription

Your links should make money, not look ugly.

👉 Tap <b>🔗✂️ URL Shortener</b> now!

━━━━━━━━━━━━━━━━━
🏢 Country domains (.ng .za .ke .gh)?
👉 @hostbay_bot`,

      `<b>🔗 YOUR BRAND DESERVES BETTER LINKS</b>

<code>bit.ly/3xK9mQ2</code> vs <code>yourbrand.com/deals</code>

Which one would YOU click? Exactly.

🌐 Use your own domain for short links
📈 See who clicks, when, and where
⚡ Random or custom back-half
💰 Bit.ly for power users

Make every link count.

👉 <b>🔗✂️ URL Shortener</b> — try it free!

━━━━━━━━━━━━━━━━━
🏢 Need hosting? Visit @hostbay_bot`,

      `<b>⚡ LINK SHORTENING MADE POWERFUL</b>

Marketing without tracking is like driving blind.

🔀 Redirect & shorten any URL
✂️ Custom domain shortener
📊 View shortlink analytics
🔗 Bit.ly integration for premium needs
🆓 Free links to get you started

Stop guessing. Start tracking.

👉 Type <b>/start</b> → <b>🔗✂️ URL Shortener</b>

━━━━━━━━━━━━━━━━━
🏢 cPanel hosting & country TLDs?
👉 @hostbay_bot`,

      `<b>🎯 SMART MARKETERS USE SMART LINKS</b>

Did you know branded short links get up to 34% more clicks?

✅ Register a domain → use it as your shortener
✅ Track performance in real-time
✅ Supports Bit.ly & custom solutions
✅ Unlimited links with Daily/Weekly/Monthly plans

Level up your marketing game today.

👉 Tap <b>🔗✂️ URL Shortener</b>

━━━━━━━━━━━━━━━━━
🏢 Need country-level domains?
👉 @hostbay_bot`,
    ],

    leads: [
      `<b>📲 HQ PHONE LEADS — FUEL YOUR CAMPAIGNS</b>

Target the right audience with precision:

🎯 Filter by country, state, area code
📱 SMS-ready & voice-ready leads
🏢 Filter by carrier (T-Mobile, AT&T, Verizon...)
📁 Local or International format export
💰 Starting from $20 per 1,000 leads

Already have numbers? Validate them for $15/1000!

👉 Tap <b>📲 HQ SMS Lead</b> to start!

━━━━━━━━━━━━━━━━━
🏢 Need cPanel hosting or country TLDs (.ng .za .ke)?
👉 Visit @hostbay_bot`,

      `<b>🎯 STOP WASTING MONEY ON BAD LEADS</b>

Your SMS campaigns are only as good as your phone list.

✅ Buy verified phone leads by country & area
✅ Or bring your own numbers for validation
✅ CNAM lookup — know who you're reaching
✅ Filter by carrier for better deliverability
✅ Bulk download — instant delivery

Clean data = higher ROI.

👉 Tap <b>📲 HQ SMS Lead</b> now!

━━━━━━━━━━━━━━━━━
🏢 Country domains & hosting?
👉 @hostbay_bot`,

      `<b>📱 VALIDATE BEFORE YOU SEND</b>

Sending SMS to dead numbers? You're burning cash.

🔍 Upload your phone list (any format)
✅ We validate each number
📊 Get back only ACTIVE numbers
🏢 Filter by carrier & CNAM
💰 Just $15 per 1,000 validations

Save money. Reach real people.

👉 Tap <b>📲 HQ SMS Lead</b> → <b>Validate PhoneLeads</b>

━━━━━━━━━━━━━━━━━
🏢 Need hosting? Visit @hostbay_bot`,

      `<b>💰 FRESH LEADS = FRESH REVENUE</b>

Access millions of verified phone numbers:

🇺🇸 USA | 🇬🇧 UK | 🇨🇦 Canada | 🇦🇺 Australia
🇳🇿 New Zealand & more countries

📲 SMS & Voice leads available
🎯 Filter: state, area code, carrier
📁 1,000 to 5,000+ per order
⚡ Instant delivery to your chat

👉 <b>📲 HQ SMS Lead</b> → <b>Buy PhoneLeads</b>

━━━━━━━━━━━━━━━━━
🏢 Country TLD domains (.ng .za .ke .gh)?
👉 @hostbay_bot`,

      `<b>🚀 SCALE YOUR SMS MARKETING TODAY</b>

The #1 bot for phone lead generation:

1️⃣ Choose country & region
2️⃣ Pick carrier & format
3️⃣ Select quantity (1K-5K+)
4️⃣ Pay with crypto or wallet
5️⃣ Download instantly!

Already have a list? Validate it with us!

👉 Tap <b>📲 HQ SMS Lead</b> to begin

━━━━━━━━━━━━━━━━━
🏢 Need cPanel hosting?
👉 @hostbay_bot`,
    ],
  },

  fr: {
    domains: [
      `<b>🛡️ VOTRE SITE WEB, VOS RÈGLES</b>

Enregistrez des domaines ignorant le DMCA — aucun retrait, aucune interférence.

🌐 .sbs, .com, .net, .org & 400+ extensions
🔒 Enregistrement offshore — confidentialité totale
⚡ Configuration DNS instantanée + panneau de gestion complet
💰 Payez en BTC, ETH, USDT ou virement bancaire

Votre contenu reste en ligne. Point final.

👉 Appuyez sur <b>🌐 Enregistrer des noms de domaine</b> !

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement cPanel ou de domaines pays (.ng .za .ke .gh) ?
👉 Visitez @hostbay_bot`,

      `<b>🔥 OFFRE FLASH DOMAINES</b>

Pourquoi risquer que votre site soit supprimé ?

✅ Enregistrement de domaines ignorant le DMCA
✅ Aucune interférence gouvernementale
✅ Contrôle DNS complet dès le premier jour
✅ Domaines .sbs gratuits avec les abonnements

Des milliers d'entreprises nous font confiance.

👉 Tapez <b>/start</b> → <b>🌐 Enregistrer des noms de domaine</b>

━━━━━━━━━━━━━━━━━
🏢 Domaines pays (.ng .za .ke .cm .tz) ?
👉 @hostbay_bot s'en charge !`,

      `<b>🌐 POSSÉDEZ VOTRE IDENTITÉ NUMÉRIQUE</b>

Toute marque sérieuse a besoin d'un domaine. Obtenez le vôtre :

🔐 Enregistrement offshore, confidentialité d'abord
📋 .sbs .com .net .org .io et plus
🛡️ DMCA ignoré — votre contenu, votre décision
🔧 Gérez les enregistrements DNS directement depuis le bot

À partir de quelques dollars seulement.

👉 Appuyez sur <b>🌐 Enregistrer des noms de domaine</b> !

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement web avec cPanel ?
👉 Direction @hostbay_bot`,

      `<b>⚡ ARRÊTEZ DE VOUS INQUIÉTER DES SUPPRESSIONS</b>

Vos concurrents utilisent déjà des domaines DMCA-ignorés. Et vous ?

🛡️ Le contenu reste en ligne — garanti
🌍 Enregistrez depuis n'importe où dans le monde
💳 Paiements crypto & bancaires acceptés
📂 Gérez tous vos domaines au même endroit

Ne laissez pas un avis DMCA détruire votre business.

👉 <b>🌐 Enregistrer des noms de domaine</b> — commencez !

━━━━━━━━━━━━━━━━━
🏢 Besoin de domaines .ng .za .ke .gh ?
👉 Visitez @hostbay_bot`,

      `<b>🏆 LA CONFIANCE DE MILLIERS D'UTILISATEURS</b>

Pourquoi les entreprises intelligentes choisissent l'offshore ?

1️⃣ Zéro suppression DMCA
2️⃣ Protection totale de la vie privée
3️⃣ Propagation DNS ultra-rapide
4️⃣ Domaines .sbs gratuits avec les plans
5️⃣ Paiements crypto pour l'anonymat

Rejoignez-les aujourd'hui.

👉 Appuyez sur <b>🌐 Enregistrer des noms de domaine</b>

━━━━━━━━━━━━━━━━━
🏢 Hébergement cPanel & domaines pays ?
👉 @hostbay_bot`,
    ],

    shortener: [
      `<b>✂️ RACCOURCISSEZ. PERSONNALISEZ. ANALYSEZ.</b>

Arrêtez d'utiliser des liens génériques que personne ne clique !

🔗 URLs courtes personnalisées avec VOTRE domaine
📊 Analyse des clics en temps réel
⚡ Intégration Bit.ly disponible (10$)
🆓 Essai gratuit — raccourcissez vos premiers liens
🌐 Utilisez n'importe quel domaine comme raccourcisseur

Transformez chaque lien en machine à conversion.

👉 Appuyez sur <b>🔗✂️ Raccourcisseur d'URL</b> !

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement cPanel ou de domaines pays ?
👉 Visitez @hostbay_bot`,

      `<b>📊 VOS LIENS TRAVAILLENT-ILS POUR VOUS ?</b>

Chaque clic raconte une histoire. Vous écoutez ?

✅ Raccourcissez n'importe quelle URL en secondes
✅ Personnalisez avec VOTRE domaine
✅ Suivez chaque clic
✅ Intégration Bit.ly premium
✅ Liens illimités avec abonnement

Vos liens devraient rapporter de l'argent.

👉 Appuyez sur <b>🔗✂️ Raccourcisseur d'URL</b> !

━━━━━━━━━━━━━━━━━
🏢 Domaines pays (.ng .za .ke .gh) ?
👉 @hostbay_bot`,

      `<b>🔗 VOTRE MARQUE MÉRITE DE MEILLEURS LIENS</b>

<code>bit.ly/3xK9mQ2</code> vs <code>votremarque.com/offres</code>

Lequel cliqueriez-VOUS ? Exactement.

🌐 Utilisez votre propre domaine
📈 Voyez qui clique, quand et où
⚡ Extension aléatoire ou personnalisée
💰 Bit.ly pour les utilisateurs avancés

Faites compter chaque lien.

👉 <b>🔗✂️ Raccourcisseur d'URL</b> — essayez gratuitement !

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement ? Visitez @hostbay_bot`,

      `<b>⚡ RACCOURCISSEMENT DE LIENS PUISSANT</b>

Le marketing sans suivi, c'est comme conduire à l'aveugle.

🔀 Redirigez & raccourcissez n'importe quelle URL
✂️ Raccourcisseur de domaine personnalisé
📊 Consultez les analyses de vos liens
🔗 Intégration Bit.ly pour les besoins premium
🆓 Liens gratuits pour commencer

Arrêtez de deviner. Commencez à suivre.

👉 Tapez <b>/start</b> → <b>🔗✂️ Raccourcisseur d'URL</b>

━━━━━━━━━━━━━━━━━
🏢 Hébergement cPanel & domaines pays ?
👉 @hostbay_bot`,

      `<b>🎯 LES MARKETEURS INTELLIGENTS UTILISENT DES LIENS INTELLIGENTS</b>

Saviez-vous que les liens personnalisés obtiennent 34% de clics en plus ?

✅ Enregistrez un domaine → utilisez-le comme raccourcisseur
✅ Suivez la performance en temps réel
✅ Compatible Bit.ly & solutions personnalisées
✅ Liens illimités avec les plans Quotidien/Hebdo/Mensuel

Passez au niveau supérieur aujourd'hui.

👉 Appuyez sur <b>🔗✂️ Raccourcisseur d'URL</b>

━━━━━━━━━━━━━━━━━
🏢 Besoin de domaines pays ?
👉 @hostbay_bot`,
    ],

    leads: [
      `<b>📲 LEADS TÉLÉPHONIQUES HQ — ALIMENTEZ VOS CAMPAGNES</b>

Ciblez la bonne audience avec précision :

🎯 Filtrez par pays, état, indicatif
📱 Leads prêts pour SMS & appels vocaux
🏢 Filtrez par opérateur (T-Mobile, AT&T, Verizon...)
📁 Export format local ou international
💰 À partir de 20$ pour 1 000 leads

Vous avez déjà des numéros ? Validez-les pour 15$/1000 !

👉 Appuyez sur <b>📲 Pistes SMS HQ</b> !

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement cPanel ou de domaines pays ?
👉 Visitez @hostbay_bot`,

      `<b>🎯 ARRÊTEZ DE GASPILLER DE L'ARGENT SUR DE MAUVAIS LEADS</b>

Vos campagnes SMS sont aussi bonnes que votre liste.

✅ Achetez des leads vérifiés par pays & zone
✅ Ou amenez vos propres numéros à valider
✅ Recherche CNAM — sachez qui vous contactez
✅ Filtrez par opérateur pour une meilleure délivrabilité
✅ Téléchargement en masse — livraison instantanée

Données propres = meilleur ROI.

👉 Appuyez sur <b>📲 Pistes SMS HQ</b> !

━━━━━━━━━━━━━━━━━
🏢 Domaines pays & hébergement ?
👉 @hostbay_bot`,

      `<b>📱 VALIDEZ AVANT D'ENVOYER</b>

Vous envoyez des SMS à des numéros morts ? Vous brûlez du cash.

🔍 Uploadez votre liste (n'importe quel format)
✅ Nous validons chaque numéro
📊 Récupérez uniquement les numéros ACTIFS
🏢 Filtrez par opérateur & CNAM
💰 Seulement 15$ pour 1 000 validations

Économisez. Atteignez de vraies personnes.

👉 <b>📲 Pistes SMS HQ</b> → <b>Valider les leads</b>

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement ? Visitez @hostbay_bot`,

      `<b>💰 LEADS FRAIS = REVENUS FRAIS</b>

Accédez à des millions de numéros vérifiés :

🇺🇸 USA | 🇬🇧 UK | 🇨🇦 Canada | 🇦🇺 Australie
🇳🇿 Nouvelle-Zélande & plus

📲 Leads SMS & voix disponibles
🎯 Filtres : état, indicatif, opérateur
📁 1 000 à 5 000+ par commande
⚡ Livraison instantanée dans le chat

👉 <b>📲 Pistes SMS HQ</b> → <b>Acheter des leads</b>

━━━━━━━━━━━━━━━━━
🏢 Domaines TLD pays (.ng .za .ke .gh) ?
👉 @hostbay_bot`,

      `<b>🚀 DÉVELOPPEZ VOTRE MARKETING SMS AUJOURD'HUI</b>

Le bot #1 pour la génération de leads téléphoniques :

1️⃣ Choisissez pays & région
2️⃣ Sélectionnez opérateur & format
3️⃣ Choisissez la quantité (1K-5K+)
4️⃣ Payez en crypto ou portefeuille
5️⃣ Téléchargez instantanément !

Vous avez déjà une liste ? Validez-la chez nous !

👉 Appuyez sur <b>📲 Pistes SMS HQ</b>

━━━━━━━━━━━━━━━━━
🏢 Besoin d'hébergement cPanel ?
👉 @hostbay_bot`,
    ],
  },

  zh: {
    domains: [
      `<b>🛡️ 您的网站，您做主</b>

注册无视DMCA的域名 — 无删除，无干扰。

🌐 .sbs、.com、.net、.org 及400+扩展名
🔒 离岸注册 — 完全内容隐私
⚡ 即时DNS设置 + 完整管理面板
💰 支持BTC、ETH、USDT或银行转账

您的内容永久在线。

👉 点击 <b>🌐 注册域名</b> 立即注册！

━━━━━━━━━━━━━━━━━
🏢 需要cPanel主机或国家域名 (.ng .za .ke .gh)？
👉 访问 @hostbay_bot`,

      `<b>🔥 域名限时优惠</b>

为什么要冒网站被下架的风险？

✅ 无视DMCA的域名注册
✅ 无政府干预
✅ 从第一天起完全控制DNS
✅ 订阅计划赠送免费.sbs域名

数千企业信赖我们。

👉 输入 <b>/start</b> → <b>🌐 注册域名</b>

━━━━━━━━━━━━━━━━━
🏢 国家域名 (.ng .za .ke .cm .tz)？
👉 @hostbay_bot 为您服务！`,

      `<b>🌐 拥有您的数字身份</b>

每个认真的品牌都需要域名。立即获取：

🔐 离岸、隐私优先注册
📋 .sbs .com .net .org .io 等更多
🛡️ 无视DMCA — 您的内容由您决定
🔧 直接从机器人管理DNS记录

仅需几美元起。

👉 立即点击 <b>🌐 注册域名</b>！

━━━━━━━━━━━━━━━━━
🏢 需要cPanel网站托管？
👉 前往 @hostbay_bot`,

      `<b>⚡ 不再担心内容被删除</b>

您的竞争对手已经在使用无视DMCA的域名。您呢？

🛡️ 内容保持在线 — 保证
🌍 全球任何地方均可注册
💳 接受加密货币和银行支付
📂 在一处管理所有域名

别让DMCA通知毁掉您的业务。

👉 <b>🌐 注册域名</b> — 立即开始！

━━━━━━━━━━━━━━━━━
🏢 需要 .ng .za .ke .gh 国家域名？
👉 访问 @hostbay_bot`,

      `<b>🏆 数千用户的信赖之选</b>

聪明的企业为什么选择离岸域名？

1️⃣ 零DMCA删除
2️⃣ 完全隐私保护
3️⃣ 极速DNS传播
4️⃣ 计划赠送免费.sbs域名
5️⃣ 加密货币支付保护匿名

今天就加入他们。

👉 点击 <b>🌐 注册域名</b>

━━━━━━━━━━━━━━━━━
🏢 cPanel托管和国家域名？
👉 @hostbay_bot`,
    ],

    shortener: [
      `<b>✂️ 缩短·品牌化·追踪·制胜</b>

别再用无人点击的无聊链接了！

🔗 用您自己的域名创建品牌短链接
📊 实时点击数据分析
⚡ 支持Bit.ly集成（$10）
🆓 免费试用 — 立即缩短您的第一个链接
🌐 使用任何您拥有的域名作为缩短器

让每个链接成为转化利器。

👉 点击 <b>🔗✂️ URL 缩短器</b> 开始！

━━━━━━━━━━━━━━━━━
🏢 需要cPanel托管或国家域名？
👉 访问 @hostbay_bot`,

      `<b>📊 您的链接在为您工作吗？</b>

每次点击都是一个故事。您在倾听吗？

✅ 秒级缩短任何URL
✅ 用您的自定义域名打造品牌
✅ 追踪每一次点击
✅ Bit.ly高级集成
✅ 订阅即可无限链接

您的链接应该赚钱，而不是看起来丑陋。

👉 立即点击 <b>🔗✂️ URL 缩短器</b>！

━━━━━━━━━━━━━━━━━
🏢 国家域名 (.ng .za .ke .gh)？
👉 @hostbay_bot`,

      `<b>🔗 您的品牌值得更好的链接</b>

<code>bit.ly/3xK9mQ2</code> vs <code>您的品牌.com/优惠</code>

您会点击哪个？答案很明显。

🌐 使用您自己的域名创建短链接
📈 查看谁点击了、何时、从哪里
⚡ 随机或自定义后缀
💰 Bit.ly适合高级用户

让每个链接都有价值。

👉 <b>🔗✂️ URL 缩短器</b> — 免费试用！

━━━━━━━━━━━━━━━━━
🏢 需要托管？访问 @hostbay_bot`,

      `<b>⚡ 强大的链接缩短工具</b>

没有追踪的营销就像蒙眼开车。

🔀 重定向和缩短任何URL
✂️ 自定义域名缩短器
📊 查看短链接分析数据
🔗 Bit.ly集成满足高级需求
🆓 免费链接助您起步

别猜了。开始追踪吧。

👉 输入 <b>/start</b> → <b>🔗✂️ URL 缩短器</b>

━━━━━━━━━━━━━━━━━
🏢 cPanel托管和国家域名？
👉 @hostbay_bot`,

      `<b>🎯 聪明的营销人用聪明的链接</b>

您知道品牌短链接的点击率高出34%吗？

✅ 注册域名 → 用它作为缩短器
✅ 实时跟踪性能
✅ 支持Bit.ly和自定义方案
✅ 日/周/月计划享无限链接

今天就升级您的营销策略。

👉 点击 <b>🔗✂️ URL 缩短器</b>

━━━━━━━━━━━━━━━━━
🏢 需要国家级域名？
👉 @hostbay_bot`,
    ],

    leads: [
      `<b>📲 高质量电话线索 — 驱动您的营销</b>

精准定位目标受众：

🎯 按国家、州、区号筛选
📱 短信线索和语音线索
🏢 按运营商筛选（T-Mobile、AT&T、Verizon...）
📁 本地或国际格式导出
💰 1,000条起仅需$20

已有号码？验证仅需$15/1000条！

👉 点击 <b>📲 HQ 短信线索</b> 开始！

━━━━━━━━━━━━━━━━━
🏢 需要cPanel托管或国家域名？
👉 访问 @hostbay_bot`,

      `<b>🎯 停止在劣质线索上浪费金钱</b>

您的短信营销效果取决于电话列表质量。

✅ 按国家和区域购买验证线索
✅ 或带上您自己的号码进行验证
✅ CNAM查询 — 了解联系对象
✅ 按运营商筛选提高送达率
✅ 批量下载 — 即时交付

干净数据 = 更高ROI。

👉 立即点击 <b>📲 HQ 短信线索</b>！

━━━━━━━━━━━━━━━━━
🏢 国家域名和托管？
👉 @hostbay_bot`,

      `<b>📱 发送前先验证</b>

向无效号码发短信？您在烧钱。

🔍 上传您的电话列表（任何格式）
✅ 我们验证每个号码
📊 只返回有效号码
🏢 按运营商和CNAM筛选
💰 1,000次验证仅需$15

省钱。触达真实用户。

👉 <b>📲 HQ 短信线索</b> → <b>验证电话线索</b>

━━━━━━━━━━━━━━━━━
🏢 需要托管？访问 @hostbay_bot`,

      `<b>💰 新鲜线索 = 新鲜收入</b>

获取数百万验证电话号码：

🇺🇸 美国 | 🇬🇧 英国 | 🇨🇦 加拿大 | 🇦🇺 澳大利亚
🇳🇿 新西兰等更多国家

📲 短信和语音线索均可
🎯 筛选：州、区号、运营商
📁 每单1,000至5,000+条
⚡ 即时交付到您的聊天

👉 <b>📲 HQ 短信线索</b> → <b>购买电话线索</b>

━━━━━━━━━━━━━━━━━
🏢 国家TLD域名 (.ng .za .ke .gh)？
👉 @hostbay_bot`,

      `<b>🚀 今天就扩大您的短信营销</b>

电话线索生成的头号机器人：

1️⃣ 选择国家和区域
2️⃣ 选择运营商和格式
3️⃣ 选择数量（1K-5K+）
4️⃣ 用加密货币或钱包支付
5️⃣ 即时下载！

已有列表？在这里验证！

👉 点击 <b>📲 HQ 短信线索</b>

━━━━━━━━━━━━━━━━━
🏢 需要cPanel托管？
👉 @hostbay_bot`,
    ],
  },

  hi: {
    domains: [
      `<b>🛡️ आपकी वेबसाइट, आपके नियम</b>

DMCA-अनदेखा डोमेन रजिस्टर करें — कोई हटाव नहीं, कोई हस्तक्षेप नहीं।

🌐 .sbs, .com, .net, .org और 400+ एक्सटेंशन
🔒 ऑफशोर रजिस्ट्रेशन — पूर्ण गोपनीयता
⚡ तुरंत DNS सेटअप + पूर्ण प्रबंधन पैनल
💰 BTC, ETH, USDT या बैंक ट्रांसफर से भुगतान

आपकी सामग्री ऑनलाइन रहती है। बस।

👉 <b>🌐 डोमेन नाम पंजीकृत करें</b> दबाएं!

━━━━━━━━━━━━━━━━━
🏢 cPanel होस्टिंग या देश TLD (.ng .za .ke .gh) चाहिए?
👉 @hostbay_bot पर जाएं`,

      `<b>🔥 डोमेन फ्लैश डील</b>

अपनी वेबसाइट हटाए जाने का खतरा क्यों उठाएं?

✅ DMCA-अनदेखा डोमेन रजिस्ट्रेशन
✅ कोई सरकारी हस्तक्षेप नहीं
✅ पहले दिन से पूर्ण DNS नियंत्रण
✅ सब्सक्रिप्शन प्लान के साथ मुफ्त .sbs डोमेन

हजारों व्यवसाय हम पर भरोसा करते हैं।

👉 <b>/start</b> टाइप करें → <b>🌐 डोमेन नाम पंजीकृत करें</b>

━━━━━━━━━━━━━━━━━
🏢 देश डोमेन (.ng .za .ke .cm .tz)?
👉 @hostbay_bot आपकी सेवा में!`,

      `<b>🌐 अपनी डिजिटल पहचान बनाएं</b>

हर गंभीर ब्रांड को डोमेन चाहिए। आज ही पाएं:

🔐 ऑफशोर, गोपनीयता-प्रथम रजिस्ट्रेशन
📋 .sbs .com .net .org .io और अधिक
🛡️ DMCA अनदेखा — आपकी सामग्री, आपका फैसला
🔧 बॉट से सीधे DNS रिकॉर्ड प्रबंधित करें

बस कुछ डॉलर से शुरू।

👉 अभी <b>🌐 डोमेन नाम पंजीकृत करें</b> दबाएं!

━━━━━━━━━━━━━━━━━
🏢 cPanel वेब होस्टिंग चाहिए?
👉 @hostbay_bot पर जाएं`,

      `<b>⚡ हटाव की चिंता छोड़ें</b>

आपके प्रतिद्वंद्वी पहले से DMCA-अनदेखा डोमेन इस्तेमाल कर रहे हैं। आप कब?

🛡️ सामग्री ऑनलाइन रहती है — गारंटी
🌍 दुनिया में कहीं से भी रजिस्टर करें
💳 क्रिप्टो और बैंक भुगतान स्वीकृत
📂 सभी डोमेन एक जगह प्रबंधित करें

DMCA नोटिस को अपना बिजनेस बर्बाद न करने दें।

👉 <b>🌐 डोमेन नाम पंजीकृत करें</b> — अभी शुरू करें!

━━━━━━━━━━━━━━━━━
🏢 .ng .za .ke .gh देश डोमेन चाहिए?
👉 @hostbay_bot पर जाएं`,

      `<b>🏆 हजारों की भरोसेमंद पसंद</b>

स्मार्ट बिजनेस ऑफशोर डोमेन क्यों चुनते हैं?

1️⃣ शून्य DMCA हटाव
2️⃣ पूर्ण गोपनीयता सुरक्षा
3️⃣ अति-तेज DNS प्रसारण
4️⃣ प्लान के साथ मुफ्त .sbs डोमेन
5️⃣ गुमनामी के लिए क्रिप्टो भुगतान

आज ही जुड़ें।

👉 <b>🌐 डोमेन नाम पंजीकृत करें</b> दबाएं

━━━━━━━━━━━━━━━━━
🏢 cPanel होस्टिंग और देश डोमेन?
👉 @hostbay_bot`,
    ],

    shortener: [
      `<b>✂️ छोटा करें। ब्रांड बनाएं। ट्रैक करें। जीतें।</b>

बोरिंग लिंक इस्तेमाल करना बंद करें!

🔗 अपने डोमेन से कस्टम ब्रांडेड शॉर्ट URL
📊 रियल-टाइम क्लिक एनालिटिक्स
⚡ Bit.ly इंटीग्रेशन उपलब्ध ($10)
🆓 फ्री ट्रायल — अभी अपने पहले लिंक छोटे करें
🌐 कोई भी डोमेन शॉर्टनर के रूप में इस्तेमाल करें

हर लिंक को कन्वर्जन मशीन बनाएं।

👉 <b>🔗✂️ URL छोटा करें</b> दबाएं!

━━━━━━━━━━━━━━━━━
🏢 cPanel होस्टिंग या देश TLD चाहिए?
👉 @hostbay_bot पर जाएं`,

      `<b>📊 क्या आपके लिंक आपके लिए काम कर रहे हैं?</b>

हर क्लिक एक कहानी बताता है। क्या आप सुन रहे हैं?

✅ सेकंडों में कोई भी URL छोटा करें
✅ अपने कस्टम डोमेन से ब्रांड बनाएं
✅ हर क्लिक ट्रैक करें
✅ Bit.ly प्रीमियम इंटीग्रेशन
✅ सब्सक्रिप्शन के साथ अनलिमिटेड लिंक

आपके लिंक पैसा कमाने चाहिए।

👉 अभी <b>🔗✂️ URL छोटा करें</b> दबाएं!

━━━━━━━━━━━━━━━━━
🏢 देश डोमेन (.ng .za .ke .gh)?
👉 @hostbay_bot`,

      `<b>🔗 आपका ब्रांड बेहतर लिंक का हकदार है</b>

<code>bit.ly/3xK9mQ2</code> vs <code>आपकाब्रांड.com/ऑफर</code>

आप कौन सा क्लिक करेंगे? बिल्कुल।

🌐 अपने डोमेन से शॉर्ट लिंक बनाएं
📈 देखें कौन क्लिक करता है, कब और कहां से
⚡ रैंडम या कस्टम बैक-हाफ
💰 पावर यूजर्स के लिए Bit.ly

हर लिंक को मायने रखें।

👉 <b>🔗✂️ URL छोटा करें</b> — मुफ्त में आजमाएं!

━━━━━━━━━━━━━━━━━
🏢 होस्टिंग चाहिए? @hostbay_bot पर जाएं`,

      `<b>⚡ शक्तिशाली लिंक शॉर्टनिंग</b>

बिना ट्रैकिंग के मार्केटिंग अंधेरे में गाड़ी चलाने जैसा है।

🔀 किसी भी URL को रीडायरेक्ट और छोटा करें
✂️ कस्टम डोमेन शॉर्टनर
📊 शॉर्टलिंक एनालिटिक्स देखें
🔗 प्रीमियम जरूरतों के लिए Bit.ly
🆓 शुरू करने के लिए मुफ्त लिंक

अनुमान लगाना बंद करें। ट्रैक करना शुरू करें।

👉 <b>/start</b> टाइप करें → <b>🔗✂️ URL छोटा करें</b>

━━━━━━━━━━━━━━━━━
🏢 cPanel होस्टिंग और देश TLD?
👉 @hostbay_bot`,

      `<b>🎯 स्मार्ट मार्केटर स्मार्ट लिंक इस्तेमाल करते हैं</b>

क्या आप जानते हैं ब्रांडेड शॉर्ट लिंक पर 34% ज्यादा क्लिक आते हैं?

✅ डोमेन रजिस्टर करें → शॉर्टनर के रूप में इस्तेमाल करें
✅ रियल-टाइम में परफॉर्मेंस ट्रैक करें
✅ Bit.ly और कस्टम सॉल्यूशन सपोर्ट
✅ दैनिक/साप्ताहिक/मासिक प्लान के साथ अनलिमिटेड लिंक

आज ही अपनी मार्केटिंग गेम अपग्रेड करें।

👉 <b>🔗✂️ URL छोटा करें</b> दबाएं

━━━━━━━━━━━━━━━━━
🏢 देश-स्तरीय डोमेन चाहिए?
👉 @hostbay_bot`,
    ],

    leads: [
      `<b>📲 HQ फोन लीड्स — अपनी कैंपेन को ईंधन दें</b>

सटीक लक्ष्यीकरण:

🎯 देश, राज्य, एरिया कोड से फ़िल्टर
📱 SMS-रेडी और वॉइस-रेडी लीड्स
🏢 कैरियर से फ़िल्टर (T-Mobile, AT&T, Verizon...)
📁 लोकल या इंटरनेशनल फॉर्मेट एक्सपोर्ट
💰 1,000 लीड्स सिर्फ $20 से

पहले से नंबर हैं? $15/1000 में वैलिडेट करें!

👉 <b>📲 HQ एसएमएस लीड</b> दबाएं!

━━━━━━━━━━━━━━━━━
🏢 cPanel होस्टिंग या देश TLD चाहिए?
👉 @hostbay_bot पर जाएं`,

      `<b>🎯 खराब लीड्स पर पैसा बर्बाद करना बंद करें</b>

आपकी SMS कैंपेन उतनी ही अच्छी है जितनी आपकी फोन लिस्ट।

✅ देश और क्षेत्र के अनुसार वेरिफाइड लीड्स खरीदें
✅ या अपने नंबर वैलिडेशन के लिए लाएं
✅ CNAM लुकअप — जानें किसे कॉन्टैक्ट कर रहे हैं
✅ बेहतर डिलीवरी के लिए कैरियर फ़िल्टर
✅ बल्क डाउनलोड — तुरंत डिलीवरी

साफ डेटा = बेहतर ROI।

👉 अभी <b>📲 HQ एसएमएस लीड</b> दबाएं!

━━━━━━━━━━━━━━━━━
🏢 देश डोमेन और होस्टिंग?
👉 @hostbay_bot`,

      `<b>📱 भेजने से पहले वैलिडेट करें</b>

डेड नंबर्स पर SMS भेज रहे हैं? आप पैसा जला रहे हैं।

🔍 अपनी फोन लिस्ट अपलोड करें (कोई भी फॉर्मेट)
✅ हम हर नंबर वैलिडेट करते हैं
📊 सिर्फ एक्टिव नंबर वापस पाएं
🏢 कैरियर और CNAM से फ़िल्टर
💰 1,000 वैलिडेशन सिर्फ $15

पैसा बचाएं। असली लोगों तक पहुंचें।

👉 <b>📲 HQ एसएमएस लीड</b> → <b>फोन लीड्स सत्यापित करें</b>

━━━━━━━━━━━━━━━━━
🏢 होस्टिंग चाहिए? @hostbay_bot पर जाएं`,

      `<b>💰 ताज़ा लीड्स = ताज़ा रेवेन्यू</b>

लाखों वेरिफाइड फोन नंबर एक्सेस करें:

🇺🇸 USA | 🇬🇧 UK | 🇨🇦 कनाडा | 🇦🇺 ऑस्ट्रेलिया
🇳🇿 न्यूज़ीलैंड और अधिक

📲 SMS और वॉइस लीड्स उपलब्ध
🎯 फ़िल्टर: राज्य, एरिया कोड, कैरियर
📁 प्रति ऑर्डर 1,000 से 5,000+
⚡ चैट में तुरंत डिलीवरी

👉 <b>📲 HQ एसएमएस लीड</b> → <b>फोन लीड्स खरीदें</b>

━━━━━━━━━━━━━━━━━
🏢 देश TLD डोमेन (.ng .za .ke .gh)?
👉 @hostbay_bot`,

      `<b>🚀 आज ही अपनी SMS मार्केटिंग बढ़ाएं</b>

फोन लीड जनरेशन का #1 बॉट:

1️⃣ देश और क्षेत्र चुनें
2️⃣ कैरियर और फॉर्मेट चुनें
3️⃣ मात्रा चुनें (1K-5K+)
4️⃣ क्रिप्टो या वॉलेट से भुगतान
5️⃣ तुरंत डाउनलोड करें!

पहले से लिस्ट है? हमारे पास वैलिडेट करें!

👉 <b>📲 HQ एसएमएस लीड</b> दबाएं

━━━━━━━━━━━━━━━━━
🏢 cPanel होस्टिंग चाहिए?
👉 @hostbay_bot`,
    ],
  },
}

// Theme order for the 3 daily slots
const THEMES = ['domains', 'shortener', 'leads']

// Schedule times (UTC) - morning, afternoon, evening
const SCHEDULE_TIMES = [
  { hour: 10, minute: 0 },  // Morning - Domains
  { hour: 16, minute: 0 },  // Afternoon - URL Shortener  
  { hour: 21, minute: 0 },  // Evening - Phone Leads
]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Initialize the auto-promo system
 * @param {Object} bot - Telegram bot instance
 * @param {Object} db - MongoDB database instance
 * @param {Object} nameOf - nameOf collection for getting all user chatIds
 * @param {Object} stateCol - state collection for user language/opt-out
 */
function initAutoPromo(bot, db, nameOf, stateCol) {
  // Create promo tracking collection
  const promoTracker = db.collection('promoTracker')
  const promoOptOut = db.collection('promoOptOut')

  /**
   * Get the next rotation index for a theme
   */
  async function getRotationIndex(theme) {
    const tracker = await promoTracker.findOne({ _id: theme })
    const currentIndex = tracker?.index || 0
    const maxVariations = 5
    const nextIndex = (currentIndex + 1) % maxVariations
    
    await promoTracker.updateOne(
      { _id: theme },
      { $set: { index: nextIndex, lastSent: new Date() } },
      { upsert: true }
    )
    
    return currentIndex
  }

  /**
   * Check if user has opted out of promos
   */
  async function isOptedOut(chatId) {
    const record = await promoOptOut.findOne({ _id: chatId })
    return record?.optedOut === true
  }

  /**
   * Set opt-out status for a user
   */
  async function setOptOut(chatId, optedOut) {
    await promoOptOut.updateOne(
      { _id: chatId },
      { $set: { optedOut, updatedAt: new Date() } },
      { upsert: true }
    )
  }

  /**
   * Get all user chatIds from nameOf collection
   */
  async function getAllChatIds() {
    try {
      const users = await nameOf.find({}).toArray()
      return users.map(u => u._id).filter(id => typeof id === 'number')
    } catch (error) {
      log(`Error fetching chat IDs for promo: ${error.message}`)
      return []
    }
  }

  /**
   * Get user language preference
   */
  async function getUserLanguage(chatId) {
    try {
      const userState = await stateCol.findOne({ _id: chatId })
      const lang = userState?.userLanguage || 'en'
      // Fallback to 'en' if language not supported
      return promoMessages[lang] ? lang : 'en'
    } catch {
      return 'en'
    }
  }

  /**
   * Send a promo to a single user in their language
   */
  async function sendPromoToUser(chatId, theme, variationIndex) {
    try {
      // Check opt-out
      if (await isOptedOut(chatId)) return { success: true, skipped: true }

      const lang = await getUserLanguage(chatId)
      const messages = promoMessages[lang]?.[theme] || promoMessages.en[theme]
      const message = messages[variationIndex % messages.length]

      await bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true })
      return { success: true }
    } catch (error) {
      if (error.response?.statusCode === 403) {
        // User blocked the bot - auto opt-out
        await setOptOut(chatId, true)
        log(`User ${chatId} blocked bot, auto opted-out from promos`)
      }
      return { success: false, error: error.message }
    }
  }

  /**
   * Broadcast a promo to all users
   */
  async function broadcastPromo(themeIndex) {
    const theme = THEMES[themeIndex]
    const variationIndex = await getRotationIndex(theme)
    const chatIds = await getAllChatIds()

    if (chatIds.length === 0) {
      log(`[AutoPromo] No users to send promo to`)
      return
    }

    log(`[AutoPromo] Starting ${theme} broadcast (variation #${variationIndex + 1}) to ${chatIds.length} users`)

    const { BATCH_SIZE, DELAY_BETWEEN_BATCHES, DELAY_BETWEEN_MESSAGES } = BROADCAST_CONFIG
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (let i = 0; i < chatIds.length; i += BATCH_SIZE) {
      const batch = chatIds.slice(i, i + BATCH_SIZE)

      const batchPromises = batch.map(async (chatId, index) => {
        await sleep(index * DELAY_BETWEEN_MESSAGES)
        return sendPromoToUser(chatId, theme, variationIndex)
      })

      const results = await Promise.allSettled(batchPromises)

      for (const result of results) {
        if (result.status === 'fulfilled') {
          if (result.value?.skipped) skippedCount++
          else if (result.value?.success) successCount++
          else errorCount++
        } else {
          errorCount++
        }
      }

      // Delay between batches
      if (i + BATCH_SIZE < chatIds.length) {
        await sleep(DELAY_BETWEEN_BATCHES)
      }
    }

    // Log results
    const stats = {
      theme,
      variation: variationIndex + 1,
      total: chatIds.length,
      success: successCount,
      errors: errorCount,
      skipped: skippedCount,
      timestamp: new Date().toISOString()
    }

    log(`[AutoPromo] Broadcast complete:`, JSON.stringify(stats))

    // Save stats to DB
    await db.collection('promoStats').insertOne(stats)
  }

  // Schedule 3 daily promo broadcasts
  SCHEDULE_TIMES.forEach((time, themeIndex) => {
    const cronExpr = `${time.minute} ${time.hour} * * *`
    schedule.scheduleJob(cronExpr, () => {
      log(`[AutoPromo] Triggered scheduled promo: ${THEMES[themeIndex]} at ${time.hour}:${String(time.minute).padStart(2, '0')} UTC`)
      broadcastPromo(themeIndex).catch(err => {
        log(`[AutoPromo] Broadcast error: ${err.message}`)
      })
    })
    log(`[AutoPromo] Scheduled ${THEMES[themeIndex]} promo at ${time.hour}:${String(time.minute).padStart(2, '0')} UTC daily`)
  })

  log(`[AutoPromo] Auto-promo system initialized with ${THEMES.length} daily broadcasts`)

  // Return control functions for admin/command usage
  return {
    setOptOut,
    isOptedOut,
    broadcastPromo,
    getPromoMessages: () => promoMessages,
    getThemes: () => THEMES,
  }
}

module.exports = { initAutoPromo, promoMessages }
