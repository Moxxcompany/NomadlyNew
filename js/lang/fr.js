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
  viewAnalytics: '📊 Voir les statistiques',
  viewUsers: '👀 Voir les utilisateurs',
  blockUser: '✋ Bloquer l’utilisateur',
  unblockUser: '👌 Débloquer l’utilisateur',
  messageUsers: '👋 Envoyer un message à tous les utilisateurs',
}

const user = {
  // main keyboards
  cPanelWebHostingPlans: "Plans d'hébergement cPanel en Russie 🔒",
  pleskWebHostingPlans: "Plans d'hébergement Plesk en Russie 🔒",
  joinChannel: '📢 Rejoindre le canal',
  phoneNumberLeads: '🎯 Leads Ciblés & Validation',
  hostingDomainsRedirect: '🌐 Hébergement Offshore',
  cloudPhone: '📞 CloudPhone ˢᵖᵉᵉᶜʰᶜᵘᵉ',
  wallet: '👛 Mon portefeuille',
  urlShortenerMain: `🔗✂️ Raccourcisseur d'URL - ${FREE_LINKS} Essais`,
  vpsPlans: 'Acheter un VPS Bulletproof🛡️ - Horaire/Mensuel',
  buyPlan: '🔔 Souscrire ici',
  domainNames: '🌐 Enregistrer des noms de domaine - ❌ DMCA',
  viewPlan: '📋 Mes Abonnements',
  becomeReseller: '💼 Devenir revendeur',
  getSupport: "💬 Obtenir de l'aide",
  freeTrialAvailable: '📧🆓 SMS en masse - Essai gratuit',
  changeSetting: '🌍 Modifier les paramètres',

  // Sub Menu 1: urlShortenerMain
  redSelectUrl: '🔀✂️ Rediriger et raccourcir',
  redBitly: '✂️ Bit.ly',
  redShortit: '✂️ Shortit (Essai)',
  urlShortener: '✂️🌐 Raccourcisseur de domaine personnalisé',
  viewShortLinks: '📊 Voir les analyses des raccourcis',

  // Sub Menu 2: domainNames
  buyDomainName: '🛒🌐 Acheter des noms de domaine',
  viewDomainNames: '📂 Mes noms de domaine',
  dnsManagement: '🔧 Gestion DNS',

  // Sub Menu 3: cPanel/Plesk WebHostingPlansMain
  freeTrial: '💡 Essai gratuit',
  starterPlan: '🔼 Plan de démarrage',
  proPlan: '🔷 Plan Pro',
  businessPlan: '👑 Plan Business',
  contactSupport: '📞 Contacter le support',

  // Sub Menu 4: VPS Plans
  buyVpsPlan: '⚙️ Créer un nouveau VPS',
  manageVpsPlan: '🖥️ Afficher/Gérer le VPS',
  manageVpsSSH: '🔑 Clés SSH',

  // Free Trial
  freeTrialMenuButton: '🚀 Essai gratuit (12 heures)',
  getFreeTrialPlanNow: "🛒 Obtenir le plan d'essai maintenant",
  continueWithDomainNameSBS: websiteName => `➡️ Continuer avec ${websiteName}`,
  searchAnotherDomain: '🔍 Rechercher un autre domaine',
  privHostNS: '🏢 PrivHost (Hébergement rapide et sécurisé)',
  cloudflareNS: '🛡️ Bouclier Cloudflare (Sécurité et discrétion)',
  backToFreeTrial: "⬅️ Retour à l'essai gratuit",

  // Paid Plans
  buyStarterPlan: '🛒 Acheter le plan de démarrage',
  buyProPlan: '🛒 Acheter le plan Pro',
  buyBusinessPlan: '🛒 Acheter le plan Business',
  viewStarterPlan: '🔷 Voir le plan de démarrage',
  viewProPlan: '🔼 Voir le plan Pro',
  viewBusinessPlan: '👑 Voir le plan Business',
  backToHostingPlans: "⬅️ Retour aux plans d'hébergement",
  registerANewDomain: '🌐 Enregistrer un nouveau domaine',
  useExistingDomain: '🔄 Utiliser un domaine existant',
  backToStarterPlanDetails: '⬅️ Retour aux détails du plan de démarrage',
  backToProPlanDetails: '⬅️ Retour aux détails du plan Pro',
  backToBusinessPlanDetails: '⬅️ Retour aux détails du plan Business',
  continueWithDomain: websiteName => `➡️ Continuer avec ${websiteName}`,
  enterAnotherDomain: '🔍 Entrer un autre domaine',
  backToPurchaseOptions: "⬅️ Retour aux options d'achat",
}

const u = {
  // other key boards
  deposit: '➕💵 Dépôt',
  withdraw: '➖💵 Retirer',

  // wallet
  usd: 'USD',
  ngn: 'NGN',
}
const view = num => Number(num).toFixed(2)
const yesNo = ['Oui', 'Non']

const bal = (usd, ngn) =>
  HIDE_BANK_PAYMENT !== 'true'
    ? `$${view(usd)}
₦${view(ngn)}`
    : `$${view(usd)}`

const dnsEntryFormat = `Format d'enregistrement :
        •       Enregistrement A (Obligatoire pour un site web) / CNAME (Optionnel, ne peut pas coexister avec un enregistrement A)
        •       Nom d'hôte : Sous-domaine (ex. : auth) ou '@' pour la racine (Optionnel)
        •       Valeur : Adresse IP pour A / Nom d'hôte pour CNAME

Veuillez saisir votre enregistrement en utilisant le format fourni ci-dessous :

Exemples :
✅ Enregistrement A : A pay 192.0.2.1 (ou A 192.0.2.1 si aucun nom d'hôte)
✅ Enregistrement CNAME : CNAME pay 0oaawzt7.up.railway.app (ou CNAME 0oaawzt7.up.railway.app si aucun nom d'hôte)`

const t = {
  yes: 'Oui',
  no: 'Non',
  back: 'Retour',
  cancel: 'Annuler',
  skip: 'Ignorer',
  becomeReseller: `Bonjour,

Je vous contacte pour vous offrir une opportunité fantastique de devenir revendeur du puissant logiciel de marketing par SMS et d'hébergement de ${CHAT_BOT_BRAND}Bot.

Détails clés :

Partage des bénéfices : Gagnez une commission compétitive de 65/35 % sur chaque vente.

Frais d'installation : Contactez le support pour plus de détails.

Intéressé ? Appuyez sur 💬 Obtenir de l'aide pour en savoir plus sur ce partenariat lucratif.

Dans l'attente d'une éventuelle collaboration avec vous !

Cordialement,

L'équipe ${CHAT_BOT_BRAND}
`,
  resetLoginAdmit: `${CHAT_BOT_BRAND} SMS: You have been successfully logged out of your previous device.Please login now`,
  resetLoginDeny: 'Ok sure. No further action required.',
  resetLogin: `${CHAT_BOT_BRAND}SMS: Are you trying to log out of your previous device?`,
  select: `Veuillez sélectionner une option :`,
  urlShortenerSelect: `Raccourcir, personnaliser ou suivre vos liens :`,
  selectPlan: `Veuillez sélectionner un plan :`,
  backButton: '⬅️ Retour',
  yesProceedWithThisEmail: email => `➡️ Continuer avec ${email}`,
  proceedWithPayment: '➡️ Continuer avec le paiement',
  iHaveSentThePayment: `J'ai envoyé le paiement ✅`,
  trialAlreadyUsed: `Vous avez déjà utilisé votre essai gratuit. Si vous avez besoin de plus d'accès, veuillez envisager de souscrire à l'un de nos plans payants.`,
  oneHourLeftToExpireTrialPlan: `Votre plan Freedom expirera dans 1 heure. Si vous souhaitez continuer à utiliser nos services, envisagez de passer à un plan payant !`,
  freePlanExpired: `🚫 Votre plan Freedom a expiré. Nous espérons que vous avez apprécié votre essai. Pour continuer à utiliser nos services, veuillez acheter l'un de nos plans premium.`,
  freeTrialPlanSelected: hostingType => `
- Essayez notre <b>Plan Freedom</b> gratuitement ! Ce plan comprend un domaine gratuit se terminant par .sbs et sera actif pendant 12 heures.

🚀 <b>Plan Freedom :</b>
<b>- Stockage :</b> 1 Go SSD
<b>- Bande passante :</b> 10 Go
<b>- Domaines :</b> 1 domaine gratuit .sbs
<b>- Comptes email :</b> 1 compte email
<b>- Bases de données :</b> 1 base de données MySQL
<b>- SSL gratuit :</b> Oui
<b>- Fonctionnalités ${hostingType} :</b> Accès complet à ${hostingType} pour gérer les fichiers, la base de données et les emails, etc.
<b>- Durée :</b> Actif pendant 12 heures
<b>- Idéal pour :</b> Tests et projets de courte durée.
`,

  getFreeTrialPlan: `Veuillez entrer le nom de domaine souhaité (par exemple, example.sbs) et l'envoyer en tant que message. Ce domaine se terminera par .sbs et est gratuit avec votre plan d'essai.`,
  trialPlanContinueWithDomainNameSBSMatched: websiteName => `Le domaine ${websiteName} est disponible !`,
  trialPlanSBSDomainNotMatched: `Le domaine que vous avez entré est introuvable. Veuillez vérifier le domaine ou en essayer un autre.`,
  trialPlanSBSDomainIsPremium: `Le domaine est à prix premium et uniquement disponible avec un plan payant. Veuillez rechercher un autre domaine.`,
  trialPlanGetNowInvalidDomain: `Veuillez entrer un nom de domaine valide qui se termine par '.sbs'. Le domaine devrait ressembler à 'example.sbs' et est gratuit avec votre plan d'essai.`,
  trialPlanNameserverSelection: websiteName =>
    `Veuillez sélectionner le fournisseur de serveur de noms que vous souhaitez utiliser pour ${websiteName}.`,
  trialPlanDomainNameMatched: `Veuillez fournir votre adresse e-mail pour créer votre compte et recevoir votre reçu.`,
  confirmEmailBeforeProceedingSBS: email =>
    `Êtes-vous sûr de vouloir continuer avec cet e-mail ${email} pour l'abonnement au Plan Freedom ?`,
  trialPlanInValidEmail: `Veuillez fournir une adresse e-mail valide.`,
  trialPlanActivationConfirmation: `Merci ! Votre plan d'essai gratuit sera activé sous peu. Veuillez noter que ce plan sera actif uniquement pendant 12 heures.`,
  trialPlanActivationInProgress: `Votre plan d'essai gratuit est en cours d'activation. Cela peut prendre quelques instants...`,
  what: `Cette option n'est pas disponible. Veuillez choisir parmi les boutons ci-dessous.`,
  whatNum: `Veuillez choisir un numéro valide.`,
  phoneGenTimeout: `Délai expiré.`,
  phoneGenNoGoodHits: `Veuillez appuyer sur 💬 Obtenir de l'aide ou sélectionner un autre indicatif régional.`,

  subscribeRCS: p =>
    `Abonné ! Désabonnez-vous à tout moment en cliquant sur le <a href="${SELF_URL}/unsubscribe?a=b&Phone=${p}">lien</a>.`,
  unsubscribeRCS: p =>
    `Vous êtes désabonné ! Pour vous abonner à nouveau, cliquez sur le <a href="${SELF_URL}/subscribe?a=b&Phone=${p}">lien</a>.`,
  argsErr: `dev : arguments incorrects envoyés`,
  showDepositNgnInfo:
    ngn => `Veuillez envoyer ${ngn} NGN en cliquant sur “Effectuer le paiement” ci-dessous. Une fois la transaction confirmée, vous serez rapidement notifié, et votre portefeuille sera mis à jour.

Cordialement,  
${CHAT_BOT_NAME}`,
  askEmail: `Veuillez fournir un e-mail pour la confirmation du paiement.`,
  askValidAmount: 'Veuillez fournir un montant valide.',
  askValidEmail: 'Veuillez fournir un e-mail valide.',
  askValidCrypto: 'Veuillez choisir une crypto-monnaie valide.',
  askValidPayOption: 'Veuillez choisir une option de paiement valide.',
  chooseSubscription:
    HIDE_SMS_APP === 'true'
      ? `<b>Élevez votre marque avec nos plans d'abonnement !</b>

- <b>Quotidien :</b> $${PRICE_DAILY} — ${DAILY_PLAN_FREE_DOMAINS} domaine gratuit ".sbs/.xyz" + ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()} validations gratuites de numéros USA + liens Shortit illimités.
- <b>Hebdomadaire :</b> $${PRICE_WEEKLY} — ${WEEKLY_PLAN_FREE_DOMAINS} domaines gratuits ".sbs/.xyz" + ${WEEKLY_PLAN_FREE_VALIDATIONS.toLocaleString()} validations gratuites de numéros USA + liens Shortit illimités.
- <b>Mensuel :</b> $${PRICE_MONTHLY} — ${MONTHLY_PLAN_FREE_DOMAINS} domaines gratuits ".sbs/.xyz" + ${MONTHLY_PLAN_FREE_VALIDATIONS.toLocaleString()} validations gratuites de numéros USA + liens Shortit illimités.

(Domaines gratuits exclusifs aux extensions ".sbs" et ".xyz".)`
      : `<b>Élevez votre marque avec nos plans d'abonnement !</b>

- <b>Quotidien :</b> $${PRICE_DAILY} — ${DAILY_PLAN_FREE_DOMAINS} domaine gratuit ".sbs/.xyz" + ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()} validations gratuites de numéros USA + liens Shortit illimités + SMS en masse illimités.
- <b>Hebdomadaire :</b> $${PRICE_WEEKLY} — ${WEEKLY_PLAN_FREE_DOMAINS} domaines gratuits ".sbs/.xyz" + ${WEEKLY_PLAN_FREE_VALIDATIONS.toLocaleString()} validations gratuites de numéros USA + liens Shortit illimités + SMS en masse illimités.
- <b>Mensuel :</b> $${PRICE_MONTHLY} — ${MONTHLY_PLAN_FREE_DOMAINS} domaines gratuits ".sbs/.xyz" + ${MONTHLY_PLAN_FREE_VALIDATIONS.toLocaleString()} validations gratuites de numéros USA + liens Shortit illimités + SMS en masse illimités.

(Domaines gratuits exclusifs aux extensions ".sbs" et ".xyz".)`,

  askCoupon: usd =>
    `Le prix est de $${usd}. Souhaitez-vous utiliser un code promo ? Si vous en avez un, veuillez l'entrer maintenant. Sinon, appuyez sur "Passer".`,
  planAskCoupon: `Souhaitez-vous utiliser un code promo ? Si vous en avez un, veuillez l'entrer maintenant. Sinon, appuyez sur "Passer".`,
  enterCoupon: `Veuillez entrer un code promo :`,
  planPrice: (plan, price) =>
    `Le prix de l'abonnement ${plan} est de $${price}. Veuillez choisir une méthode de paiement.`,
  planNewPrice: (plan, price, newPrice) =>
    `Le prix de l'abonnement ${plan} est désormais $${view(
      newPrice,
    )} <s>($${price})</s>. Veuillez choisir une méthode de paiement.`,
  domainPrice: (domain, price) =>
    `Le prix du domaine ${domain} est de $${price} USD. Veuillez choisir une méthode de paiement.`,
  domainNewPrice: (domain, price, newPrice) =>
    `Le prix du domaine ${domain} est désormais $${view(
      newPrice,
    )} <s>($${price})</s>. Veuillez choisir une méthode de paiement.`,
  couponInvalid: `Code promo invalide. Veuillez entrer un autre code promo :`,
  lowPrice: `Prix inférieur au minimum requis.`,
  freeTrialAvailable: `Votre essai gratuit BulkSMS est maintenant activé. Veuillez télécharger l'application Android ${SMS_APP_NAME} ici : ${SMS_APP_LINK}. Besoin de cartes E-sim ? Appuyez sur 💬 Obtenir de l'aide.`,
  freeTrialNotAvailable: `Vous avez déjà utilisé l'essai gratuit.`,
  planSubscribed:
    HIDE_SMS_APP === 'true'
      ? `Vous vous êtes abonné avec succès au plan {{plan}} ! Profitez de domaines ".sbs/.xyz" gratuits, de liens Shortit illimités et de validations de numéros USA gratuites. Besoin d'une carte E-sim ? Appuyez sur 💬 Obtenir de l'aide.`
      : `Vous vous êtes abonné avec succès au plan {{plan}} ! Profitez de domaines ".sbs/.xyz" gratuits, de liens Shortit illimités, de validations USA gratuites et de ${SMS_APP_NAME}. Téléchargez l'application ici : ${SMS_APP_LINK}. Besoin d'une carte E-sim ? Appuyez sur 💬 Obtenir de l'aide.`,
  alreadySubscribedPlan: days => `Votre abonnement est actif et expire dans ${days} jours.`,
  payError: `Session de paiement introuvable. Veuillez réessayer ou appuyer sur 💬 Obtenir de l'aide. Découvrez plus sur ${TG_HANDLE}.`,
  chooseFreeDomainText: `<b>Bonne nouvelle !</b> Ce domaine est disponible gratuitement avec votre abonnement. Souhaitez-vous le réclamer ?`,

  chooseDomainToBuy: text =>
    `<b>Réclamez votre coin du web !</b> Veuillez partager le nom de domaine que vous souhaitez acheter, par exemple "abcpay.com". ${text}`,
  askDomainToUseWithShortener: `Souhaitez-vous utiliser ce domaine avec le raccourcisseur ?`,
  blockUser: `Veuillez partager le nom d'utilisateur de l'utilisateur à bloquer.`,
  unblockUser: `Veuillez partager le nom d'utilisateur de l'utilisateur à débloquer.`,
  blockedUser: `Vous êtes actuellement bloqué d'utiliser le bot. Veuillez appuyer sur 💬 Obtenir de l'aide. Découvrez plus ${TG_HANDLE}.`,
  greet: `${CHAT_BOT_BRAND} — raccourcissez vos URLs, enregistrez des domaines, achetez des leads et developpez votre activite. Directement depuis Telegram.
Commencez avec ${FREE_LINKS} liens Shortit d'essai — /start
Support: Appuyez sur 💬 Obtenir de l'aide`,
  linkExpired: `Votre essai ${CHAT_BOT_BRAND} a pris fin et votre lien raccourci est désactivé. Nous vous invitons à vous abonner pour maintenir l'accès à notre service d'URL et aux noms de domaine gratuits. Choisissez un plan approprié et suivez les instructions pour vous abonner. Veuillez nous contacter pour toute question.
Cordialement,
L'équipe ${CHAT_BOT_BRAND}
Découvrez plus : ${TG_CHANNEL}`,
  successPayment: `Paiement traité avec succès ! Vous pouvez maintenant fermer cette fenêtre.`,
  welcome: `Merci d'avoir choisi ${CHAT_BOT_NAME} ! Veuillez choisir une option ci-dessous :`,
  welcomeFreeTrial: `Bienvenue sur ${CHAT_BOT_BRAND} ! Vous avez ${FREE_LINKS} liens Shortit d'essai pour raccourcir vos URLs. Abonnez-vous pour des liens Shortit illimites, des domaines ".sbs/.xyz" gratuits et des validations de numeros USA gratuites. Decouvrez la difference ${CHAT_BOT_BRAND} !`,
  unknownCommand: `Commande introuvable. Appuyez sur /start ou veuillez appuyer sur 💬 Obtenir de l'aide. Découvrez plus ${TG_HANDLE}.`,
  support: `Veuillez appuyer sur 💬 Obtenir de l'aide. Découvrez plus ${TG_HANDLE}.`,
  joinChannel: `Veuillez rejoindre la chaîne ${TG_CHANNEL}.`,
  dnsPropagated: `La propagation DNS pour {{domain}} est terminée pour un raccourcissement d'URL illimité.`,
  dnsNotPropagated: `La propagation DNS pour {{domain}} est en cours et vous serez mis à jour une fois terminée. ✅`,
  domainBoughtSuccess: domain => `Le domaine ${domain} est maintenant à vous. Merci de nous avoir choisi.

Cordialement,
${CHAT_BOT_NAME}`,

  domainBought: `Votre domaine {{domain}} est désormais lié à votre compte tandis que la propagation DNS est en cours. Vous serez mis à jour automatiquement très bientôt.🚀`,
  domainLinking: domain =>
    `Lien du domaine avec votre compte. Veuillez noter que la mise à jour DNS peut prendre jusqu'à 30 minutes. Vous pouvez vérifier le statut de votre mise à jour DNS ici : https://www.whatsmydns.net/#A/${domain}`,
  errorSavingDomain: `Erreur lors de l'enregistrement du domaine sur le serveur, veuillez appuyer sur 💬 Obtenir de l'aide. Découvrez plus ${TG_HANDLE}.`,
  chooseDomainToManage: `Veuillez sélectionner un domaine si vous souhaitez gérer ses paramètres DNS.`,
  chooseDomainWithShortener: `Veuillez sélectionner ou acheter le nom de domaine que vous souhaitez relier à votre lien raccourci.`,
  viewDnsRecords: (records, domain) => `Voici les enregistrements DNS pour ${domain}

Enregistrements A (Optionnels, mais requis pour le mappage direct de l'IP)
${
  records.A && records.A.length
    ? records.A.map(
        record => `<strong>${record.index}. Enregistrement A</strong>
  • Nom d’hôte : ${record.recordName}
  • Valeur de l’enregistrement A : ${record.recordContent ? record.recordContent : 'Aucune'}`,
      ).join('\n')
    : '  • Enregistrement A : AUCUN'
}

Enregistrements NS (Obligatoires – Requis pour la résolution de domaine)
${
  records.NS && records.NS.length
    ? records.NS.map(
        record => `<strong>${record.index}. Enregistrement NS${record.nsId}</strong> ${record.recordContent}`,
      ).join('\n\n')
    : '  • Enregistrement NS : AUCUN'
}

Enregistrements CNAME (Optionnels, mais requis pour l’alias d’un autre domaine au lieu d’un enregistrement A)
${
  records.CNAME && records.CNAME.length
    ? records.CNAME.map(
        record => `<strong>${record.index}. Enregistrement CNAME</strong>
  • Nom d’hôte : ${record.recordName}
  • Valeur de l’enregistrement CNAME : ${record.recordContent ? record.recordContent : 'Aucune'}`,
      ).join('\n')
    : '  • Enregistrement CNAME : AUCUN'
}`,

  addDns: `Ajouter un enregistrement DNS`,
  updateDns: `Mettre à jour un enregistrement DNS`,
  deleteDns: `Supprimer un enregistrement DNS`,
  addDnsTxt: `Veuillez sélectionner le type d'enregistrement que vous souhaitez ajouter :`,
  updateDnsTxt: `Veuillez indiquer l'identifiant de l'enregistrement que vous souhaitez mettre à jour. i.e 3`,
  deleteDnsTxt: `Veuillez indiquer l'identifiant de l'enregistrement que vous souhaitez supprimer. i.e 3`,
  confirmDeleteDnsTxt: `Êtes-vous sûr ? Oui ou Non`,
  a: `Enregistrement A`,
  cname: `Enregistrement CNAME`,
  ns: `Enregistrement NS`,
  'Enregistrement A': `A`,
  'Enregistrement CNAME': `CNAME`,
  'Enregistrement NS': `NS`,
  askDnsContent: {
    A: dnsEntryFormat,
    'Enregistrement A': dnsEntryFormat,
    CNAME: dnsEntryFormat,
    'Enregistrement CNAME': dnsEntryFormat,
    NS: `Veuillez entrer votre enregistrement NS. i.e., dell.ns.cloudflare.com. Un nouvel enregistrement NS sera ajouté aux existants.`,
    'Enregistrement NS': `Veuillez entrer votre enregistrement NS. i.e., dell.ns.cloudflare.com .Si les N1-N4 existent déjà, veuillez mettre à jour l'enregistrement à la place`,
  },
  askUpdateDnsContent: {
    A: dnsEntryFormat,
    'Enregistrement A': dnsEntryFormat,
    CNAME: dnsEntryFormat,
    'Enregistrement CNAME': dnsEntryFormat,
    NS: `Un nouvel enregistrement NS sera mis à jour pour l'identifiant sélectionné. Pour ajouter un nouvel enregistrement, veuillez choisir "Ajouter un enregistrement DNS"`,
    'Enregistrement NS': `Un nouvel enregistrement NS sera mis à jour pour l'identifiant sélectionné. Pour ajouter un nouvel enregistrement, veuillez choisir "Ajouter un enregistrement DNS"`,
  },
  dnsRecordSaved: `Enregistrement ajouté`,
  dnsRecordDeleted: `Enregistrement supprimé`,
  dnsRecordUpdated: `Enregistrement mis à jour`,
  provideLink: `Veuillez fournir une URL valide. ex https://google.com`,
  comingSoonWithdraw: `Les retraits ne sont pas encore disponibles. Besoin d'aide ? Appuyez sur 💬 Obtenir de l'aide.`,
  promoOptOut: `Vous avez été désabonné des messages promotionnels. Tapez /start_promos pour vous réabonner à tout moment.`,
  promoOptIn: `Vous êtes de nouveau abonné aux messages promotionnels. Vous recevrez nos dernières offres et promotions !`,
  selectCurrencyToDeposit: `Veuillez sélectionner la devise à déposer`,
  depositNGN: `Veuillez entrer le montant NGN :`,
  askEmailForNGN: `Veuillez fournir un email pour la confirmation du paiement`,
  depositUSD: `Veuillez entrer le montant USD, notez que la valeur minimum est de 10 USD :`,
  selectCryptoToDeposit: `Veuillez choisir une cryptomonnaie :`,
  'bank-pay-plan': (priceNGN, plan) =>
    `Veuillez envoyer ${priceNGN} NGN en cliquant sur "Faire le paiement" ci-dessous. Une fois la transaction confirmée, vous serez notifié immédiatement et votre plan ${plan} sera activé sans encombre.

Cordialement,
${CHAT_BOT_NAME}`,
  bankPayDomain: (priceNGN, domain) =>
    `Veuillez envoyer ${priceNGN} NGN en cliquant sur "Faire le paiement" ci-dessous. Une fois la transaction confirmée, vous serez notifié immédiatement et votre domaine ${domain} sera activé sans encombre.

Cordialement,
${CHAT_BOT_NAME}`,
  showDepositCryptoInfoPlan: (priceCrypto, tickerView, address, plan) =>
    `Veuillez envoyer ${priceCrypto} ${tickerView} à\n\n<code>${address}</code>

Veuillez noter que les transactions cryptographiques peuvent prendre jusqu'à 30 minutes pour être complétées. Une fois la transaction confirmée, vous serez notifié immédiatement et votre plan ${plan} sera activé sans encombre.

Cordialement,
${CHAT_BOT_NAME}`,
  showDepositCryptoInfoDomain: (priceCrypto, tickerView, address, domain) =>
    `Veuillez envoyer ${priceCrypto} ${tickerView} à\n\n<code>${address}</code>

Veuillez noter que les transactions cryptographiques peuvent prendre jusqu'à 30 minutes pour être complétées. Une fois la transaction confirmée, vous serez notifié immédiatement et votre domaine ${domain} sera activé sans encombre.

Cordialement,
${CHAT_BOT_NAME}`,

  showDepositCryptoInfo: (priceCrypto, tickerView, address) =>
    `Veuillez envoyer ${priceCrypto} ${tickerView} à\n\n<code>${address}</code>\n\nVeuillez noter que les transactions cryptographiques peuvent prendre jusqu'à 30 minutes pour être confirmées. Une fois la transaction confirmée, vous serez notifié rapidement et votre portefeuille sera mis à jour.\n\nCordialement,\n${CHAT_BOT_NAME}`,

  confirmationDepositMoney: (amount, usd) =>
    `Votre paiement de ${amount} ($${usd}) a été traité. Merci de nous avoir choisi.\nCordialement,\n${CHAT_BOT_NAME}`,

  showWallet: (usd, ngn) => `Solde du portefeuille :\n\n${bal(usd, ngn)}`,

  wallet: (usd, ngn) => `Solde du portefeuille :\n\n${bal(usd, ngn)}\n\nSélectionnez l'option du portefeuille :`,

  walletSelectCurrency: (usd, ngn) =>
    `Veuillez sélectionner la devise pour payer à partir de votre solde de portefeuille :\n\n${bal(usd, ngn)}`,

  walletBalanceLow: `Votre solde est insuffisant. Appuyez sur "👛 Mon portefeuille" → "➕💵 Déposer" pour recharger.`,

  sentLessMoney: (expected, got) =>
    `Vous avez envoyé moins d'argent que prévu, donc nous avons crédité le montant reçu dans votre portefeuille. Nous attendions ${expected} mais nous avons reçu ${got}`,

  sentMoreMoney: (expected, got) =>
    `Vous avez envoyé plus d'argent que prévu, donc nous avons crédité le montant supplémentaire dans votre portefeuille. Nous attendions ${expected} mais nous avons reçu ${got}`,

  buyLeadsError: `Malheureusement, le code régional sélectionné est indisponible et votre portefeuille n'a pas été facturé`,
  buyLeadsProgress: (i, total) => `${((i * 100) / total).toFixed()}% de leads téléchargés. Veuillez patienter.`,

  phoneNumberLeads: `Obtenez des leads premium vérifiés par cible ou validez vos propres numéros :`,

  buyLeadsSelectCountry: `Veuillez sélectionner un pays`,
  buyLeadsSelectSmsVoice: `Veuillez sélectionner SMS / Voix`,
  buyLeadsSelectArea: `Veuillez sélectionner une zone`,
  buyLeadsSelectAreaCode: `Veuillez sélectionner un code régional`,
  buyLeadsSelectCarrier: `Veuillez sélectionner un opérateur`,
  buyLeadsSelectCnam: `Voulez-vous rechercher le nom du propriétaire ? CNAME coûte 15 $ supplémentaires par 1000 leads`,
  buyLeadsSelectAmount: (min, max) =>
    `Combien de leads souhaitez-vous acheter ? Sélectionnez ou saisissez un nombre. Le minimum est de ${min} et le maximum est de ${max}`,

  buyLeadsSelectFormat: `Choisissez le format, par exemple Local (212) ou International (+1212)`,

  buyLeadsSuccess: n => `Félicitations, vos ${n} leads ont été téléchargés.`,

  buyLeadsNewPrice: (leads, price, newPrice) =>
    `Le prix des ${leads} leads est maintenant de $${view(newPrice)} <s>($${price})</s>`,
  buyLeadsPrice: (leads, price) => `Le prix des ${leads} leads est de $${price}.`,

  confirmNgn: (usd, ngn) => `${usd} USD ≈ ${ngn} NGN `,

  walletSelectCurrencyConfirm: `Confirmer ?`,

  validatorSelectCountry: `Veuillez sélectionner un pays`,
  validatorPhoneNumber: `Veuillez coller vos numéros ou télécharger un fichier incluant le code du pays.`,
  validatorSelectSmsVoice: n =>
    `${n} numéros de téléphone trouvés. Veuillez choisir l'option pour la validation des leads par SMS ou appel vocal.`,
  validatorSelectCarrier: `Veuillez sélectionner un opérateur`,
  validatorSelectCnam: `Voulez-vous rechercher le nom du propriétaire ? CNAME coûte 15 $ supplémentaires par 1000 leads`,
  validatorSelectAmount: (min, max) =>
    `Combien de numéros souhaitez-vous valider ? Sélectionnez ou saisissez un nombre. Le minimum est de ${min} et le maximum est de ${max}`,

  validatorSelectFormat: `Choisissez le format, par exemple Local (212) ou International (+1212)`,

  validatorSuccess: (n, m) => `${n} leads sont validés. ${m} numéros de téléphone valides trouvés.`,
  validatorProgress: (i, total) => `${((i * 100) / total).toFixed()}% de leads validés. Veuillez patienter.`,
  validatorProgressFull: (i, total) => `${((i * 100) / total).toFixed()}% de leads validés.`,

  validatorError: `Malheureusement, les numéros de téléphone sélectionnés sont indisponibles et votre portefeuille n'a pas été facturé`,
  validatorErrorFileData: `Numéro de téléphone de pays invalide trouvé. Veuillez télécharger le numéro de téléphone pour le pays sélectionné`,
  validatorErrorNoPhonesFound: `Aucun numéro de téléphone trouvé. Réessayez.`,

  validatorBulkNumbersStart: `La validation des leads a commencé et sera bientôt terminée.`,

  // url re-director
  redSelectUrl: `Veuillez partager l'URL que vous souhaitez raccourcir et analyser. ex : https://cnn.com`,
  redSelectRandomCustom: `Veuillez sélectionner votre choix pour un lien aléatoire ou personnalisé`,
  redSelectProvider: `Choisissez le fournisseur de lien`,
  redSelectCustomExt: `Entrez le suffixe personnalisé`,

  redValidUrl: `Veuillez fournir une URL valide. ex : https://google.com`,
  redTakeUrl: url => `Votre URL raccourcie est : ${url}`,
  redIssueUrlBitly: `Le raccourcissement a échoué. Votre portefeuille n'a pas été débité. Réessayez ou appuyez sur 💬 Obtenir de l'aide.`,
  redIssueSlugCuttly: `Le nom de lien préféré est déjà pris, essayez un autre.`,
  redIssueUrlCuttly: `Le raccourcissement a échoué. Réessayez ou appuyez sur 💬 Obtenir de l'aide.`,
  freeLinksExhausted: `Vous avez utilisé vos ${FREE_LINKS} liens Shortit d'essai ! Abonnez-vous pour obtenir des liens Shortit illimités, des domaines ".sbs/.xyz" gratuits et plus encore. Appuyez sur "🔔 S'abonner" pour choisir un plan.`,
  linksRemaining: (count, total) => `Il vous reste ${count} sur ${total || FREE_LINKS} lien${count !== 1 ? 's' : ''} Shortit d'essai.`,
  redNewPrice: (price, newPrice) =>
    `Le prix est maintenant de $${view(newPrice)} <s>($${price})</s>. Veuillez choisir la méthode de paiement.`,
  customLink: 'Lien personnalisé',
  randomLink: 'Lien aléatoire',
  askShortLinkExtension: 'Veuillez nous indiquer votre extension de lien court préférée : par exemple payer',
  linkAlreadyExist: `Le lien existe déjà. Veuillez taper 'ok' pour essayer un autre.`,
  yourShortendUrl: shortUrl => `Votre URL raccourcie est : ${shortUrl}`,

  availablefreeDomain: (plan, available, s) =>
    `Rappelez-vous, votre plan ${plan} comprend ${available} domaine ".sbs/.xyz" gratuit${s}. Obtenez votre domaine dès aujourd'hui !`,
  shortenedUrlLink: `Veuillez partager l'URL que vous souhaitez raccourcir et analyser. e.g https://cnn.com`,
  selectedTrialPlan: `Vous avez sélectionné le plan d'essai gratuit`,
  userPressedBtn: message => `L'utilisateur a appuyé sur le bouton ${message}.`,
  userToBlock: userToBlock => `L'utilisateur ${userToBlock} n'a pas été trouvé.`,
  userBlocked: userToBlock => `L'utilisateur ${userToBlock} a été bloqué.`,
  checkingDomainAvail: `Vérification de la disponibilité du domaine...`,
  checkingExistingDomainAvail: `Vérification de la disponibilité du domaine existant...`,
  subscribeFirst: `📋 Abonnez-vous d'abord`,
  freeValidationUsed: (amount, remaining) => `${amount} numéros USA validés avec votre abonnement ! Validations gratuites restantes : ${remaining.toLocaleString()}.`,
  partialFreeValidation: (freeAmount, totalAmount, paidAmount, paidPrice) => `Il vous reste ${freeAmount.toLocaleString()} validations gratuites. Votre demande porte sur ${totalAmount.toLocaleString()} numéros.\n\n${freeAmount.toLocaleString()} seront couverts gratuitement, et les ${paidAmount.toLocaleString()} restants coûteront $${paidPrice}. Veuillez procéder au paiement ci-dessous.`,
  notValidHalf: `Entrez une partie arrière valide`,
  linkAlreadyExist: `Le lien existe déjà. Veuillez en essayer un autre.`,
  issueGettingPrice: `Problème pour obtenir le prix`,
  domainInvalid: `Le nom de domaine est invalide. Veuillez en essayer un autre. Utilisez le format abcpay.com`,
  chooseValidPlan: `Veuillez choisir un plan valide`,
  noDomainFound: `Aucun nom de domaine trouvé`,
  chooseValidDomain: `Veuillez choisir un domaine valide`,
  errorDeletingDns: error =>
    `Erreur lors de la suppression de l'enregistrement DNS, ${error}, Veuillez fournir à nouveau la valeur`,
  selectValidOption: `sélectionnez une option valide`,
  maxDnsRecord: `Un maximum de 4 enregistrements NS peut être ajouté, vous pouvez mettre à jour ou supprimer les enregistrements NS précédents`,
  errorSavingDns: error =>
    `Erreur lors de la sauvegarde de l'enregistrement DNS, ${error}, Veuillez fournir à nouveau la valeur`,
  fileError: `Erreur lors du traitement du fichier.`,
  ammountIncorrect: `Montant incorrect`,
  subscriptionExpire: (subscribedPlan, timeEnd) => `Votre abonnement ${subscribedPlan} est expiré le ${timeEnd}`,
  plansSubscripedtill: (subscribedPlan, timeEnd) =>
    `Vous êtes actuellement abonné au plan ${subscribedPlan}. Votre plan est valide jusqu'au ${timeEnd}`,
  planNotSubscriped: `Vous n'êtes actuellement abonné à aucun plan.`,
  noShortenedUrlLink: `Vous n'avez encore aucun lien raccourci.`,
  shortenedLinkText: linksText => `Voici vos liens raccourcis :\n${linksText}`,
  qrCodeText: `Voici votre code QR !`,
  scanQrOrUseChat: chatId =>
    `Scannez le QR avec l'application de marketing SMS pour vous connecter. Vous pouvez également utiliser ce code pour vous connecter : ${chatId}`,
  domainPurchasedFailed: (domain, buyDomainError) =>
    `Échec de l'achat du domaine, essayez un autre nom. ${domain} ${buyDomainError}`,
  noDomainRegistered: `Vous n'avez pas encore acheté de domaines.`,
  registeredDomainList: domainsText => `Voici vos domaines achetés :\n${domainsText}`,
  comingSoon: `Bientôt disponible`,
  goBackToCoupon: '❌ Retourner & Appliquer le Coupon',
  errorFetchingCryptoAddress:
    "Erreur lors de la récupération de l'adresse de la cryptomonnaie. Veuillez réessayer plus tard.",
  paymentSuccessFul:
    '✅ Paiement réussi ! Votre commande est en cours de traitement. Les détails seront disponibles sous peu.',

  // Renvoi d'appels (Cloud Phone)
  fwdInsufficientBalance: (walletBal, rate) => `🚫 <b>Impossible d'activer le renvoi d'appels</b>\n\n💳 Solde du portefeuille : <b>$${(walletBal || 0).toFixed(2)}</b>\n💰 Requis : <b>$${rate}/min</b> par appel transféré\n\n⚠️ Vous avez besoin d'un solde suffisant pour le renvoi d'appels. Sans fonds, les appels entrants NE seront PAS transférés.\n\n👉 Veuillez recharger votre portefeuille d'au moins <b>$25</b> (~${Math.floor(25 / rate)} min de renvoi) via 👛 Mon Portefeuille avant d'activer.`,
  fwdBlocked: (number) => `🚫 <b>Renvoi bloqué</b>\n\nLe numéro ${number} est une destination premium ou à coût élevé. Le renvoi d'appels vers ce numéro n'est pas disponible.\n\nVeuillez appuyer sur 💬 <b>Obtenir de l'aide</b> pour demander l'activation de cette destination.`,
  fwdNotRoutable: (number) => `⚠️ <b>Destination non joignable</b>\n\nLe numéro ${number} n'a pas pu être validé comme destination joignable.\n\nVeuillez vérifier le numéro et réessayer, ou appuyez sur 💬 <b>Obtenir de l'aide</b>.`,
  fwdValidating: '⏳ Validation de la destination de renvoi...',
  fwdEnterNumber: (rate, walletBal) => {
    let text = `Entrez le numéro de téléphone vers lequel transférer les appels.\nIncluez l'indicatif pays (ex: +14155551234) :\n\n💰 <b>Tarif : $${rate}/min</b> depuis le portefeuille.`
    if (walletBal !== undefined) {
      text += `\n💳 Portefeuille : <b>$${walletBal.toFixed(2)}</b>`
      if (walletBal < rate) text += `\n\n⚠️ <b>Solde insuffisant !</b> Veuillez recharger votre portefeuille (recommandé : <b>$25</b>) avant d'activer le renvoi.`
    }
    return text
  },
}

const phoneNumberLeads = ['🎯 Leads Premium Ciblés', '✅📲 Valider les leads téléphoniques']

const buyLeadsSelectCountry = Object.keys(areasOfCountry)
const buyLeadsSelectSmsVoice = ['SMS (Prix 20$ pour 1000)', 'Voix (Prix 0$ pour 1000)']
const buyLeadsSelectArea = country => Object.keys(areasOfCountry?.[country])
const buyLeadsSelectAreaCode = (country, area) => {
  const codes = areasOfCountry?.[country]?.[area].map(c => format(countryCodeOf[country], c))
  return codes.length > 1 ? ['Mixed Area Codes'].concat(codes) : codes
}
const _buyLeadsSelectAreaCode = (country, area) => areasOfCountry?.[country]?.[area]
const buyLeadsSelectCnam = yesNo
const buyLeadsSelectCarrier = country => carriersOf[country]
const buyLeadsSelectAmount = ['1000', '2000', '3000', '4000', '5000']
const buyLeadsSelectFormat = ['Format Local', 'Format International']

const validatorSelectCountry = Object.keys(areasOfCountry)
const validatorSelectSmsVoice = ['SMS (Prix 20$ pour 1000)', 'Voix (Prix 0$ pour 1000)']
const validatorSelectCarrier = country => carriersOf[country]
const validatorSelectCnam = yesNo
const validatorSelectAmount = ['ALL', '1000', '2000', '3000', '4000', '5000']
const validatorSelectFormat = ['Format Local', 'Format International']

const selectFormatOf = {
  'Format Local': 'Local Format',
  'Format International': 'International Format',
}

//redSelectRandomCustom

const redSelectRandomCustom = ['Lien court aléatoire']

const redSelectProvider = ['Bit.ly 10 $', `Shortit (Essai ${FREE_LINKS})`]

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
  BTC: '₿ Bitcoin (BTC)',
  LTC: 'Ł Litecoin (LTC)',
  DOGE: 'Ð Dogecoin (DOGE)',
  BCH: 'Ƀ Bitcoin Cash (BCH)',
  ETH: 'Ξ Ethereum (ETH)',
  TRON: '🌐 Tron (TRX)',
  'USDT (TRC20)': '₮ Tether (USDT - TRC20)',
  'USDT (ERC20)': '₮ Tether (USDT - ERC20)',
}

/////////////////////////////////////////////////////////////////////////////////////
const _bc = ['Retour', 'Annuler']

const payIn = {
  crypto: 'Crypto',
  ...(HIDE_BANK_PAYMENT !== 'true' && { bank: 'Banque ₦aira + Carte🏦💳' }),
  wallet: '👛 Portefeuille',
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
      [user.wallet, user.viewPlan],
      [user.buyPlan],
      HIDE_BECOME_RESELLER === 'true'
        ? [user.changeSetting, user.getSupport, user.joinChannel]
        : [user.changeSetting, user.becomeReseller, user.getSupport],
    ],
  },
  parse_mode: 'HTML',
  disable_web_page_preview: true,
}

const languages = {
  en: '🇬🇧 Anglais',
  fr: '🇫🇷 Français',
  zh: '🇨🇳 Chinois',
  hi: '🇮🇳 Hindi',
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
  continueAtHostbay: '🚀 Services déplacés vers @Hostbay_bot pour l\'hébergement, domaines, SMS et URLs.',
  redirectMessage: '🚀 Services déplacés vers @Hostbay_bot pour l\'hébergement, domaines, SMS et URLs.',
  askPreferredLanguage: `🌍 Pour garantir que tout est dans votre langue préférée, veuillez en sélectionner une ci-dessous :
  
  Vous pouvez toujours changer votre langue plus tard dans les paramètres.`,
  askValidLanguage: 'Veuillez choisir une langue valide :',
  welcomeMessage: `👋 Bienvenue sur le ${CHAT_BOT_NAME} !
  Nous sommes ravis de vous avoir ici ! 🎉
  Commençons afin que vous puissiez explorer toutes les fonctionnalités passionnantes que nous proposons. 🌟
  
  Ce setup est rapide et facile—plongeons dedans ! 🚀`,
  askUserEmail: 'Quel est votre email ? Personnalisons votre expérience ! (par exemple, davidsen@gmail.com)',
  processUserEmail: ` Merci 😊 Nous configurons votre compte maintenant.
  Veuillez patienter un instant pendant que nous finalisons les détails. ⏳
   
  Nous faisons le travail en arrière-plan. Suivez simplement les étapes !`,
  confirmUserEmail: `✨ Excellente nouvelle ! Votre compte est prêt ! 🎉💃🎉
  
  Profitez des fonctionnalités premium pendant votre période d'essai gratuite !`,
  termsAndCond: `📜 Avant de continuer, veuillez examiner et accepter nos conditions générales.`,
  acceptTermButton: '✅ Accepter',
  declineTermButton: '❌ Refuser',
  viewTermsAgainButton: '🔄 Revoir les termes',
  exitSetupButton: '❌ Quitter le setup',
  acceptedTermsMsg: `✅ Vous avez accepté avec succès les conditions générales ! 🎉
  Vous êtes prêt à commencer à utiliser ${CHAT_BOT_NAME}. Passons à la partie amusante ! 🎯`,
  declinedTermsMsg: `⚠️ Vous devez accepter les conditions générales pour continuer à utiliser ${CHAT_BOT_NAME}. 
  Veuillez les revoir quand vous serez prêt.`,
  userExitMsg: 'L’utilisateur a appuyé sur le bouton de sortie.',

  acceptTermMsg: `Veuillez accepter les conditions générales pour continuer à utiliser ${CHAT_BOT_NAME}`,
  termsAndCondMsg: `<h1>Conditions Générales pour ${CHAT_BOT_NAME}</h1>
        <p><strong>Date d’effet :</strong> 01/01/2022</p>
        <p>En utilisant ${CHAT_BOT_NAME}, vous acceptez ces Conditions Générales.</p>

        <h2>1. Acceptation des Conditions</h2>
        <p>Vous devez avoir 18 ans ou plus, ou avoir le consentement d’un tuteur, et accepter ces conditions ainsi que notre Politique de Confidentialité.</p>

        <h2>2. Services Fournis</h2>
        <p>Nous proposons l’enregistrement de domaines, l’hébergement web et le support pour la configuration de sites/applications.</p>

        <h2>3. Responsabilités de l’Utilisateur</h2>
        <p>Fournir des informations exactes, éviter les activités illégales et sécuriser votre compte Telegram.</p>

        <h2>4. Conditions de Paiement</h2>
        <p>Tous les paiements sont définitifs sauf indication contraire. Le non-paiement peut entraîner la suspension des services.</p>

        <h2>5. Limitations des Services</h2>
        <p>Nous pouvons imposer des limites de ressources ou subir des interruptions dues à la maintenance ou à des problèmes techniques.</p>

        <h2>6. Résiliation</h2>
        <p>Nous pouvons résilier les services en cas de violation ou de non-paiement. Les utilisateurs peuvent annuler à tout moment, mais les frais ne sont pas remboursables.</p>

        <h2>7. Responsabilité</h2>
        <p>Les services sont fournis « en l’état ». Nous ne sommes pas responsables des pertes de données, des pannes ou des violations de sécurité des utilisateurs.</p>

        <h2>8. Confidentialité</h2>
        <p>Nous gérons vos données conformément à notre Politique de Confidentialité et ne les partageons que si la loi l’exige.</p>

        <h2>9. Modifications des Conditions</h2>
        <p>Nous pouvons mettre à jour ces conditions, et l’utilisation continue implique votre acceptation.</p>

        <h2>10. Contact</h2>
        <p>Pour toute assistance, contactez-nous à <a href="${APP_SUPPORT_LINK}" target="_blank">${APP_SUPPORT_LINK}</a>.</p>

        <p>En utilisant ${CHAT_BOT_NAME}, vous acceptez ces conditions. Merci !</p>
`,
}

const termsAndConditionType = lang => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Voir les termes et conditions',
          web_app: {
            url: `${SELF_URL}/terms-condition?lang=${lang}`,
          },
        },
      ],
    ],
  },
})

const planOptions = ['Quotidien', 'Hebdomadaire', 'Mensuel']
const planOptionsOf = {
  Quotidien: 'Daily',
  Hebdomadaire: 'Weekly',
  Mensuel: 'Monthly',
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
          text: 'Effectuer le paiement',
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
      name: 'Forfait Starter',
      price: HOSTING_STARTER_PLAN_PRICE,
      duration: '30 jours',
      storage: '10 Go SSD',
      bandwidth: '100 Go',
      domains: 'Domaines illimités',
      emailAccounts: '5 comptes email',
      databases: '1 base de données MySQL',
      features: `Accès complet à ${hostingType} pour gérer les fichiers, bases de données, emails, etc.`,
      idealFor: 'Blogs personnels, sites web de petites entreprises ou portfolios.',
    },
    proPlan: {
      name: 'Forfait Pro',
      price: HOSTING_PRO_PLAN_PRICE,
      duration: '30 jours',
      storage: '50 Go SSD',
      bandwidth: '500 Go',
      domains: 'Domaines illimités',
      emailAccounts: '25 comptes email',
      databases: '10 bases de données MySQL',
      features: `Accès complet à ${hostingType} avec des outils avancés pour les sauvegardes, la sécurité et les analyses.`,
      additionalFeatures: 'Migration de site gratuite, sauvegardes quotidiennes.',
      idealFor: 'Sites web de petites et moyennes entreprises, sites de commerce électronique.',
    },
    businessPlan: {
      name: 'Forfait Business',
      price: HOSTING_BUSINESS_PLAN_PRICE,
      duration: '30 jours',
      storage: '100 Go SSD',
      bandwidth: 'Illimité',
      domains: 'Domaines illimités',
      emailAccounts: 'Comptes email illimités',
      databases: 'Bases de données MySQL illimitées',
      features: `Accès complet à ${hostingType} avec toutes les fonctionnalités avancées, y compris le support prioritaire.`,
      additionalFeatures:
        'Migration de site gratuite, sauvegardes quotidiennes, environnement de test, fonctionnalités de sécurité améliorées.',
      idealFor: 'Grandes entreprises, sites à fort trafic, et développeurs nécessitant plus de flexibilité.',
    },
  }
}
const hostingPlansText = {
  plans: plans,

  generatePlanText: (hostingType, planKey) => {
    const plan = plans(hostingType)[planKey]
    return `
    🚀 <b>${plan.name} : $${plan.price}</b>
    
    <b>- Durée :</b> ${plan.duration}
    <b>- Stockage :</b> ${plan.storage}
    <b>- Bande passante :</b> ${plan.bandwidth}
    <b>- Domaines :</b> ${plan.domains}
    <b>- Comptes email :</b> ${plan.emailAccounts}
    <b>- Bases de données :</b> ${plan.databases}
    <b>- SSL gratuit :</b> Oui
    <b>- Fonctionnalités ${hostingType} :</b> ${plan.features}
    ${plan.additionalFeatures ? `<b>- Fonctionnalités supplémentaires :</b> ${plan.additionalFeatures}` : ''}
    <b>- Idéal pour :</b> ${plan.idealFor}`
  },
  generatePlanStepText: step => {
    const commonSteps = {
      buyText: 'Excellent choix ! Avez-vous besoin d’un nouveau domaine ou souhaitez-vous en utiliser un existant ?',
      registerNewDomainText: 'Veuillez entrer le nom de domaine que vous souhaitez enregistrer (ex. : exemple.com).',
      domainNotFound: 'Le domaine que vous avez entré est introuvable. Veuillez vérifier ou essayer un autre.',
      useExistingDomainText: 'Veuillez entrer le nom de votre domaine existant (ex. : exemple.com).',
      useExistingDomainNotFound:
        'Le domaine que vous avez entré n’est pas associé à votre compte. Veuillez vérifier ou contacter le support.',
      enterYourEmail: 'Veuillez fournir votre adresse email pour créer votre compte et recevoir votre reçu.',
      invalidEmail: 'Veuillez fournir une adresse email valide.',
      paymentConfirmation: 'Veuillez confirmer la transaction pour continuer votre achat.',
      paymentSuccess: `Nous vérifions votre paiement. Vous serez informé dès que celui-ci sera confirmé. Merci de nous avoir choisi !`,
      paymentFailed: 'Le paiement a échoué. Veuillez réessayer.',
    }

    return `${commonSteps[step]}`
  },

  generateDomainFoundText: (websiteName, price) =>
    `Le domaine ${websiteName} est disponible ! Le coût est de $${price}.`,
  generateExistingDomainText: websiteName => `Vous avez sélectionné ${websiteName} comme votre domaine.`,
  domainNotFound: websiteName => `Le domaine ${websiteName} n'est pas disponible.`,
  nameserverSelectionText: websiteName =>
    `Veuillez sélectionner le fournisseur de serveur de noms que vous souhaitez utiliser pour ${websiteName}.`,
  confirmEmailBeforeProceeding: email => `Êtes-vous sûr de vouloir continuer avec cet email : ${email} ?`,

  generateInvoiceText: payload => `
<b>Enregistrement de domaine</b>
<b>- Domaine : </b> ${payload.domainName}
<b>- Prix : </b> $${payload?.existingDomain ? '0 (utilisation d’un domaine existant)' : payload.domainPrice}
  
<b>Hébergement Web</b>
<b>- Durée : </b> 1 mois
<b>- Prix : </b> $${payload.hostingPrice}
  
<b>Montant total dû :</b>
<b>- Réduction par coupon : </b> $${payload.couponDiscount}
<b>- USD : </b> $${payload?.couponApplied ? payload.newPrice : payload.totalPrice}
<b>- Taxe : </b> $0.00
  
<b>Conditions de paiement</b>
Ceci est une facture de prépaiement. Veuillez vous assurer que le paiement est effectué dans l'heure afin d'activer vos services de domaine et d'hébergement. Une fois le paiement reçu, nous procéderons à l'activation de votre service.
`,

  showCryptoPaymentInfo: (priceCrypto, tickerView, address, plan) => `
Veuillez transférer ${priceCrypto} ${tickerView} à l’adresse suivante :
  
<code>${address}</code>
  
Veuillez noter que les transactions en crypto-monnaie peuvent prendre jusqu'à 30 minutes pour être confirmées. Une fois la transaction confirmée, vous serez immédiatement notifié, et votre ${plan} sera activé en toute transparence.
  
Cordialement,
${CHAT_BOT_NAME}`,

  successText: (info, response) =>
    `Voici vos informations d'identification pour ${info.hostingType} pour ${info.plan} :

Domaine : ${info.website_name}
Nom d'utilisateur : ${response.username}
Email : ${info.email}
Mot de passe : ${response.password}
URL : ${response.url}

<b>Serveurs de noms</b>
- ${response.nameservers.ns1}
- ${response.nameservers.ns2}
  
Vos informations d'identification ${info.hostingType} ont été envoyées avec succès à votre email ${info.email}.`,

  support: (
    plan,
    statusCode,
  ) => `Quelque chose s'est mal passé lors de la configuration de votre ${plan} | ${statusCode}. 
                                              Veuillez appuyer sur 💬 Obtenir de l'aide.
                                              Découvrez plus sur ${TG_HANDLE}.`,

  bankPayDomain: (
    priceNGN,
    plan,
  ) => `Veuillez virer ${priceNGN} NGN en cliquant sur “Faire le paiement” ci-dessous. Une fois la transaction confirmée, vous serez immédiatement notifié, et votre ${plan} sera activé sans problème.

Cordialement,
${CHAT_BOT_NAME}`,
}

const vpsBC = ['🔙 Retour', 'Annuler']

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
  hourly: "À l'heure",
  monthly: 'Mensuel',
  quaterly: 'Trimestriel',
  annually: 'Annuel',
}

const vpsPlanOf = {
  "À l'heure": 'hourly',
  Mensuel: 'monthly',
  Trimestriel: 'quaterly',
  Annuel: 'annually',
}

const vpsPlanMenu = ["À l'heure", 'Mensuel', 'Trimestriel', 'Annuel']
const vpsConfigurationMenu = ['De base', 'Standard', 'Premium', 'Entreprise']
const vpsCpanelOptional = ['WHM', 'Plesk', '❌ Passer le panneau de contrôle']

const vp = {
  of: vpsOptionsOf,
  back: '🔙 Retour',
  skip: '❌ Passer',
  cancel: '❌ Annuler',

  askCountryForUser: `🌍 Choisissez la meilleure région pour des performances optimales et une faible latence.

💡 Moins de latence = Temps de réponse plus rapides. Choisissez une région proche de vos utilisateurs pour de meilleures performances.`,
  chooseValidCountry: 'Veuillez choisir un pays dans la liste :',
  askRegionForUser: country =>
    `📍 Sélectionnez un centre de données dans ${country} (Les prix peuvent varier selon l’emplacement.)`,
  chooseValidRegion: 'Veuillez choisir une région valide dans la liste :',
  askZoneForUser: region => `📍 Choisissez la zone dans ${region}.`,

  chooseValidZone: 'Veuillez choisir une zone valide dans la liste :',
  confirmZone: (region, zone) => `✅  Vous avez sélectionné ${region} (${zone}). Voulez-vous continuer avec ce choix ?`,
  failedFetchingData: 'Erreur lors de la récupération, veuillez réessayer dans quelques instants.',
  confirmBtn: `✅ Confirmer la sélection`,

  askVpsDiskType: list => `💾 Choisissez votre type de stockage en fonction des performances et du budget :

${list?.map(item => `• ${item.description}`).join('\n')}`,

  chooseValidDiskType: 'Veuillez choisir un type de disque valide',

  askPlanType: plans => `💳 Choisissez un cycle de facturation :

${plans
  .map(
    item =>
      `<strong>• ${item.type === 'Hourly' ? '⏳' : '📅'} ${item.type} –</strong> $${item.originalPrice} ${
        item.discount === 0 ? '(Aucune réduction)' : `(Inclut ${item.discount}% de réduction)`
      }`,
  )
  .join('\n')}`,
  planTypeMenu: vpsOptionsOf(vpsPlanMenu),
  hourlyBillingMessage: `⚠️ Un dépôt remboursable de $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD est requis pour la facturation horaire. Cela garantit un service ininterrompu et est remboursé s'il n'est pas utilisé.
  
✅ La facturation est déduite du solde de votre portefeuille chaque heure.
🔹 Les licences mensuelles (Windows/WHM/Plesk) sont facturées à l'avance.`,

  askVpsConfig:
    list => `⚙️ Choisissez un plan VPS en fonction de vos besoins (Facturation à l'heure ou au mois disponible) :
  
${list
  .map(
    config =>
      `<strong>• ${config.name} -</strong>  ${config.specs.vCPU} vCPU, ${config.specs.RAM}GB RAM, ${config.specs.disk}GB Disque`,
  )
  .join('\n')}`,

  validVpsConfig: 'Veuillez sélectionner une configuration VPS valide :',

  configMenu: vpsOptionsOf(vpsConfigurationMenu),

  askForCoupon:
    '🎟️ Vous avez un code promo ? Entrez-le pour une réduction supplémentaire si applicable, ou passez cette étape. Les réductions du cycle de facturation sont déjà incluses.',
  couponInvalid: `❌ Invalide : Code expiré, non applicable ou incorrect. Veuillez réessayer.`,
  couponValid: amt => `✅ Valide : réduction appliquée : -$${amt}.`,
  skipCouponwarning: `⚠️ Passer cette étape signifie que vous ne pourrez pas appliquer de réduction plus tard.`,
  confirmSkip: "✅ Confirmer l'ignorance",
  goBackToCoupon: '❌ Retourner et appliquer le coupon',

  askVpsOS: price => `💡 Système d'exploitation par défaut : Ubuntu (Linux) (si aucune sélection n'est effectuée).
💻 Sélectionnez un système d'exploitation (Windows Server ajoute ${price} $/mois).

<strong>💡 Recommandé : </strong>
<strong>• Ubuntu –</strong> Idéal pour un usage général et le développement
<strong>• CentOS –</strong> Stable pour les applications d'entreprise
<strong>• Windows Server –</strong> Pour les applications basées sur Windows (+${price} $/mois)`,
  chooseValidOS: `Veuillez sélectionner un OS valide dans la liste disponible :`,
  skipOSBtn: "❌ Passer la sélection de l'OS",
  skipOSwarning:
    '⚠️ Votre VPS sera lancé sans OS. Vous devrez en installer un manuellement via SSH ou en mode de récupération.',

  askVpsCpanel: `🛠️ Sélectionnez un panneau de contrôle pour une gestion plus facile du serveur (optionnel).

<strong>• ⚙️ WHM –</strong> Recommandé pour l'hébergement de plusieurs sites web
<strong>• ⚙️ Plesk –</strong> Idéal pour gérer des sites et applications individuels
<strong>• ❌ Ignorer –</strong> Aucun panneau de contrôle`,

  cpanelMenu: vpsOptionsOf(vpsCpanelOptional),
  noControlPanel: vpsCpanelOptional[2],
  skipPanelMessage: '⚠️ Aucun panneau de contrôle ne sera installé. Vous pourrez en ajouter un manuellement plus tard.',
  validCpanel: 'Veuillez choisir un panneau de contrôle valide ou l’ignorer.',

  askCpanelOtions: (name, list) => `⚙️ Choisissez une ${
    name == 'whm' ? 'WHM' : 'Plesk Web Host Edition'
  } licence ou sélectionnez un essai gratuit (valable ${name == 'whm' ? '15' : '7'} jours).

💰 Tarification de la licence ${name == 'whm' ? 'WHM' : 'Plesk'} :

${list.map(item => `${name == 'whm' ? `<strong>• ${item.name} - </strong>` : ''}${item.label}`).join('\n')}`,

  trialCpanelMessage: panel =>
    `✅ ${panel.name == 'whm' ? 'WHM' : 'Plesk'} Essai gratuit (${
      panel.duration
    } jours) activé. Vous pouvez passer à une version payante à tout moment en contactant le support.`,

  vpsWaitingTime: "⚙️ Récupération des détails... Cela ne prendra qu'un instant.",
  failedCostRetrieval: 'Échec de la récupération des informations de coût... Veuillez réessayer après un moment.',

  errorPurchasingVPS: plan => `Une erreur est survenue lors de la configuration de votre plan VPS ${plan}.

Veuillez appuyer sur 💬 Obtenir de l'aide.
Découvrez-en plus sur ${TG_HANDLE}.`,

  generateBillSummary: vpsDetails => `<strong>📋 Détail final des coûts :</strong>

<strong>•📅 Type de disque –</strong> ${vpsDetails.diskType}
<strong>•🖥️ Plan VPS :</strong> ${vpsDetails.config.name}
<strong>•📅 Cycle de facturation (${vpsDetails.plan} Plan) –</strong> $${vpsDetails.plantotalPrice} USD
<strong>•💻 Licence OS (${vpsDetails.os ? vpsDetails.os.name : 'Non sélectionné'}) –</strong> $${
    vpsDetails.selectedOSPrice
  } USD
<strong>•🛠️ Panneau de contrôle (${
    vpsDetails.panel
      ? `${vpsDetails.panel.name == 'whm' ? 'WHM' : 'Plesk'} ${vpsDetails.panel.licenseName}`
      : 'Non sélectionné'
  }) –</strong> $${vpsDetails.selectedCpanelPrice} USD
<strong>•🎟️ Remise coupon –</strong> -$${vpsDetails.couponDiscount} USD
<strong>•🔄 Renouvellement automatique –</strong>  ${
    vpsDetails.plan === 'Hourly' ? '⏳ Horaire' : vpsDetails.autoRenewalPlan ? '✅ Activé' : '❌ Désactivé'
  }

${
  vpsDetails.plan === 'Hourly'
    ? `Remarque : Un dépôt de $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD est inclus dans votre total. Après la première déduction horaire, le reste du dépôt sera crédité sur votre portefeuille.`
    : ''
}

<strong>💰 Total :</strong> $${
    vpsDetails.plan === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      : vpsDetails.totalPrice
  } USD

<strong>✅ Procéder à la commande ?</strong>`,

  no: '❌ Annuler la commande',
  yes: '✅ Confirmer la commande',

  askPaymentMethod: 'Choisissez une méthode de paiement :',

  showDepositCryptoInfoVps: (priceCrypto, tickerView, address, vpsDetails) =>
    `Veuillez envoyer ${priceCrypto} ${tickerView} à\n\n<code>${address}</code>

Veuillez noter que les transactions en crypto-monnaie peuvent prendre jusqu'à 30 minutes pour être confirmées. Une fois la transaction confirmée, vous serez rapidement notifié et votre plan VPS sera activé.

Cordialement,
${CHAT_BOT_NAME}`,

  extraMoney: 'Le montant restant pour votre plan horaire a été déposé dans votre portefeuille.',
  paymentRecieved: `✅ Paiement réussi ! Votre VPS est en cours de configuration. Les détails seront bientôt disponibles et envoyés à votre adresse email pour votre commodité.`,
  paymentFailed: `❌ Échec du paiement. Veuillez vérifier votre méthode de paiement ou réessayer.`,

  lowWalletBalance: vpsName => `
Votre plan VPS pour l'instance ${vpsName} a été arrêté en raison d'un solde insuffisant.

Veuillez recharger votre portefeuille pour continuer à utiliser votre plan VPS.`,

  vpsBoughtSuccess: (vpsDetails, response) =>
    `<strong>🎉 VPS [${response.label}] est actif !</strong>

<strong>🔑 Informations de connexion:</strong>
  <strong>• IP:</strong> ${response.host}
  <strong>• OS:</strong> ${vpsDetails.os ? vpsDetails.os.name : 'Non sélectionné'}
  <strong>• Nom d'utilisateur:</strong> ${credentials.username}
  <strong>• Mot de passe:</strong> ${credentials.password} (changez immédiatement).
    
📧 Ces détails ont également été envoyés à votre email enregistré. Veuillez les garder en sécurité.

⚙️ Installation du panneau de contrôle (WHM/Plesk)
Si vous avez commandé WHM ou Plesk, l'installation est en cours. Vos identifiants de connexion au panneau de contrôle vous seront envoyés séparément une fois l'installation terminée.

Merci d'avoir choisi notre service
${CHAT_BOT_NAME}
`,
  vpsHourlyPlanRenewed: (vpsName, price) => `
Votre plan VPS pour l'instance ${vpsName} a été renouvelé avec succès.
${price}$ ont été débités de votre portefeuille.`,

  bankPayVPS: (
    priceNGN,
    plan,
  ) => `Veuillez envoyer ${priceNGN} NGN en cliquant sur "Effectuer le paiement" ci-dessous. Une fois la transaction confirmée, vous serez rapidement notifié et votre ${plan} plan VPS sera activé.

Cordialement,
${CHAT_BOT_NAME}`,

  askAutoRenewal: `🔄 Activer le renouvellement automatique pour un service ininterrompu ?  

🛑 Vous recevrez un rappel avant le renouvellement. Vous pouvez le désactiver à tout moment.`,
  enable: '✅ Activer',
  skipAutoRenewalWarming: expiresAt =>
    `⚠️ Votre VPS expirera le ${new Date(expiresAt).toLocaleDateString('fr-FR').replace(/\//g, '-')} à ${new Date(
      expiresAt,
    ).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}, et le service pourrait être interrompu.`,

  generateSSHKeyBtn: '✅ Générer une nouvelle clé',
  linkSSHKeyBtn: '🗂️ Lier une clé existante',
  skipSSHKeyBtn: '❌ Ignorer (Utiliser la connexion par mot de passe)',
  noExistingSSHMessage:
    '🔑 Aucune clé SSH détectée. Souhaitez-vous générer une nouvelle clé SSH pour un accès sécurisé, ou utiliser la connexion par mot de passe (moins sécurisée) ?',
  existingSSHMessage: '🔑 Vous avez des clés SSH existantes. Choisissez une option :',
  confirmSkipSSHMsg: `⚠️ Avertissement : Les connexions par mot de passe sont moins sécurisées et vulnérables aux attaques.
  🔹 Nous vous recommandons fortement d'utiliser des clés SSH. Êtes-vous sûr de vouloir continuer ?`,
  confirmSkipSSHBtn: '✅ Continuer quand même',
  setUpSSHBtn: '🔄 Configurer la clé SSH',
  sshLinkingSkipped: '❌ Liaison de clé SSH ignorée. Aucun changement effectué.',
  newSSHKeyGeneratedMsg: name => `✅ Clé SSH (${name}) créée.
⚠️ Enregistrez cette clé en toute sécurité – elle peut être récupérée plus tard.`,
  selectSSHKey: '🗂️ Sélectionnez une clé SSH existante à lier à votre VPS :',
  uploadNewKeyBtn: '➕ Télécharger une nouvelle clé',
  cancelLinkingSSHKey: `❌ Liaison de clé SSH annulée. Aucun changement effectué.`,
  selectValidSShKey: 'Veuillez sélectionner une clé SSH valide dans la liste.',
  sshKeySavedForVPS: name => `✅ La clé SSH (${name}) sera liée au nouveau VPS.`,
  askToUploadSSHKey: `📤 Téléchargez votre clé publique SSH (.pub) ou collez la clé ci-dessous.`,
  failedGeneratingSSHKey:
    'Échec de la génération d’une nouvelle clé SSH. Veuillez réessayer ou utiliser une autre méthode.',
  newSSHKeyUploadedMsg: name => `✅ Clé SSH (${name}) téléchargée avec succès et sera liée au VPS.`,
  fileTypePub: 'Le type de fichier doit être .pub',

  vpsList: list => `<strong>🖥️ Instances VPS actives :</strong>

${list
  .map(vps => `<strong>• ${vps.name} :</strong> ${vps.status === 'RUNNING' ? '🟢' : '🔴'} ${vps.status}`)
  .join('\n')}
`,
  noVPSfound: "Aucune instance VPS active n'existe. Créez-en une nouvelle.",
  selectCorrectOption: 'Veuillez sélectionner une option dans la liste',
  selectedVpsData: data => `<strong>🖥️ ID du VPS :</strong> ${data.name}

<strong>• Plan :</strong> ${data.planDetails.name}
<strong>• vCPUs :</strong> ${data.planDetails.specs.vCPU} | RAM : ${data.planDetails.specs.RAM} Go | Disque : ${
    data.planDetails.specs.disk
  } Go (${data.diskTypeDetails.type})
<strong>• OS :</strong> ${data.osDetails.name}
<strong>• Panneau de contrôle :</strong> ${
    data.cPanelPlanDetails && data.cPanelPlanDetails.type ? data.cPanelPlanDetails.type : 'Aucun'
  }
<strong>• Statut :</strong> ${data.status === 'RUNNING' ? '🟢' : '🔴'} ${data.status}
<strong>• Renouvellement automatique :</strong> ${data.autoRenewable ? 'Activé' : 'Désactivé'}
<strong>• Adresse IP :</strong> ${data.host}`,
  stopVpsBtn: '⏹️ Arrêter',
  startVpsBtn: '▶️ Démarrer',
  restartVpsBtn: '🔄 Redémarrer',
  deleteVpsBtn: '🗑️ Supprimer',
  subscriptionBtn: '🔄 Abonnements',
  VpsLinkedKeysBtn: '🔑 Clés SSH',
  confirmChangeBtn: '✅ Confirmer',

  confirmStopVpstext: name => `⚠️ Êtes-vous sûr de vouloir arrêter le VPS <strong>${name}</strong> ?`,
  vpsBeingStopped: name => `⚙️ Veuillez patienter pendant que votre VPS (${name}) est en cours d\'arrêt`,
  vpsStopped: name => `✅ Le VPS (${name}) a été arrêté.`,
  failedStoppingVPS: name => `❌ Échec de l\'arrêt du VPS (${name}).

Veuillez réessayer après un certain temps.`,
  vpsBeingStarted: name => `⚙️ Veuillez patienter pendant que votre VPS (${name}) est en cours de démarrage`,
  vpsStarted: name => `✅ Le VPS (${name}) est maintenant en cours d\'exécution.`,
  failedStartedVPS: name => `❌ Échec du démarrage du VPS (${name}).

Veuillez réessayer après un certain temps.`,
  vpsBeingRestarted: name => `⚙️ Veuillez patienter pendant que votre VPS (${name}) est en cours de redémarrage`,
  vpsRestarted: name => `✅ Le VPS (${name}) a été redémarré avec succès.`,
  failedRestartingVPS: name => `❌ Échec du redémarrage du VPS (${name}).

Veuillez réessayer après un certain temps.`,
  confirmDeleteVpstext: name =>
    `⚠️ Avertissement : La suppression de ce VPS ${name} est permanente et toutes les données seront perdues.
    • Aucun remboursement pour le temps d'abonnement non utilisé.
    • Le renouvellement automatique sera annulé et aucun frais supplémentaire ne s'appliquera.
    
  Voulez-vous continuer ?`,
  vpsBeingDeleted: name => `⚙️ Veuillez patienter pendant que votre VPS (${name}) est en cours de suppression`,
  vpsDeleted: name => `✅ Le VPS (${name}) a été supprimé de manière permanente.`,
  failedDeletingVPS: name => `❌ Échec de la suppression du VPS (${name}).

Veuillez réessayer après un certain temps.`,

  upgradeVpsBtn: '⬆️ Mettre à niveau',
  upgradeVpsPlanBtn: '⬆️ Plan VPS',
  upgradeVpsDiskBtn: '📀 Type de disque',
  upgradeVpsDiskTypeBtn: '💾 Mettre à niveau le type de disque',
  upgradeVPS: 'Choisissez le type de mise à niveau',
  upgradeOptionVPSBtn: to => {
    return `🔼 Mettre à niveau vers ${to}`
  },
  upgradeVpsPlanMsg: options => `⚙️ Choisissez un nouveau plan pour augmenter les ressources de votre VPS.
💡 La mise à niveau augmente les vCPUs, la RAM et le stockage, mais elle ne peut pas être annulée.

📌 Mises à niveau disponibles :
${options
  .map(
    planDetails =>
      `<strong>• ${planDetails.from} ➡ ${planDetails.to} –</strong> $${planDetails.monthlyPrice}/mois ($${planDetails.hourlyPrice}/heure)`,
  )
  .join('\n')}

💰 Avis de facturation : Votre plan actuel sera crédité pour les jours inutilisés, et le nouveau tarif s'appliquera pour le reste du cycle de facturation (ajustement au prorata).`,

  alreadyEnterprisePlan:
    "⚠️ Vous êtes déjà sur le plan le plus élevé (Entreprise). Aucune autre mise à niveau n'est possible.",

  alreadyHighestDisk: vpsData =>
    `⚠️ Vous êtes déjà sur le disque le plus élevé disponible (${vpsData.diskTypeDetails.type}). Aucune autre mise à niveau n\'est possible.`,
  newVpsDiskBtn: type => `Mettre à niveau vers ${type}`,
  upgradeVpsDiskMsg: upgrades => `💾 Mettez à niveau votre type de stockage pour de meilleures performances.
⚠️ Les mises à niveau de disque sont permanentes et ne peuvent pas être rétrogradées.

📌 Options disponibles :
${upgrades.map(val => `<strong>• ${val.from} ➡ ${val.to} –</strong> +$${val.price}/${val.duration}`).join('\n')}

💰 Avis de facturation : Si la mise à niveau est appliquée en cours de cycle, un ajustement au prorata sera appliqué pour la portion inutilisée de votre période de facturation actuelle.`,
  upgradePlanSummary: (newData, vpsDetails, lowBal) => `<strong>📜 Résumé de la commande :</strong>

<strong>• ID VPS : </strong> ${vpsDetails.name}
<strong>• Ancien plan : </strong> ${newData.upgradeOption.from}
<strong>• Nouveau plan : </strong> ${newData.upgradeOption.to}
<strong>• Cycle de facturation : </strong> ${newData.billingCycle}
<strong>• Nouveau tarif de facturation : </strong> $${newData.totalPrice} USD${
    newData.billingCycle === 'Hourly' ? '/heure' : ' (ajustement proratisé appliqué)'
  }
<strong>• Date d'effet : </strong> Immédiatement
${
  lowBal
    ? `
💡 Remarque : Un dépôt de $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD est inclus dans votre total. Après la première déduction du tarif horaire, le dépôt restant sera crédité sur votre portefeuille.
`
    : ''
}
<strong>• Prix total : </strong> $${lowBal ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE : newData.totalPrice} USD

<strong>✅ Confirmer la commande ?</strong>`,

  upgradeDiskSummary: (newData, vpsDetails, lowBal) => `<strong>📜 Résumé de la commande :</strong>

<strong>• VPS ID :</strong> ${vpsDetails.name}
<strong>• Ancien type de disque :</strong> ${newData.upgradeOption.from}
<strong>• Nouveau type de disque :</strong> ${newData.upgradeOption.to}
<strong>• Cycle de facturation :</strong> ${newData.billingCycle}
<strong>• Nouveau tarif :</strong> $${newData.totalPrice} USD${
    newData.billingCycle === 'Hourly' ? '/heure' : ' (ajustement au prorata appliqué)'
  }
${
  lowBal
    ? `
Note : Un dépôt de $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD est inclus dans votre total. Après la première déduction horaire, le dépôt restant sera crédité dans votre portefeuille.
`
    : ''
}
<strong>• Prix total :</strong> $${lowBal ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE : newData.totalPrice} USD

<strong>✅ Confirmer la commande ?</strong>`,

  vpsSubscriptionData: (vpsData, planExpireDate, panelExpireDate) => `<strong>🗂️ Vos abonnements actifs :</strong>

<strong>• VPS ${vpsData.name} </strong> – Expire le : ${planExpireDate}  (Renouvellement automatique : ${
    vpsData.autoRenewable ? 'Activé' : 'Désactivé'
  })
<strong>• Panneau de contrôle ${
    vpsData?.cPanelPlanDetails ? vpsData.cPanelPlanDetails.type : ': Non sélectionné'
  } </strong> ${
    vpsData?.cPanelPlanDetails
      ? `${vpsData?.cPanelPlanDetails.status === 'active' ? '- Expire le : ' : '- Expiré le : '}${panelExpireDate}`
      : ''
  } `,

  manageVpsSubBtn: "🖥️ Gérer l'abonnement VPS",
  manageVpsPanelBtn: "🛠️ Gérer l'abonnement au panneau de contrôle",

  vpsSubDetails: (data, date) => `<strong>📅 Détails de l\'abonnement VPS :</strong>

<strong>• VPS ID :</strong> ${data.name}
<strong>• Plan :</strong> ${data.planDetails.name}
<strong>• Date d\'expiration actuelle :</strong> ${date}
<strong>• Renouvellement automatique :</strong> ${data.autoRenewable ? 'Activé' : 'Désactivé'}`,

  vpsCPanelDetails: (data, date) => `<strong>📅 Détails de l'abonnement au panneau de contrôle :</strong>

<strong>• ID VPS lié :</strong> ${data.name}
<strong>• Type de panneau de contrôle :</strong> ${data.cPanelPlanDetails.type} (${data.cPanelPlanDetails.name})
<strong>• Date d'expiration actuelle :</strong> ${date}
<strong>• Renouvellement automatique :</strong> ${data.autoRenewable ? 'Activé' : 'Désactivé'}
`,

  vpsEnableRenewalBtn: '🔄 Activer le renouvellement automatique',
  vpsDisableRenewalBtn: '❌ Désactiver le renouvellement automatique',
  vpsPlanRenewBtn: '📅 Renouveler maintenant',
  unlinkVpsPanelBtn: '❌ Dissocier du VPS',
  bankPayVPSUpgradePlan: (priceNGN, vpsDetails) =>
    `Veuillez effectuer un paiement de ${priceNGN} NGN en cliquant sur "Effectuer le paiement" ci-dessous. Une fois la transaction confirmée, vous serez immédiatement informé, et votre nouveau plan VPS ${vpsDetails.upgradeOption.to} sera activé sans interruption.`,

  bankPayVPSUpgradeDisk: (priceNGN, vpsDetails) =>
    `Veuillez verser ${priceNGN} NGN en cliquant sur “Effectuer le paiement” ci-dessous. Une fois la transaction confirmée, vous serez rapidement informé, et votre plan VPS avec le nouveau type de disque ${vpsDetails.upgradeOption.toType} sera activé sans problème.`,

  showDepositCryptoInfoVpsUpgrade: (priceCrypto, tickerView, address) =>
    `Veuillez verser ${priceCrypto} ${tickerView} à\n\n<code>${address}</code>

Veuillez noter que les transactions en crypto-monnaie peuvent prendre jusqu'à 30 minutes pour être complétées. Une fois la transaction confirmée, vous serez rapidement informé, et votre nouveau plan VPS sera activé sans problème.

Cordialement,
${CHAT_BOT_NAME}`,

  linkVpsSSHKeyBtn: '➕ Lier une nouvelle clé',
  unlinkSSHKeyBtn: '❌ Dissocier la clé',
  downloadSSHKeyBtn: '⬇️ Télécharger la clé',

  noLinkedKey: name => `⚠️ Il n\'y a actuellement aucune clé SSH associée à ce VPS [${name}]. 

Veuillez lier une clé SSH à votre compte pour permettre un accès sécurisé.`,

  linkedKeyList: (list, name) => `🗂️ Clés SSH liées au VPS ${name} :

${list.map(val => `<strong>• ${val}</strong>`).join('\n')}`,

  unlinkSSHKeyList: name => `🗂️ Sélectionnez une clé SSH à supprimer du VPS [${name}] :`,
  confirmUnlinkKey: data => `⚠️ Êtes-vous sûr de vouloir dissocier [${data.keyForUnlink}] du VPS [${data.name}] ?`,
  confirmUnlinkBtn: '✅ Confirmer la dissociation',
  keyUnlinkedMsg: data => `✅ La clé SSH [${data.keyForUnlink}] a été dissociée du VPS [${data.name}].`,
  failedUnlinkingKey: data => `❌ Échec de la dissociation de la clé SSH du VPS (${data.name}). 

Veuillez réessayer plus tard.`,

  userSSHKeyList: name => `🗂️ Sélectionnez une clé SSH à lier au VPS [${name}] :`,
  noUserKeyList: `🔑 Aucune clé SSH détectée. Voulez-vous en télécharger une nouvelle ?`,
  linkKeyToVpsSuccess: (key, name) => `✅ La clé SSH [${key}] a été liée avec succès au VPS [${name}].`,
  failedLinkingSSHkeyToVps: (key, name) => `❌ Échec de la liaison de la clé SSH [${key}] au VPS (${name}). 

Veuillez réessayer plus tard.`,

  selectSSHKeyToDownload: '🗂️ Sélectionnez la clé SSH que vous souhaitez télécharger :',

  disabledAutoRenewal: (
    data,
    expiryDate,
  ) => `⚠️ Le renouvellement automatique est désactivé. Votre VPS expirera le ${expiryDate} à moins d'un renouvellement manuel.
✅ Renouvellement automatique désactivé avec succès.`,

  enabledAutoRenewal: (data, expiryDate) =>
    `✅ Renouvellement automatique activé. Votre VPS sera automatiquement renouvelé le ${expiryDate}.`,

  renewVpsPlanConfirmMsg: (data, vpsDetails, expiryDate, lowBal) => `<strong>📜 Résumé de la facture</strong>

<strong>• ID VPS :</strong> ${vpsDetails.name}
<strong>• Plan :</strong> ${vpsDetails.planDetails.name}
<strong>• Cycle de facturation :</strong> ${vpsDetails.billingCycleDetails.type}
<strong>• Date d'expiration actuelle :</strong> ${expiryDate}
<strong>• Montant dû :</strong> ${data.totalPrice} USD

${
  lowBal
    ? `Remarque : Un dépôt de $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD est inclus dans votre total. Après la déduction du premier tarif horaire, le reste du dépôt sera crédité sur votre portefeuille.`
    : ''
}

<strong>• Prix total :</strong> $${
    lowBal
      ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      : data.totalPrice
  } USD

<strong>💳 Procéder au renouvellement du VPS ?</strong>`,

  payNowBtn: '✅ Payer maintenant',

  vpsChangePaymentRecieved: `✅ Paiement réussi ! Votre VPS est en cours de configuration. Les détails seront bientôt disponibles.`,

  bankPayVPSRenewPlan: priceNGN =>
    `Veuillez envoyer ${priceNGN} NGN en cliquant sur "Effectuer le paiement" ci-dessous. Une fois la transaction confirmée, vous serez immédiatement notifié et votre plan VPS sera activé et renouvelé.`,

  renewVpsPanelConfirmMsg: (
    data,
    panelDetails,
    date,
  ) => `<strong>💳 Procéder au renouvellement du panneau de contrôle ?</strong>

<strong>📜 Résumé de la facture</strong>
  <strong>• ID VPS lié :</strong> ${data.name}
  <strong>• Panneau de contrôle :</strong> ${panelDetails.type}
  <strong>• Période de renouvellement :</strong> ${panelDetails.durationValue}${' '}Mois
  <strong>• Date d'expiration actuelle :</strong> ${date}
  <strong>• Montant dû :</strong> ${data.totalPrice} USD`,

  bankPayVPSRenewCpanel: (priceNGN, vpsDetails) =>
    `Veuillez envoyer ${priceNGN} NGN en cliquant sur "Effectuer le paiement" ci-dessous. Une fois la transaction confirmée, vous serez immédiatement notifié et votre plan VPS sera activé et le panneau de contrôle ${vpsDetails.cPanelPlanDetails.type} sera renouvelé.`,

  vpsUnlinkCpanelWarning: vpsDetails =>
    `⚠️ Avertissement : Dissocier supprimera la licence ${vpsDetails.cPanel} du VPS ${vpsDetails.name}, et vous perdrez l'accès à ses fonctionnalités. Voulez-vous continuer ?`,

  unlinkCpanelConfirmed: data => `✅ Panneau de contrôle ${data.cPanel} dissocié avec succès du VPS ${data.name}.`,

  errorUpgradingVPS: vpsName => `Une erreur s'est produite lors de la mise à niveau de votre plan VPS ${vpsName}.

Veuillez appuyer sur 💬 Obtenir de l'aide.
En savoir plus ${TG_HANDLE}.`,

  vpsUpgradePlanTypeSuccess: vpsDetails => `
✅ VPS ${vpsDetails.name} mis à niveau vers ${vpsDetails.upgradeOption.to}. Vos nouvelles ressources sont maintenant disponibles.`,

  vpsUpgradeDiskTypeSuccess: vpsDetails =>
    `✅ Disque mis à niveau vers ${vpsDetails.upgradeOption.to} pour le VPS ${vpsDetails.name}. Votre nouveau type de disque est maintenant actif.`,
  vpsRenewPlanSuccess: (vpsDetails, expiryDate) =>
    `✅ L'abonnement VPS pour ${vpsDetails.name} a été renouvelé avec succès !

• Nouvelle date d'expiration : ${expiryDate}
`,
  vpsRenewCPanelSuccess: (vpsDetails, expiryDate) =>
    `✅ Abonnement au panneau de contrôle pour ${vpsDetails.name} renouvelé avec succès !

• Nouvelle date d'expiration : ${expiryDate}
`,
}

const fr = {
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
  fr,
}
