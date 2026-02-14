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
const APP_SUPPORT_LINK = process.env.APP_SUPPORT_LINK

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
  viewAnalytics: '📊 查看分析',
  viewUsers: '👀 查看用户',
  blockUser: '✋ 阻止用户',
  unblockUser: '👌 解除阻止用户',
  messageUsers: '👋 向所有用户发送消息',
}
const user = {
  // main keyboards
  cPanelWebHostingPlans: '俄罗斯 cPanel 托管计划 🔒',
  pleskWebHostingPlans: '俄罗斯 Plesk 托管计划 🔒',
  joinChannel: '📢 加入频道',
  phoneNumberLeads: '📲 电话线索与验证',
  hostingDomainsRedirect: '🌐 托管和域名',
  wallet: '👛 我的钱包',
  urlShortenerMain: `🔗✂️ URL 缩短器 - ${FREE_LINKS}次试用`,
  vpsPlans: '购买防弹 VPS🛡️ - 按小时/按月',
  buyPlan: '🔔 订阅这里',
  domainNames: '🌐 注册域名 - ❌ DMCA',
  viewPlan: '🔔 我的计划',
  becomeReseller: '💼 成为代理商',
  getSupport: '💬 获取支持',
  freeTrialAvailable: '📧🆓 BulkSMS - 免费试用',
  changeSetting: '🌍 更改设置',

  // Sub Menu 1: urlShortenerMain
  redSelectUrl: '🔀✂️ 重定向并缩短',
  urlShortener: '✂️🌐 自定义域名缩短器',
  viewShortLinks: '📊 查看短链接分析',

  // Sub Menu 2: domainNames
  buyDomainName: '🛒🌐 购买域名',
  viewDomainNames: '📂 我的域名',
  dnsManagement: '🔧 DNS 管理',

  // Sub Menu 3: cPanel/Plesk WebHostingPlansMain
  freeTrial: '💡 免费试用',
  starterPlan: '🔼 初级计划',
  proPlan: '🔷 专业计划',
  businessPlan: '👑 商业计划',
  contactSupport: '📞 联系支持',

  // Sub Menu 4: VPS Plans
  buyVpsPlan: '⚙️ 创建新的VPS',
  manageVpsPlan: '🖥️ 查看/管理VPS',
  manageVpsSSH: '🔑 SSH密钥',

  // Free Trial
  freeTrialMenuButton: '🚀 免费试用（12小时）',
  getFreeTrialPlanNow: '🛒 立即获取试用计划',
  continueWithDomainNameSBS: websiteName => `➡️ 继续使用 ${websiteName}`,
  searchAnotherDomain: '🔍 搜索其他域名',
  privHostNS: '🏢 PrivHost（快速安全的主机）',
  cloudflareNS: '🛡️ Cloudflare 防护（安全和隐私）',
  backToFreeTrial: '⬅️ 返回免费试用',

  // Paid Plans
  buyStarterPlan: '🛒 购买初级计划',
  buyProPlan: '🛒 购买专业计划',
  buyBusinessPlan: '🛒 购买商业计划',
  viewStarterPlan: '🔷 查看初级计划',
  viewProPlan: '🔼 查看专业计划',
  viewBusinessPlan: '👑 查看商业计划',
  backToHostingPlans: '⬅️ 返回主机计划',
  registerANewDomain: '🌐 注册新域名',
  useExistingDomain: '🔄 使用现有域名',
  backToStarterPlanDetails: '⬅️ 返回初级计划详情',
  backToProPlanDetails: '⬅️ 返回专业计划详情',
  backToBusinessPlanDetails: '⬅️ 返回商业计划详情',
  continueWithDomain: websiteName => `➡️ 继续使用 ${websiteName}`,
  enterAnotherDomain: '🔍 输入另一个域名',
  backToPurchaseOptions: '⬅️ 返回购买选项',
}

const u = {
  // other key boards
  deposit: '➕💵 存款',
  withdraw: '➖💵 撤回',

  // wallet
  usd: '美元',
  ngn: 'NGN',
}
const view = num => Number(num).toFixed(2)
const yesNo = ['是', '否']

const bal = (usd, ngn) =>
  HIDE_BANK_PAYMENT !== 'true'
    ? `$${view(usd)}
₦${view(ngn)}`
    : `$${view(usd)}`

const dnsEntryFormat = `记录格式：
        •       A 记录（网站必需）/ CNAME（可选，不能与 A 记录共存）
        •       主机名：子域名（例如 auth）或根域名使用 '@'（可选）
        •       值：A 记录使用 IP 地址 / CNAME 记录使用主机名

请按照下面提供的格式输入您的记录：

示例：
✅ A 记录：A pay 192.0.2.1（如果没有主机名，则 A 192.0.2.1）
✅ CNAME 记录：CNAME pay 0oaawzt7.up.railway.app（如果没有主机名，则 CNAME 0oaawzt7.up.railway.app）`

const t = {
  yes: '是',
  no: '否',
  back: '返回',
  cancel: '取消',
  skip: '跳过',
  becomeReseller: `你好，

我联系您是为了向您提供一个绝佳的机会，成为${CHAT_BOT_BRAND}Bot强大SMS营销和托管软件的经销商。
  
关键细节：
  
利润分成：每笔销售可赚取65/35%的竞争性分成。
  
设置费用：详情请联系支持。
  
感兴趣？请通过${SUPPORT_HANDLE}与我们联系，以了解更多有关此盈利合作的信息。
  
期待与您合作！
  
最好的祝福，
  
${CHAT_BOT_BRAND}团队
  `,
  resetLoginAdmit: `${CHAT_BOT_BRAND} SMS: 您已成功退出您之前的设备。请立即登录。`,
  resetLoginDeny: '好的，不需要进一步操作。',
  resetLogin: `${CHAT_BOT_BRAND} SMS: 您是否试图从之前的设备上注销？`,
  select: `请选择一个选项：`,
  urlShortenerSelect: `缩短、品牌化或追踪您的链接：`,

  // cPanel/Plesk Plans initial select plan text
  selectPlan: `请选择一个计划：`,
  backButton: '⬅️ 返回',
  yesProceedWithThisEmail: email => `➡️ 使用 ${email} 继续`,
  proceedWithPayment: '➡️ 继续付款',
  iHaveSentThePayment: `我已发送付款 ✅`,
  trialAlreadyUsed: `您已经使用了您的免费试用。如果您需要更多的访问权限，请考虑订阅我们的付费计划之一。`,
  oneHourLeftToExpireTrialPlan: `您的 Freedom 计划将在 1 小时后到期。如果您想继续使用我们的服务，请考虑升级到付费计划！`,
  freePlanExpired: `🚫 您的 Freedom 计划已过期。希望您享受了试用期！要继续使用我们的服务，请购买我们的高级计划之一。`,
  freeTrialPlanSelected: hostingType => `
- 免费试用我们的 <b>Freedom 计划</b>！此计划包括一个以 .sbs 结尾的免费域名，有效期为 12 小时。

🚀 <b>Freedom 计划：</b>
<b>- 存储：</b> 1 GB SSD
<b>- 带宽：</b> 10 GB
<b>- 域名：</b> 1 个免费的 .sbs 域名
<b>- 邮箱账户：</b> 1 个邮箱账户
<b>- 数据库：</b> 1 个 MySQL 数据库
<b>- 免费 SSL：</b> 是
<b>- ${hostingType} 功能：</b> 完全访问 ${hostingType}，用于管理文件、数据库和邮箱等。
<b>- 时长：</b> 有效期 12 小时
<b>- 适合：</b> 测试和短期项目。
  `,
  getFreeTrialPlan: `请输入您想要的域名（例如：example.sbs）并将其作为消息发送。此域名以 .sbs 结尾，并且在您的试用计划中免费提供。`,
  trialPlanContinueWithDomainNameSBSMatched: websiteName => `域名 ${websiteName} 可用！`,
  trialPlanSBSDomainNotMatched: `您输入的域名未找到。请确保域名正确或尝试使用其他域名。`,
  trialPlanSBSDomainIsPremium: `此域名为高级价格，仅适用于付费计划。请搜索其他域名。`,
  trialPlanGetNowInvalidDomain: `请输入有效的域名，必须以 '.sbs' 结尾。域名应类似于 'example.sbs'，并且在您的试用计划中免费提供。`,
  trialPlanNameserverSelection: websiteName => `请选择您希望为 ${websiteName} 使用的名称服务器提供商。`,
  trialPlanDomainNameMatched: `请提供您的电子邮件地址以创建您的账户并发送您的收据。`,
  confirmEmailBeforeProceedingSBS: email => `您确定要使用此电子邮件 ${email} 订阅 Freedom 计划吗？`,
  trialPlanInValidEmail: `请输入有效的电子邮件。`,
  trialPlanActivationConfirmation: `谢谢！您的免费试用计划将很快激活。请注意，此计划仅在 12 小时内有效。`,
  trialPlanActivationInProgress: `您的免费试用计划正在激活。这可能需要一些时间……`,

  what: `该选项目前不可用。请从下方按钮中选择。`,
  whatNum: `请选择一个有效的数字。`,
  phoneGenTimeout: `超时。`,
  phoneGenNoGoodHits: `请联系支持 ${SUPPORT_HANDLE} 或选择其他区号。`,

  subscribeRCS: p => `已订阅！随时通过点击<a href="${SELF_URL}/unsubscribe?a=b&Phone=${p}">链接</a>取消订阅。`,
  unsubscribeRCS: p => `您已取消订阅！要重新订阅，请点击<a href="${SELF_URL}/subscribe?a=b&Phone=${p}">链接</a>。`,
  argsErr: `开发：发送了错误的参数。`,
  showDepositNgnInfo:
    ngn => `请通过点击下方的“付款”按钮汇款 ${ngn} NGN。一旦交易确认，您将立即收到通知，并且您的钱包将更新。

此致,  
${CHAT_BOT_NAME}`,
  askEmail: `请提供用于支付确认的电子邮件。`,
  askValidAmount: '请提供一个有效的数字。',
  askValidEmail: '请提供一个有效的电子邮件。',
  askValidCrypto: '请选择一种有效的加密货币。',
  askValidPayOption: '请选择一个有效的支付选项。',
  chooseSubscription:
    HIDE_SMS_APP === 'true'
      ? `<b>通过我们的订阅计划提升您的品牌！</b>

- <b>每日:</b> $${PRICE_DAILY} — ${DAILY_PLAN_FREE_DOMAINS} 个免费 ".sbs/.xyz" 域名 + ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()} 次免费USA电话验证 + 无限Shortit链接。
- <b>每周:</b> $${PRICE_WEEKLY} — ${WEEKLY_PLAN_FREE_DOMAINS} 个免费 ".sbs/.xyz" 域名 + ${WEEKLY_PLAN_FREE_VALIDATIONS.toLocaleString()} 次免费USA电话验证 + 无限Shortit链接。
- <b>每月:</b> $${PRICE_MONTHLY} — ${MONTHLY_PLAN_FREE_DOMAINS} 个免费 ".sbs/.xyz" 域名 + ${MONTHLY_PLAN_FREE_VALIDATIONS.toLocaleString()} 次免费USA电话验证 + 无限Shortit链接。

(免费域名仅限 ".sbs" 和 ".xyz" 扩展名。)`
      : `<b>通过我们的订阅计划提升您的品牌！</b>

- <b>每日:</b> $${PRICE_DAILY} — ${DAILY_PLAN_FREE_DOMAINS} 个免费 ".sbs/.xyz" 域名 + ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()} 次免费USA电话验证 + 无限Shortit链接 + 无限BulkSMS。
- <b>每周:</b> $${PRICE_WEEKLY} — ${WEEKLY_PLAN_FREE_DOMAINS} 个免费 ".sbs/.xyz" 域名 + ${WEEKLY_PLAN_FREE_VALIDATIONS.toLocaleString()} 次免费USA电话验证 + 无限Shortit链接 + 无限BulkSMS。
- <b>每月:</b> $${PRICE_MONTHLY} — ${MONTHLY_PLAN_FREE_DOMAINS} 个免费 ".sbs/.xyz" 域名 + ${MONTHLY_PLAN_FREE_VALIDATIONS.toLocaleString()} 次免费USA电话验证 + 无限Shortit链接 + 无限BulkSMS。

(免费域名仅限 ".sbs" 和 ".xyz" 扩展名。)`,

  askCoupon: usd => `价格是 $${usd}。您是否想使用优惠券代码？如果有，请立即输入。否则，您可以按“跳过”。`,
  planAskCoupon: `您是否想使用优惠券代码？如果有，请立即输入。否则，您可以按“跳过”。`,
  enterCoupon: `请输入优惠券代码：`,
  planPrice: (plan, price) => `${plan} 订阅的价格是 $${price}。请选择支付方式。`,
  planNewPrice: (plan, price, newPrice) =>
    `${plan} 订阅的价格现在是 $${view(newPrice)} <s>($${price})</s>。请选择支付方式。`,
  domainPrice: (domain, price) => `${domain} 域名的价格是 $${price} USD。请选择支付方式。`,
  domainNewPrice: (domain, price, newPrice) =>
    `${domain} 域名的价格现在是 $${view(newPrice)} <s>($${price})</s>。请选择支付方式。`,
  couponInvalid: `优惠券代码无效，请重新输入：`,
  lowPrice: `提供的价格低于所需金额。`,
  freeTrialAvailable: `您的 BulkSMS 免费试用现已启用。请在此处下载 ${SMS_APP_NAME} 安卓应用程序：${SMS_APP_LINK}。需要 E-sim 卡吗？请联系 ${SUPPORT_HANDLE}。`,
  freeTrialNotAvailable: `您已使用过免费试用。`,
  planSubscribed:
    HIDE_SMS_APP === 'true'
      ? `您已成功订阅 {{plan}} 计划！享受免费 ".sbs/.xyz" 域名、无限Shortit链接和免费USA电话号码验证。需要 E-sim 卡？请联系 ${SUPPORT_HANDLE}。`
      : `您已成功订阅 {{plan}} 计划！享受免费 ".sbs/.xyz" 域名、无限Shortit链接、免费USA验证和 ${SMS_APP_NAME}。请在此下载应用: ${SMS_APP_LINK}。需要 E-sim 卡？请联系 ${SUPPORT_HANDLE}。`,
  alreadySubscribedPlan: days => `您的订阅已激活，并将在 ${days} 天后到期。`,
  payError: `未找到支付会话，请重试或联系支持 ${SUPPORT_USERNAME}。了解更多信息，请访问 ${TG_HANDLE}。`,
  chooseFreeDomainText: `<b>好消息！</b> 此域名可随您的订阅免费提供。您想领取吗？`,

  chooseDomainToBuy: text => `<b>获取你的网络角落！</b> 请分享你希望购买的域名，例如“abcpay.com”。${text}`,
  askDomainToUseWithShortener: `你是否希望使用此域名进行链接简化？`,
  blockUser: `请分享需要被封锁的用户的用户名。`,
  unblockUser: `请分享需要解封的用户的用户名。`,
  blockedUser: `你目前被封锁，无法使用机器人。请联系支持 ${SUPPORT_USERNAME}。更多信息 ${TG_HANDLE}。`,
  greet: `${CHAT_BOT_BRAND} — 缩短URL、注册域名、购买电话线索，从Telegram发展您的业务。

使用${FREE_LINKS}次Shortit试用链接开始 — /start
支持: ${SUPPORT_USERNAME}`,

  linkExpired: `您的 ${CHAT_BOT_BRAND} 测试期已结束，您的短链接已停用。我们邀请您订阅以继续访问我们的URL服务和免费域名。选择适当的计划并按照说明订阅。请联系我们的任何问题。
敬启者，
${CHAT_BOT_BRAND}团队
了解更多： ${TG_CHANNEL}`,
  successPayment: `支付成功处理！现在可以关闭此窗口。`,
  welcome: `感谢选择 ${CHAT_BOT_NAME}！请在下面选择一个选项：`,
  welcomeFreeTrial: `${CHAT_BOT_BRAND}欢迎您！您有${FREE_LINKS}次Shortit试用链接来缩短URL。订阅可获得无限Shortit链接、免费 ".sbs/.xyz" 域名和免费USA电话验证。体验${CHAT_BOT_BRAND}的不同！`,
  unknownCommand: `找不到命令。按 /start 或联系支持 ${SUPPORT_USERNAME}。了解更多 ${TG_HANDLE}。`,
  support: `请联系支持 ${SUPPORT_USERNAME}。了解更多 ${TG_HANDLE}。`,
  joinChannel: `请加入频道 ${TG_CHANNEL}。`,
  dnsPropagated: `{{domain}}的DNS传播已完成，进行无限链接简化。`,
  dnsNotPropagated: `{{domain}}的DNS传播正在进行，您将会在完成后更新。 ✅`,
  domainBoughtSuccess: domain => `域名 ${domain} 现在属于您。谢谢选择我们。

敬启者，
${CHAT_BOT_NAME}`,

  domainBought: `您的域名 {{domain}} 已成功链接到您的账户，DNS传播即将完成。稍后您将自动收到更新。🚀`,
  domainLinking: domain =>
    `正在将域名与您的账户链接中。请注意，DNS更新可能需要最长 30 分钟。您可以在此处检查 DNS 更新状态：https://www.whatsmydns.net/#A/${domain}`,
  errorSavingDomain: `保存域名时出错，请联系支持 ${SUPPORT_USERNAME}。更多信息请访问 ${TG_HANDLE}。`,
  chooseDomainToManage: `请选择您要管理的域名。`,
  chooseDomainWithShortener: `请选择或购买您想要连接到短链接的域名。`,
  viewDnsRecords: (records, domain) => `以下是 ${domain} 的 DNS 记录

A 记录（可选，但用于直接 IP 映射是必需的）
${
  records.A && records.A.length
    ? records.A.map(
        record => `<strong>${record.index}. A 记录</strong>
  • 主机名：${record.recordName}
  • A 记录值：${record.recordContent ? record.recordContent : '无'}`,
      ).join('\n')
    : '  • A 记录：无'
}

NS 记录（必需 – 用于域名解析）
${
  records.NS && records.NS.length
    ? records.NS.map(record => `<strong>${record.index}. NS 记录 ${record.nsId}</strong> ${record.recordContent}`).join(
        '\n\n',
      )
    : '  • NS 记录：无'
}

CNAME 记录（可选，但如果要将另一个域作为别名，而不是使用 A 记录，则必需）
${
  records.CNAME && records.CNAME.length
    ? records.CNAME.map(
        record => `<strong>${record.index}. CNAME 记录</strong>
  • 主机名：${record.recordName}
  • CNAME 记录值：${record.recordContent ? record.recordContent : '无'}`,
      ).join('\n')
    : '  • CNAME 记录：无'
}`,

  addDns: `添加 DNS 记录`,
  updateDns: `更新 DNS 记录`,
  deleteDns: `删除 DNS 记录`,
  addDnsTxt: `请选择您想要添加的记录类型：`,
  updateDnsTxt: `请输入您要更新的记录 ID。例：3`,
  deleteDnsTxt: `请输入您要删除的记录 ID。例：3`,
  confirmDeleteDnsTxt: `确定吗？是或否`,
  a: `A 记录`,
  cname: `CNAME 记录`,
  ns: `NS 记录`,
  'A 记录': `A`,
  'CNAME 记录': `CNAME`,
  'NS 记录': `NS`,
  askDnsContent: {
    A: dnsEntryFormat,
    'A 记录': dnsEntryFormat,

    CNAME: dnsEntryFormat,
    'CNAME 记录': dnsEntryFormat,

    NS: `请输入您的 NS 记录。例：dell.ns.cloudflare.com。一个新的 NS 记录将添加到现有记录中。`,
    'NS 记录': `请输入您的 NS 记录。例：dell.ns.cloudflare.com。如果 N1-N4 已存在，请更新记录。`,
  },
  askUpdateDnsContent: {
    A: dnsEntryFormat,
    'A 记录': dnsEntryFormat,
    CNAME: dnsEntryFormat,
    'CNAME 记录': dnsEntryFormat,
    NS: `一个新的 NS 记录将被更新到选定的 ID。如果要添加新记录，请选择“添加 DNS 记录”`,
    'NS 记录': `一个新的 NS 记录将被更新到选定的 ID。如果要添加新记录，请选择“添加 DNS 记录”`,
  },
  dnsRecordSaved: `记录已添加`,
  dnsRecordDeleted: `记录已删除`,
  dnsRecordUpdated: `记录已更新`,
  provideLink: `请输入有效的 URL。例如：https://google.com`,
  comingSoonWithdraw: `提现功能暂未开放。需要帮助？请联系 ${SUPPORT_USERNAME}。`,
  promoOptOut: `您已取消订阅促销消息。输入 /start_promos 随时重新订阅。`,
  promoOptIn: `您已重新订阅促销消息。您将收到我们最新的优惠和活动！`,
  selectCurrencyToDeposit: `请选择要存入的货币`,
  depositNGN: `请输入 NGN 金额：`,
  askEmailForNGN: `请输入支付确认邮件`,
  depositUSD: `请输入 USD 金额，注意最小值为 $10：`,
  selectCryptoToDeposit: `请选择加密货币：`,
  'bank-pay-plan': (priceNGN, plan) =>
    `请点击“付款”按钮，发送 ${priceNGN} NGN。一旦交易确认，您将立即收到通知，您的 ${plan} 计划将顺利激活。

问候，
${CHAT_BOT_NAME}`,
  bankPayDomain: (priceNGN, domain) =>
    `请点击“付款”按钮，发送 ${priceNGN} NGN。一旦交易确认，您将立即收到通知，您的域名 ${domain} 将顺利激活。

问候，
${CHAT_BOT_NAME}`,
  showDepositCryptoInfoPlan: (priceCrypto, tickerView, address, plan) =>
    `请发送 ${priceCrypto} ${tickerView} 至\n\n<code>${address}</code>

请注意，加密货币交易可能需要最多 30 分钟完成。一旦交易确认，您将立即收到通知，您的 ${plan} 计划将顺利激活。

问候，
${CHAT_BOT_NAME}`,
  showDepositCryptoInfoDomain: (priceCrypto, tickerView, address, domain) =>
    `请发送 ${priceCrypto} ${tickerView} 至\n\n<code>${address}</code>

请注意，加密货币交易可能需要最多 30 分钟完成。一旦交易确认，您将立即收到通知，您的域名 ${domain} 将顺利激活。

问候，
${CHAT_BOT_NAME}`,

  showDepositCryptoInfo: (priceCrypto, tickerView, address) =>
    `请汇 ${priceCrypto} ${tickerView} 至\n\n<code>${address}</code>\n\n请注意，加密货币交易可能需要最多30分钟才能完成。一旦交易确认，您将立即收到通知，并且您的钱包将更新。\n\n问候,\n${CHAT_BOT_NAME}`,

  confirmationDepositMoney: (amount, usd) =>
    `您的 ${amount}（$${usd}）支付已处理。感谢您选择我们。\n问候,\n${CHAT_BOT_NAME}`,

  showWallet: (usd, ngn) => `钱包余额 :\n\n${bal(usd, ngn)}`,

  wallet: (usd, ngn) => `钱包余额 :\n\n${bal(usd, ngn)}\n\n请选择钱包选项:`,

  walletSelectCurrency: (usd, ngn) => `请选择从钱包余额中支付的货币:\n\n${bal(usd, ngn)}`,

  walletBalanceLow: `您的钱包余额不足。点击"👛 我的钱包" → "➕💵 充值"进行充值。`,

  sentLessMoney: (expected, got) =>
    `您发送的金额少于预期，所以我们将收到的金额存入您的钱包。我们预期 ${expected} 但收到 ${got}`,

  sentMoreMoney: (expected, got) =>
    `您发送的金额多于预期，因此我们将多余的金额存入您的钱包。我们预期 ${expected} 但收到 ${got}`,

  buyLeadsError: `抱歉，选择的区号不可用，并且您的钱包未收费`,
  buyLeadsProgress: (i, total) => `${((i * 100) / total).toFixed()}% leads 下载中。请稍候。`,

  phoneNumberLeads: `购买经验证的电话线索或验证您自己的号码：`,

  buyLeadsSelectCountry: `请选择国家`,
  buyLeadsSelectSmsVoice: `请选择短信/语音`,
  buyLeadsSelectArea: `请选择区域`,
  buyLeadsSelectAreaCode: `请选择区号`,
  buyLeadsSelectCarrier: `请选择运营商`,
  buyLeadsSelectCnam: `您想查询所有者的姓名吗？CNAME 每 1000 leads 额外费用 15 美元`,
  buyLeadsSelectAmount: (min, max) => `您想购买多少 leads？选择或输入一个数量。最小值为 ${min} 最大值为 ${max}`,

  buyLeadsSelectFormat: `选择格式，例如本地 (212) 或国际 (+1212)`,

  buyLeadsSuccess: n => `恭喜，您的 ${n} leads 已下载。`,

  buyLeadsNewPrice: (leads, price, newPrice) => ` ${leads} leads 的价格现在为 $${view(newPrice)} <s>($${price})</s>`,
  buyLeadsPrice: (leads, price) => ` ${leads} leads 的价格为 $${price}。`,

  confirmNgn: (usd, ngn) => `${usd} USD ≈ ${ngn} NGN `,

  walletSelectCurrencyConfirm: `确认？`,

  validatorSelectCountry: `请选择国家`,
  validatorPhoneNumber: `请粘贴您的号码或上传包含国家代码的文件。`,
  validatorSelectSmsVoice: n => `${n} 个电话号码找到。请选择短信或语音拨号的选项。`,
  validatorSelectCarrier: `请选择运营商`,
  validatorSelectCnam: `您想查询所有者的姓名吗？CNAME 每 1000 leads 额外费用 15 美元`,
  validatorSelectAmount: (min, max) => `您想验证多少个电话号码？选择或输入一个数量。最小值为 ${min} 最大值为 ${max}`,

  validatorSelectFormat: `选择格式，例如本地 (212) 或国际 (+1212)`,

  validatorSuccess: (n, m) => `${n} 个 leads 被验证了。${m} 个有效的电话号码找到。`,
  validatorProgress: (i, total) => `${((i * 100) / total).toFixed()}% leads 验证中。请稍候。`,
  validatorProgressFull: (i, total) => `${((i * 100) / total).toFixed()}% leads 验证。`,

  validatorError: `抱歉，选择的电话号码不可用，并且您的钱包未收费`,
  validatorErrorFileData: `找到无效的国家电话号码。请上传选定国家的电话号码`,
  validatorErrorNoPhonesFound: `找不到电话号码。请重试。`,

  validatorBulkNumbersStart: `lead 验证已开始，很快就会完成。`,

  // url re-director
  redSelectUrl: `请分享您想要缩短和分析的 URL，例如 https://cnn.com`,
  redSelectRandomCustom: `请选择您的选择，随机或自定义链接`,
  redSelectProvider: `选择链接提供商`,
  redSelectCustomExt: `输入自定义后缀`,

  redValidUrl: `请提供一个有效的 URL，例如 https://google.com`,
  redTakeUrl: url => `您的缩短后的 URL 是: ${url}`,
  redIssueUrlBitly: `链接缩短失败。您的钱包未被扣费。请重试或联系 ${SUPPORT_USERNAME}。`,
  redIssueSlugCuttly: `您选择的链接名称已被使用，请尝试另一个`,
  redIssueUrlCuttly: `链接缩短失败。请重试或联系 ${SUPPORT_USERNAME}。`,
  freeLinksExhausted: `您已用完全部${FREE_LINKS}次Shortit试用链接！订阅可获得无限Shortit链接、免费".sbs/.xyz"域名等更多功能。点击"🔔 订阅"选择计划。`,
  linksRemaining: (count, total) => `您还剩 ${count}/${total || FREE_LINKS} 次Shortit试用链接。`,
  redNewPrice: (price, newPrice) => `价格现在为 $${view(newPrice)} <s>($${price})</s>。请选择支付方式。`,
  customLink: '自定义链接',
  randomLink: '随机链接',
  askShortLinkExtension: '请告诉我们您偏好的短链接扩展名：例如 payer',
  linkAlreadyExist: `链接已存在。请键入 'ok' 尝试另一个。`,
  yourShortendUrl: shortUrl => `您的短链接是：${shortUrl}`,

  availablefreeDomain: (plan, available, s) =>
    `请记住，您的 ${plan} 计划包括 ${available} 个免费的“.sbs/.xyz”域名${s}。今天就获取您的域名！`,
  shortenedUrlLink: `请分享您希望缩短和分析的URL。例如 https://cnn.com`,
  selectedTrialPlan: `您已选择免费试用计划`,
  userPressedBtn: message => `用户点击了 ${message} 按钮。`,
  userToBlock: userToBlock => `未找到用户 ${userToBlock}。`,
  userBlocked: userToBlock => `用户 ${userToBlock} 已被屏蔽。`,
  checkingDomainAvail: `检查域名可用性...`,
  checkingExistingDomainAvail: `检查现有域名的可用性...`,
  subscribeFirst: `📋 先订阅`,
  freeValidationUsed: (amount, remaining) => `已使用订阅验证了 ${amount} 个USA电话号码！剩余免费验证: ${remaining.toLocaleString()}。`,
  partialFreeValidation: (freeAmount, totalAmount, paidAmount, paidPrice) => `您还有 ${freeAmount.toLocaleString()} 次免费验证。您请求了 ${totalAmount.toLocaleString()} 个号码。\n\n${freeAmount.toLocaleString()} 个将免费处理，剩余 ${paidAmount.toLocaleString()} 个需支付 $${paidPrice}。请在下方完成付款。`,
  notValidHalf: `输入一个有效的后半部分`,
  linkAlreadyExist: `链接已经存在。请尝试其他。`,
  issueGettingPrice: `获取价格时遇到问题`,
  domainInvalid: `域名无效。请尝试其他域名。使用格式 abcpay.com`,
  chooseValidPlan: `请选择一个有效的计划`,
  noDomainFound: `未找到域名`,
  chooseValidDomain: `请选择一个有效的域名`,
  errorDeletingDns: error => `删除DNS记录时出错，${error}，请再次提供值`,
  selectValidOption: `选择有效选项`,
  maxDnsRecord: `最多可以添加4个NS记录，您可以更新或删除以前的NS记录`,
  errorSavingDns: error => `保存DNS记录时出错，${error}，请再次提供值`,
  fileError: `处理文件时出错。`,
  ammountIncorrect: `金额不正确`,
  subscriptionExpire: (subscribedPlan, timeEnd) => `您的 ${subscribedPlan} 订阅已过期 ${timeEnd}`,
  plansSubscripedtill: (subscribedPlan, timeEnd) =>
    `您当前订阅的是 ${subscribedPlan} 计划。您的计划有效期至 ${timeEnd}`,
  planNotSubscriped: `您当前没有任何订阅计划。`,
  noShortenedUrlLink: `您还没有缩短的链接。`,
  shortenedLinkText: linksText => `这是您的缩短链接：\n${linksText}`,

  qrCodeText: `这是您的二维码！`,
  scanQrOrUseChat: chatId => `使用短信营销应用扫描二维码登录。您也可以使用此代码登录：${chatId}`,
  domainPurchasedFailed: (domain, buyDomainError) => `域名购买失败，请尝试其他名称。 ${domain} ${buyDomainError}`,
  noDomainRegistered: '您还没有购买任何域名。',
  registeredDomainList: domainsText => `以下是您购买的域名：\n${domainsText}`,
  comingSoon: `即将推出`,
  goBackToCoupon: '❌ 返回并应用优惠券',
  errorFetchingCryptoAddress: '获取加密货币地址时出错。请稍后再试。',
  paymentSuccessFul: '✅ 付款成功！您的订单正在处理。详细信息将很快提供。',
}

const phoneNumberLeads = ['💰📲 购买电话线索', '✅📲 验证电话线索']

const buyLeadsSelectCountry = Object.keys(areasOfCountry)
const buyLeadsSelectSmsVoice = ['短信 (价格为 20$/1000)', '语音 (价格为 0$/1000)']
const buyLeadsSelectArea = country => Object.keys(areasOfCountry?.[country])
const buyLeadsSelectAreaCode = (country, area) => {
  const codes = areasOfCountry?.[country]?.[area].map(c => format(countryCodeOf[country], c))
  return codes.length > 1 ? ['Mixed Area Codes'].concat(codes) : codes
}
const _buyLeadsSelectAreaCode = (country, area) => areasOfCountry?.[country]?.[area]
const buyLeadsSelectCnam = yesNo
const buyLeadsSelectCarrier = country => carriersOf[country]
const buyLeadsSelectAmount = ['1000', '2000', '3000', '4000', '5000']
const buyLeadsSelectFormat = ['本地格式', '国际格式']

const validatorSelectCountry = Object.keys(areasOfCountry)
const validatorSelectSmsVoice = ['短信 (价格为 20$/1000)', '语音 (价格为 0$/1000)']
const validatorSelectCarrier = country => carriersOf[country]
const validatorSelectCnam = yesNo
const validatorSelectAmount = ['ALL', '1000', '2000', '3000', '4000', '5000']
const validatorSelectFormat = ['本地格式', '国际格式']

const selectFormatOf = {
  本地格式: 'Local Format',
  国际格式: 'International Format',
}

//redSelectRandomCustom

const redSelectRandomCustom = ['随机短链接']

const redSelectProvider = ['Bit.ly $10', `Shortit（试用 ${FREE_LINKS}）`]

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
  BTC: '₿ 比特币 (BTC)',
  LTC: 'Ł 莱特币 (LTC)',
  DOGE: 'Ð 狗狗币 (DOGE)',
  BCH: 'Ƀ 比特币现金 (BCH)',
  ETH: 'Ξ 以太坊 (ETH)',
  TRON: '🌐 波场 (TRX)',
  'USDT (TRC20)': '₮ 泰达币 (USDT - TRC20)',
  'USDT (ERC20)': '₮ 泰达币 (USDT - ERC20)',
}

/////////////////////////////////////////////////////////////////////////////////////
const _bc = ['返回', '取消']

const payIn = {
  crypto: '加密货币',
  ...(HIDE_BANK_PAYMENT !== 'true' && { bank: '银行 ₦奈拉 + 卡🏦💳' }),
  wallet: '👛 钱包',
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
  en: '🇬🇧 英语',
  fr: '🇫🇷 法语',
  zh: '🇨🇳 中国人',
  hi: '🇮🇳 印地语',
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
  continueAtHostbay: '🚀 服务已迁移至 @Hostbay_bot 提供托管、域名、短信和网址服务。',
  redirectMessage: '🚀 服务已迁移至 @Hostbay_bot 提供托管、域名、短信和网址服务。',
  askPreferredLanguage: `🌍 为了确保一切都符合您的首选语言，请在下面选择一种：
  
  您随时可以在设置中更改您的语言。`,
  askValidLanguage: '请选择一个有效的语言：',
  welcomeMessage: `👋 欢迎来到 ${CHAT_BOT_NAME}！
我们很高兴您来到这里！🎉
让我们帮您快速开始，探索我们提供的所有精彩功能吧！🌟

设置过程简单快捷——让我们开始吧！🚀`,
  askUserEmail: '你的电子邮件是什么？让我们个性化您的体验吧！（例如，davidsen@gmail.com）',
  processUserEmail: `谢谢 😊 我们正在为您设置帐户。
  请稍等片刻，我们正在最终处理细节。 ⏳
   
  我们在后台工作。请按步骤操作！`,
  confirmUserEmail: `✨ 好消息！您的帐户已准备好！ 🎉💃🎉
  
  享受免费试用期的高级功能！`,
  termsAndCond: `📜 进行之前，请查看并接受我们的条款和条件。`,
  acceptTermMsg: `请接受 ${CHAT_BOT_NAME} 的条款和条件以继续使用。`,
  acceptTermButton: '✅ 接受',
  declineTermButton: '❌ 拒绝',
  viewTermsAgainButton: '🔄 查看条款',
  exitSetupButton: '❌ 退出设置',
  acceptedTermsMsg: `✅ 您已成功接受条款和条件！ 🎉
  您已准备好开始使用 ${CHAT_BOT_NAME}。让我们进入有趣的部分！ 🎯`,
  declinedTermsMsg: `⚠️ 您需要接受条款和条件才能继续使用 ${CHAT_BOT_NAME}。 
  请在您准备好的时候再次查看。`,
  userExitMsg: '用户按下了退出按钮。',
  termsAndCondMsg: `<h1>${CHAT_BOT_NAME} 使用条款</h1>
        <p><strong>生效日期：</strong>2022年1月1日</p>
        <p>使用 ${CHAT_BOT_NAME} 即表示您同意这些使用条款。</p>

        <h2>1. 条款接受</h2>
        <p>您必须年满 18 岁或获得监护人同意，并同意这些条款以及我们的隐私政策。</p>

        <h2>2. 提供的服务</h2>
        <p>我们提供域名注册、网站托管以及网站/应用程序设置支持。</p>

        <h2>3. 用户责任</h2>
        <p>提供准确的信息，避免非法活动，并保护您的 Telegram 账户安全。</p>

        <h2>4. 支付条款</h2>
        <p>所有支付均为最终支付，除非另有说明。未支付可能导致服务暂停。</p>

        <h2>5. 服务限制</h2>
        <p>我们可能会施加资源限制或因维护或技术问题而中断服务。</p>

        <h2>6. 终止</h2>
        <p>如有违规或未支付费用，我们可以终止服务。用户可以随时取消，但费用不予退还。</p>

        <h2>7. 责任</h2>
        <p>服务按“现状”提供。我们对数据丢失、中断或用户安全漏洞不承担责任。</p>

        <h2>8. 隐私</h2>
        <p>我们按照隐私政策管理您的数据，仅在法律要求时共享。</p>

        <h2>9. 条款变更</h2>
        <p>我们可能会更新这些条款，继续使用即表示您接受。</p>

        <h2>10. 联系</h2>
        <p>如需支持，请通过 <a href="${APP_SUPPORT_LINK}" target="_blank">${APP_SUPPORT_LINK}</a> 联系我们。</p>

        <p>使用 ${CHAT_BOT_NAME} 即表示您同意这些条款。谢谢！</p>`,
}

const termsAndConditionType = lang => ({
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: '查看条款和条件',
          web_app: {
            url: `${SELF_URL}/terms-condition?lang=${lang}`,
          },
        },
      ],
    ],
  },
})

const planOptions = ['每日', '每周', '每月']
const planOptionsOf = {
  每日: 'Daily',
  每周: 'Weekly',
  每月: 'Monthly',
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
          text: '进行支付',
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
      name: '入门计划',
      price: HOSTING_STARTER_PLAN_PRICE,
      duration: '30 天',
      storage: '10 GB SSD',
      bandwidth: '100 GB',
      domains: '无限制域名',
      emailAccounts: '5 个邮箱账户',
      databases: '1 个 MySQL 数据库',
      features: `完全访问 ${hostingType} 用于管理文件、数据库、电子邮件等。`,
      idealFor: '个人博客、小型企业网站或作品集。',
    },
    proPlan: {
      name: '专业计划',
      price: HOSTING_PRO_PLAN_PRICE,
      duration: '30 天',
      storage: '50 GB SSD',
      bandwidth: '500 GB',
      domains: '无限制域名',
      emailAccounts: '25 个邮箱账户',
      databases: '10 个 MySQL 数据库',
      features: `完全访问 ${hostingType}，配备高级工具用于备份、安全和分析。`,
      additionalFeatures: '免费网站迁移，每日备份。',
      idealFor: '中小型企业网站、电子商务网站。',
    },
    businessPlan: {
      name: '商务计划',
      price: HOSTING_BUSINESS_PLAN_PRICE,
      duration: '30 天',
      storage: '100 GB SSD',
      bandwidth: '无限制',
      domains: '无限制域名',
      emailAccounts: '无限制邮箱账户',
      databases: '无限制 MySQL 数据库',
      features: `完全访问 ${hostingType}，包括所有高级功能和优先支持。`,
      additionalFeatures: '免费网站迁移，每日备份，测试环境，增强安全功能。',
      idealFor: '大型企业、高流量网站以及需要更高灵活性的开发人员。',
    },
  }
}
const hostingPlansText = {
  plans: plans,
  generatePlanText: (hostingType, planKey) => {
    const plan = plans(hostingType)[planKey]
    return `
    🚀 <b>${plan.name}: $${plan.price}</b>
    
    <b>- 时长:</b> ${plan.duration}
    <b>- 存储空间:</b> ${plan.storage}
    <b>- 带宽:</b> ${plan.bandwidth}
    <b>- 域名:</b> ${plan.domains}
    <b>- 邮箱账户:</b> ${plan.emailAccounts}
    <b>- 数据库:</b> ${plan.databases}
    <b>- 免费 SSL:</b> 是
    <b>- ${hostingType} 功能:</b> ${plan.features}
    ${plan.additionalFeatures ? `<b>- 额外功能:</b> ${plan.additionalFeatures}` : ''}
    <b>- 适合:</b> ${plan.idealFor}`
  },
  generatePlanStepText: step => {
    const commonSteps = {
      buyText: '不错的选择！您需要一个新域名还是想使用现有的？',
      registerNewDomainText: '请输入您要注册的域名（例如：example.com）。',
      domainNotFound: '您输入的域名未找到。请确保输入正确或尝试使用其他域名。',
      useExistingDomainText: '请输入您的现有域名（例如：example.com）。',
      useExistingDomainNotFound: '您输入的域名与您的账户无关联。请检查输入是否正确或联系支持。',
      enterYourEmail: '请提供您的电子邮件地址以创建账户并发送收据。',
      invalidEmail: '请提供一个有效的电子邮件地址。',
      paymentConfirmation: '请确认交易以继续购买。',
      paymentSuccess: `我们正在验证您的付款。一旦确认，您将立即收到通知。感谢您的选择！`,
      paymentFailed: '付款失败，请重试。',
    }

    return `${commonSteps[step]}`
  },

  generateDomainFoundText: (websiteName, price) => `域名 ${websiteName} 可用！费用为 $${price}。`,
  generateExistingDomainText: websiteName => `您选择了 ${websiteName} 作为您的域名。`,
  domainNotFound: websiteName => `域名 ${websiteName} 不可用。`,
  nameserverSelectionText: websiteName => `请选择您想为 ${websiteName} 使用的域名服务器提供商。`,
  confirmEmailBeforeProceeding: email => `您确定要继续使用此电子邮件 ${email} 吗？`,

  generateInvoiceText: payload => `
<b>域名注册</b>
<b>- 域名： </b> ${payload.domainName}
<b>- 费用： </b> $${payload?.existingDomain ? '0（使用现有域名）' : payload.domainPrice}
  
<b>网站托管</b>
<b>- 时长： </b> 1 个月
<b>- 费用： </b> $${payload.hostingPrice}
  
<b>总金额：</b>
<b>- 优惠券折扣： </b> $${payload.couponDiscount}
<b>- USD： </b> $${payload?.couponApplied ? payload.newPrice : payload.totalPrice}
<b>- 税费： </b> $0.00
  
<b>付款条款</b>
这是一份预付款发票。请确保在 1 小时内完成付款，以便激活您的域名和托管服务。收到付款后，我们将立即为您激活服务。
`,

  showCryptoPaymentInfo: (priceCrypto, tickerView, address, plan) => `
请支付 ${priceCrypto} ${tickerView} 至以下地址：
  
<code>${address}</code>
  
请注意，完成加密货币交易可能需要最多 30 分钟。一旦交易确认，您将立即收到通知，并且您的 ${plan} 将顺利激活。
  
此致，
${CHAT_BOT_NAME}`,

  successText: (info, response) =>
    `这是您 ${info.hostingType} 的凭证 ${info.plan} 的信息：

域名： ${info.website_name}
用户名： ${response.username}
电子邮件： ${info.email}
密码： ${response.password}
网址： ${response.url}

<b>名称服务器</b>
- ${response.nameservers.ns1}
- ${response.nameservers.ns2}
  
您的 ${info.hostingType} 凭证已成功发送到您的电子邮件 ${info.email} 中。`,

  support: (plan, statusCode) => `设置过程中出现问题 ${plan} | ${statusCode}. 
                                              请联系支持 ${SUPPORT_USERNAME}.
                                              更多信息 ${TG_HANDLE}.`,

  bankPayDomain: (
    priceNGN,
    plan,
  ) => `请支付 ${priceNGN} NGN 并点击“付款”按钮。交易确认后，您将立即收到通知，并且您的 ${plan} 将无缝激活。

此致，
${CHAT_BOT_NAME}`,
}

const vpsBC = ['🔙 返回', '取消']

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
  hourly: '按小时',
  monthly: '每月',
  quaterly: '季度',
  annually: '每年',
}

const vpsPlanMenu = ['按小时', '每月', '季度', '每年']
const vpsConfigurationMenu = ['基本', '标准', '高级', '企业']
const vpsCpanelOptional = ['WHM', 'Plesk', '❌ 跳过控制面板']

const vpsPlanOf = {
  按小时: 'hourly',
  每月: 'monthly',
  季度: 'quaterly',
  每年: 'annually',
}

const vp = {
  of: vpsOptionsOf,
  back: '🔙 返回',
  skip: '❌ 跳过',
  cancel: '❌ 取消',

  askCountryForUser: `🌍 选择最佳区域，以获得最佳性能和最低延迟。

💡 低延迟 = 更快的响应时间。请选择最接近用户的区域，以获得最佳性能。`,
  chooseValidCountry: '请从列表中选择一个国家：',
  askRegionForUser: country => `📍 选择 ${country} 内的数据中心（价格可能因位置而异）。`,
  chooseValidRegion: '请从列表中选择有效的地区：',
  askZoneForUser: region => `📍 选择 ${region} 内的可用区。`,

  chooseValidZone: '请选择列表中的有效区域：',
  confirmZone: (region, zone) => `✅  您选择了${region}（${zone}）。您要继续选择此项吗？`,
  failedFetchingData: '获取数据时出错，请稍后再试。',
  confirmBtn: `✅ 确认选择`,

  askVpsDiskType: list => `💾 根据性能和预算选择您的存储类型：

${list?.map(item => `• ${item.description}`).join('\n')}`,

  chooseValidDiskType: '请选择有效的磁盘类型',

  askPlanType: plans => `💳 选择账单周期：

${plans
  .map(
    item =>
      `<strong>• ${item.type === 'Hourly' ? '⏳' : '📅'} ${item.type} –</strong> $${item.originalPrice} ${
        item.discount === 0 ? '(无折扣）' : `（包括 ${item.discount}% 折扣）`
      }`,
  )
  .join('\n')}`,
  planTypeMenu: vpsOptionsOf(vpsPlanMenu),
  hourlyBillingMessage: `⚠️ 按小时计费需要支付 $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD 可退款押金。此押金确保服务不中断，未使用部分可退款。

✅ 账单每小时从您的钱包余额中扣除。
🔹 月度许可证（Windows/WHM/Plesk）需提前支付。`,

  // 配置
  askVpsConfig: list => `⚙️ 根据您的需求选择 VPS 计划（提供按小时或按月计费）：
  
${list
  .map(
    config =>
      `<strong>• ${config.name} -</strong>  ${config.specs.vCPU} vCPU, ${config.specs.RAM}GB 内存, ${config.specs.disk}GB 硬盘`,
  )
  .join('\n')}`,

  validVpsConfig: '请选择一个有效的VPS配置：',

  configMenu: vpsOptionsOf(vpsConfigurationMenu),

  askForCoupon: '🎟️ 有优惠券代码吗？输入它可享受额外折扣（如适用），或者跳过此步骤。任何计费周期折扣已包含在内。',
  couponInvalid: `❌ 无效：代码已过期、不适用或输入错误。请重试。`,
  couponValid: amt => `✅ 有效：应用的折扣：-$${amt}。`,
  skipCouponwarning: `⚠️ 跳过意味着您以后无法再应用折扣。`,
  confirmSkip: '✅ 确认跳过',
  goBackToCoupon: '❌ 返回并应用优惠券',

  askVpsOS: price => `💡 默认操作系统：Ubuntu（Linux）（如果未进行选择）。
💻 选择操作系统（Windows Server 额外收费 $${price}/月）。  

<strong>💡 推荐: </strong>  
<strong>• Ubuntu –</strong> 适用于常规使用和开发  
<strong>• CentOS –</strong> 适用于企业级应用，稳定可靠  
<strong>• Windows Server –</strong> 适用于基于 Windows 的应用（+$${price}/月）`,
  chooseValidOS: `请选择可用列表中的有效操作系统：`,
  skipOSBtn: '❌ 跳过操作系统选择',
  skipOSwarning: '⚠️ 您的VPS将没有操作系统启动。您需要通过SSH或恢复模式手动安装一个。',

  askVpsCpanel: `🛠️ 选择控制面板以更轻松地管理服务器（可选.

<strong>• ⚙️ WHM –</strong> 推荐用于托管多个网站
<strong>• ⚙️ Plesk –</strong> 适用于管理个人网站和应用程序
<strong>• ❌ 跳过 –</strong> 不安装控制面板`,

  cpanelMenu: vpsOptionsOf(vpsCpanelOptional),
  noControlPanel: vpsCpanelOptional[2],
  skipPanelMessage: '⚠️ 将不会安装控制面板。您可以稍后手动安装。',
  validCpanel: '请选择一个有效的控制面板或跳过。',

  askCpanelOtions: (name, list) => `⚙️ 选择 ${
    name == 'whm' ? 'WHM' : 'Plesk Web Host Edition'
  } 许可证，或选择免费试用（有效期 ${name == 'whm' ? '15' : '7'} 天）。
  
💰 ${name == 'whm' ? 'WHM' : 'Plesk'} 许可证定价：

${list.map(item => `${name == 'whm' ? `<strong>• ${item.name} - </strong>` : ''}${item.label}`).join('\n')}`,

  trialCpanelMessage: panel =>
    `✅ ${panel.name == 'whm' ? 'WHM' : 'Plesk'} 免费试用（${panel.duration} 天）已激活。您可以随时联系支持进行升级。`,

  vpsWaitingTime: '⚙️ 正在获取详细信息... 这只需要一点时间。',
  failedCostRetrieval: '获取成本信息失败... 请稍后再试。',

  errorPurchasingVPS: plan => `在设置您的 ${plan} VPS 计划时出现问题。

请联系支持 ${SUPPORT_USERNAME}。
了解更多 ${TG_HANDLE}。`,

  generateBillSummary: vpsDetails => `<strong>📋 最终费用明细：</strong>

<strong>•📅 硬盘类型 –</strong> ${vpsDetails.diskType}
<strong>•🖥️ VPS 方案：</strong> ${vpsDetails.config.name}
<strong>•📅 计费周期 (${vpsDetails.plan} 方案) –</strong> $${vpsDetails.plantotalPrice} USD
<strong>•💻 操作系统许可证 (${vpsDetails.os ? vpsDetails.os.name : '未选择'}) –</strong> $${
    vpsDetails.selectedOSPrice
  } USD
<strong>•🛠️ 控制面板 (${
    vpsDetails.panel ? `${vpsDetails.panel.name == 'whm' ? 'WHM' : 'Plesk'} ${vpsDetails.panel.licenseName}` : '未选择'
  }) –</strong> $${vpsDetails.selectedCpanelPrice} USD
<strong>•🎟️ 优惠券折扣 –</strong> -$${vpsDetails.couponDiscount} USD
<strong>•🔄 自动续费 –</strong>  ${
    vpsDetails.plan === 'Hourly' ? '⏳ 按小时' : vpsDetails.autoRenewalPlan ? '✅ 启用' : '❌ 禁用'
  }

${
  vpsDetails.plan === 'Hourly'
    ? `注意：您的总费用中包含 $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD 作为预存款。在第一小时费率扣除后，剩余金额将返还至您的钱包。`
    : ''
}

<strong>💰 总计：</strong> $${
    vpsDetails.plan === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      : vpsDetails.totalPrice
  } USD

<strong>✅ 是否继续下单？</strong>`,
  no: '❌ 取消订单',
  yes: '✅ 确认订单',
  askPaymentMethod: '选择支付方式：',

  showDepositCryptoInfoVps: (priceCrypto, tickerView, address, vpsDetails) =>
    `请将 ${priceCrypto} ${tickerView} 汇款至\n\n<code>${address}</code>

请注意，密码货币交易可能需要最多 30 分钟才能完成。一旦交易确认，您将及时收到通知，您的 VPS 计划将被顺利激活。

此致,
${CHAT_BOT_NAME}`,

  extraMoney: '您的按小时计费计划的剩余金额已存入钱包。',
  paymentRecieved: `✅ 支付成功！您的 VPS 正在设置中。详细信息很快将可用，并会通过电子邮件发送给您以方便查看。`,
  paymentFailed: `❌ 支付失败。请检查您的支付方式或重试。`,

  lowWalletBalance: vpsName => `
您的 VPS 计划实例 ${vpsName} 已因余额不足而停止。

请充值您的钱包以继续使用 VPS 计划。`,

  vpsBoughtSuccess: (vpsDetails, response) =>
    `<strong>🎉 VPS [${response.label}] 已激活！</strong>

<strong>🔑 登录凭据:</strong>
  <strong>• IP:</strong> ${response.host}
  <strong>• 操作系统:</strong> ${vpsDetails.os ? vpsDetails.os.name : '未选择'}
  <strong>• 用户名:</strong> ${credentials.username}
  <strong>• 密码:</strong> ${credentials.password}（立即更改）。
    
📧 这些详细信息也已发送到您的注册电子邮件。请保管好它们。

⚙️ 控制面板安装（WHM/Plesk）
如果您订购了WHM或Plesk，安装正在进行中。控制面板登录详情将在设置完成后单独发送给您。

感谢您选择我们的服务
${CHAT_BOT_NAME}
`,
  vpsHourlyPlanRenewed: (vpsName, price) => `
您的 VPS 计划实例 ${vpsName} 已成功续订。
${price}$ 已从您的钱包中扣除。`,

  bankPayVPS: (
    priceNGN,
    plan,
  ) => `请点击“进行支付”以汇款 ${priceNGN} NGN。交易确认后，您将及时收到通知，您的 ${plan} VPS 计划将顺利激活。

此致,
${CHAT_BOT_NAME}`,

  askAutoRenewal: `🔄 启用自动续订，以确保服务不中断？  

🛑 续订前您将收到提醒，您可以随时禁用。`,
  enable: '✅ 启用',
  skipAutoRenewalWarming: expiresAt =>
    `⚠️ 您的 VPS 将于 ${new Date(expiresAt).toLocaleDateString('zh-CN').replace(/\//g, '-')} ${new Date(
      expiresAt,
    ).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} 到期，服务可能会中断。`,

  generateSSHKeyBtn: '✅ 生成新密钥',
  linkSSHKeyBtn: '🗂️ 关联现有密钥',
  skipSSHKeyBtn: '❌ 跳过（使用密码登录）',
  noExistingSSHMessage: '🔑 未检测到 SSH 密钥。您想生成新的 SSH 密钥以确保安全访问，还是使用密码登录（安全性较低）？',
  existingSSHMessage: '🔑 您已有 SSH 密钥。请选择一个选项：',
  confirmSkipSSHMsg: `⚠️ 警告：密码登录的安全性较低，容易受到攻击。
🔹 我们强烈建议使用 SSH 密钥。您确定要继续吗？`,
  confirmSkipSSHBtn: '✅ 仍然继续',
  setUpSSHBtn: '🔄 设置 SSH 密钥',
  sshLinkingSkipped: '❌ SSH 密钥关联已跳过，未进行任何更改。',
  newSSHKeyGeneratedMsg: name => `✅ SSH 密钥（${name}）已创建。
⚠️ 请妥善保存此密钥 – 以后可以再次检索。`,
  selectSSHKey: '🗂️ 选择一个现有的 SSH 密钥以关联到您的 VPS：',
  uploadNewKeyBtn: '➕ 上传新密钥',
  cancelLinkingSSHKey: `❌ SSH 密钥关联已取消，未进行任何更改。`,
  selectValidSShKey: '请选择列表中的有效 SSH 密钥。',
  sshKeySavedForVPS: name => `✅ SSH 密钥（${name}）将关联到新的 VPS。`,
  askToUploadSSHKey: `📤 请上传您的 SSH 公钥（.pub 文件）或在下方粘贴密钥。`,
  failedGeneratingSSHKey: '无法生成新的 SSH 密钥。请重试或使用其他方法。',
  newSSHKeyUploadedMsg: name => `✅ SSH 密钥（${name}）已成功上传并将关联到 VPS。`,
  fileTypePub: '文件类型应为 .pub',

  vpsList: list => `<strong>🖥️ 活跃的 VPS 实例：</strong>

${list
  .map(vps => `<strong>• ${vps.name} :</strong> ${vps.status === 'RUNNING' ? '🟢' : '🔴'} ${vps.status}`)
  .join('\n')}
`,
  noVPSfound: '没有活跃的 VPS 实例。请创建一个新的。',
  selectCorrectOption: '请选择列表中的一个选项',
  selectedVpsData: data => `<strong>🖥️ VPS ID：</strong> ${data.name}

<strong>• 计划：</strong> ${data.planDetails.name}
<strong>• vCPUs：</strong> ${data.planDetails.specs.vCPU} | RAM: ${data.planDetails.specs.RAM} GB | 硬盘：${
    data.planDetails.specs.disk
  } GB (${data.diskTypeDetails.type})
<strong>• 操作系统：</strong> ${data.osDetails.name}
<strong>• 控制面板：</strong> ${
    data.cPanelPlanDetails && data.cPanelPlanDetails.type ? data.cPanelPlanDetails.type : '无'
  }
<strong>• 状态：</strong> ${data.status === 'RUNNING' ? '🟢' : '🔴'} ${data.status}
<strong>• 自动续费：</strong> ${data.autoRenewable ? '已启用' : '已禁用'}
<strong>• IP 地址：</strong> ${data.host}`,
  stopVpsBtn: '⏹️ 停止',
  startVpsBtn: '▶️ 启动',
  restartVpsBtn: '🔄 重启',
  deleteVpsBtn: '🗑️ 删除',
  subscriptionBtn: '🔄 订阅',
  VpsLinkedKeysBtn: '🔑 SSH 密钥',
  confirmChangeBtn: '✅ 确认',

  confirmStopVpstext: name => `⚠️ 您确定要停止 VPS <strong>${name}</strong> 吗？`,
  vpsBeingStopped: name => `⚙️ 请稍等，您的 VPS (${name}) 正在停止中`,
  vpsStopped: name => `✅ VPS (${name}) 已停止。`,
  failedStoppingVPS: name => `❌ 停止 VPS (${name}) 失败。

请稍后再试。`,
  vpsBeingStarted: name => `⚙️ 请稍等，您的 VPS (${name}) 正在启动中`,
  vpsStarted: name => `✅ VPS (${name}) 现已运行。`,
  failedStartedVPS: name => `❌ 启动 VPS (${name}) 失败。

请稍后再试。`,
  vpsBeingRestarted: name => `⚙️ 请稍等，您的 VPS (${name}) 正在重启中`,
  vpsRestarted: name => `✅ VPS (${name}) 已成功重启。`,
  failedRestartingVPS: name => `❌ 重启 VPS (${name}) 失败。

请稍后再试。`,
  confirmDeleteVpstext: name => `⚠️ 警告：删除此 VPS ${name} 是永久性的，所有数据将丢失。
  • 未使用的订阅时间不予退款。
  • 自动续订将被取消，不会产生额外费用。
  
您确定要继续吗？`,
  vpsBeingDeleted: name => `⚙️ 请稍等，您的 VPS (${name}) 正在删除中`,
  vpsDeleted: name => `✅ VPS (${name}) 已永久删除。`,
  failedDeletingVPS: name => `❌ 删除 VPS (${name}) 失败。

请稍后再试。`,

  upgradeVpsBtn: '⬆️ 升级',
  upgradeVpsPlanBtn: '⬆️ VPS 计划',
  upgradeVpsDiskBtn: '📀 磁盘类型',
  upgradeVpsDiskTypeBtn: '💾 升级磁盘类型',
  upgradeVPS: '选择升级类型',
  upgradeOptionVPSBtn: to => {
    return `🔼 升级到 ${to}`
  },
  upgradeVpsPlanMsg: options => `⚙️ 选择一个新计划以扩展您的 VPS 资源。
💡 升级增加 vCPUs、RAM 和存储，但无法撤销。

📌 可用的升级：
${options
  .map(
    planDetails =>
      `<strong>• ${planDetails.from} ➡ ${planDetails.to} –</strong> $${planDetails.monthlyPrice}/月 ($${planDetails.hourlyPrice}/小时)`,
  )
  .join('\n')}

💰 账单通知：您的当前计划将因未使用的天数而获得信用，并且新费率将在账单周期的其余部分应用（按比例调整）。`,

  alreadyEnterprisePlan: '⚠️ 您已在最高可用计划（企业版）上。无法进行进一步的升级。',

  alreadyHighestDisk: vpsData => `⚠️ 您已在最高可用磁盘（${vpsData.diskTypeDetails.type}）上。无法进行进一步的升级。`,
  newVpsDiskBtn: type => `升级到 ${type}`,
  upgradeVpsDiskMsg: upgrades => `💾 升级您的存储类型以获得更好的性能。
⚠️ 磁盘升级是永久性的，不能降级。

📌 可用选项：
${upgrades.map(val => `<strong>• ${val.from} ➡ ${val.to} –</strong> +$${val.price}/${val.duration}`).join('\n')}

💰 账单通知：如果在账单周期中途应用升级，将按比例调整当前账单周期未使用的部分。`,
  upgradePlanSummary: (newData, vpsDetails, lowBal) => `<strong>📜 订单摘要：</strong>

<strong>• VPS ID：</strong> ${vpsDetails.name}
<strong>• 旧计划：</strong> ${newData.upgradeOption.from}
<strong>• 新计划：</strong> ${newData.upgradeOption.to}
<strong>• 计费周期：</strong> ${newData.billingCycle}
<strong>• 新计费费率：</strong> $${newData.totalPrice} USD${
    newData.billingCycle === 'Hourly' ? '/小时' : '（已应用按比例调整）'
  }
<strong>• 生效日期：</strong> 立即生效
${
  lowBal
    ? `
💡 注意：您的总费用中包含 $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD 预存款。在扣除首小时费用后，剩余的预存款将存入您的钱包。
`
    : ''
}
<strong>• 总价格：</strong> $${lowBal ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE : newData.totalPrice} USD

<strong>✅ 是否继续下单？</strong>`,

  upgradeDiskSummary: (newData, vpsDetails, lowBal) => `<strong>📜 订单摘要：</strong>

<strong>• VPS ID：</strong> ${vpsDetails.name}
<strong>• 旧磁盘类型：</strong> ${newData.upgradeOption.from}
<strong>• 新磁盘类型：</strong> ${newData.upgradeOption.to}
<strong>• 计费周期：</strong> ${newData.billingCycle}
<strong>• 新计费费率：</strong> $${newData.totalPrice} USD${
    newData.billingCycle === 'Hourly' ? '/小时' : '（已应用按比例调整）'
  }
${
  lowBal
    ? `
注意：您的总额包含 $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD 的押金。扣除第一个小时费率后，剩余押金将计入您的钱包。
`
    : ''
}
<strong>• 总价格：</strong> $${lowBal ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE : newData.totalPrice} USD

<strong>✅ 是否继续下单？</strong>`,

  vpsSubscriptionData: (vpsData, planExpireDate, panelExpireDate) => `<strong>🗂️ 您的有效订阅：</strong>

<strong>• VPS ${vpsData.name} </strong> – 到期日期：${planExpireDate}  (自动续订：${
    vpsData.autoRenewable ? '已启用' : '已禁用'
  })
<strong>• 控制面板 ${vpsData?.cPanelPlanDetails ? vpsData.cPanelPlanDetails.type : '：未选择'} </strong> ${
    vpsData?.cPanelPlanDetails
      ? `${vpsData?.cPanelPlanDetails.status === 'active' ? '- 到期日期：' : '- 已过期：'}${panelExpireDate}`
      : ''
  } `,

  manageVpsSubBtn: '🖥️ 管理VPS订阅',
  manageVpsPanelBtn: '🛠️ 管理控制面板订阅',

  vpsSubDetails: (data, date) => `<strong>📅 VPS订阅详情：</strong>

<strong>• VPS ID：</strong> ${data.name}
<strong>• 计划：</strong> ${data.planDetails.name}
<strong>• 当前到期日期：</strong> ${date}
<strong>• 自动续订：</strong> ${data.autoRenewable ? '启用' : '禁用'}`,

  vpsCPanelDetails: (data, date) => `<strong>📅 控制面板订阅详情：</strong>

<strong>• 关联的 VPS ID：</strong> ${data.name}
<strong>• 控制面板类型：</strong> ${data.cPanelPlanDetails.type} (${data.cPanelPlanDetails.name})
<strong>• 当前到期日期：</strong> ${date}
<strong>• 自动续订：</strong> ${data.autoRenewable ? '已启用' : '已禁用'}
`,

  vpsEnableRenewalBtn: '🔄 启用自动续订',
  vpsDisableRenewalBtn: '❌ 禁用自动续订',
  vpsPlanRenewBtn: '📅 立即续订',
  unlinkVpsPanelBtn: '❌ 取消与VPS的链接',
  bankPayVPSUpgradePlan: (priceNGN, vpsDetails) =>
    `请点击下方的“付款”按钮支付 ${priceNGN} NGN。一旦交易确认，您将立即收到通知，您的新 ${vpsDetails.upgradeOption.to} VPS 方案将无缝激活。`,

  bankPayVPSUpgradeDisk: (priceNGN, vpsDetails) =>
    `请通过点击“付款”来支付 ${priceNGN} NGN。交易确认后，您将立即收到通知，您的VPS计划将以新磁盘类型 ${vpsDetails.upgradeOption.toType} 配置无缝激活。`,

  showDepositCryptoInfoVpsUpgrade: (priceCrypto, tickerView, address) =>
    `请将 ${priceCrypto} ${tickerView} 转账到\n\n<code>${address}</code>

请注意，加密交易可能需要最多30分钟才能完成。交易确认后，您将立即收到通知，您的新VPS计划将无缝激活。

此致敬礼，
${CHAT_BOT_NAME}`,

  linkVpsSSHKeyBtn: '➕ 关联新密钥',
  unlinkSSHKeyBtn: '❌ 取消关联密钥',
  downloadSSHKeyBtn: '⬇️ 下载密钥',

  noLinkedKey: name => `⚠️ 当前没有SSH密钥与该VPS [${name}] 关联。

请将SSH密钥关联到您的账户，以启用安全访问。`,

  linkedKeyList: (list, name) => `🗂️ 与VPS ${name} 关联的SSH密钥：

${list.map(val => `<strong>• ${val}</strong>`).join('\n')}`,

  unlinkSSHKeyList: name => `🗂️ 选择一个SSH密钥从VPS [${name}] 中移除：`,

  confirmUnlinkKey: data => `⚠️ 确定要将 [${data.keyForUnlink}] 从 VPS [${data.name}] 解绑吗？`,
  confirmUnlinkBtn: '✅ 确认解绑',
  keyUnlinkedMsg: data => `✅ SSH 密钥 [${data.keyForUnlink}] 已成功从 VPS [${data.name}] 解绑。`,
  failedUnlinkingKey: data => `❌ SSH 密钥解绑失败（VPS: ${data.name}）。 

请稍后重试。`,

  userSSHKeyList: name => `🗂️ 选择一个 SSH 密钥以链接到 VPS [${name}]：`,
  noUserKeyList: `🔑 未检测到 SSH 密钥。是否要上传新的 SSH 密钥？`,
  linkKeyToVpsSuccess: (key, name) => `✅ SSH 密钥 [${key}] 成功链接到 VPS [${name}]。`,
  failedLinkingSSHkeyToVps: (key, name) => `❌ SSH 密钥 [${key}] 绑定到 VPS (${name}) 失败。 

请稍后重试。`,

  selectSSHKeyToDownload: '🗂️ 请选择要下载的 SSH 密钥：',

  disabledAutoRenewal: (data, expiryDate) => `⚠️ 自动续订已禁用。您的 VPS 将于 ${expiryDate} 过期，除非手动续订。
✅ 自动续订已成功禁用。`,

  enabledAutoRenewal: (data, expiryDate) => `✅ 自动续订已启用。您的 VPS 将于 ${expiryDate} 自动续订。`,

  renewVpsPlanConfirmMsg: (data, vpsDetails, expiryDate, lowBal) => `<strong>📜 发票摘要</strong>

<strong>• VPS ID：</strong> ${vpsDetails.name}
<strong>• 计划：</strong> ${vpsDetails.planDetails.name}
<strong>• 计费周期：</strong> ${vpsDetails.billingCycleDetails.type}
<strong>• 当前到期日期：</strong> ${expiryDate}
<strong>• 应付金额：</strong> ${data.totalPrice} USD

${
  lowBal
    ? `注意：您的总金额中包含 $${VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE} USD 的押金。第一小时费用扣除后，剩余押金将退还到您的钱包。`
    : ''
}

<strong>• 总价：</strong> $${
    lowBal
      ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
      : data.totalPrice
  } USD

<strong>💳 是否继续续订 VPS？</strong>`,

  payNowBtn: '✅ 立即支付',

  vpsChangePaymentRecieved: `✅ 付款成功！您的 VPS 正在配置中，详细信息将很快提供。`,

  bankPayVPSRenewPlan: priceNGN =>
    `请点击下方的“支付”按钮支付 ${priceNGN} NGN。一旦交易确认，您将立即收到通知，您的 VPS 计划将被激活并续订。`,

  renewVpsPanelConfirmMsg: (data, panelDetails, date) => `<strong>💳 是否继续续订控制面板？</strong>

<strong>📜 发票摘要</strong>
  <strong>• 关联的 VPS ID：</strong> ${data.name}
  <strong>• 控制面板：</strong> ${panelDetails.type}
  <strong>• 续订周期：</strong> ${panelDetails.durationValue}${' '}个月
  <strong>• 当前到期日期：</strong> ${date}
  <strong>• 应付金额：</strong> ${data.totalPrice} USD`,

  bankPayVPSRenewCpanel: (priceNGN, vpsDetails) =>
    `请点击下方的“支付”按钮支付 ${priceNGN} NGN。一旦交易确认，您将立即收到通知，您的 VPS 计划将被激活，并且 ${vpsDetails.cPanelPlanDetails.type} 控制面板将被续订。`,

  vpsUnlinkCpanelWarning: vpsDetails =>
    `⚠️ 警告：取消关联将从 VPS ${vpsDetails.name} 中移除 ${vpsDetails.cPanel} 许可证，您将无法使用其功能。是否继续？`,

  unlinkCpanelConfirmed: data => `✅ 控制面板 ${data.cPanel} 已成功从 VPS ${data.name} 取消关联。`,

  errorUpgradingVPS: vpsName => `升级 VPS 计划 ${vpsName} 时出现错误。

请联系支持 ${SUPPORT_USERNAME}。
了解更多信息 ${TG_HANDLE}。`,

  vpsUpgradePlanTypeSuccess: vpsDetails => `
✅ VPS ${vpsDetails.name} 已成功升级至 ${vpsDetails.upgradeOption.to}。您的新资源现已可用。`,

  vpsUpgradeDiskTypeSuccess: vpsDetails =>
    `✅ VPS ${vpsDetails.name} 的磁盘已成功升级至 ${vpsDetails.upgradeOption.to}。您的新磁盘类型现已激活。`,

  vpsRenewPlanSuccess: (vpsDetails, expiryDate) =>
    `✅ VPS订阅 ${vpsDetails.name} 已成功续订！

• 新到期日期：${expiryDate}
`,
  vpsRenewCPanelSuccess: (vpsDetails, expiryDate) =>
    `✅ ${vpsDetails.name} 的控制面板订阅已成功续订！

• 新到期日期：${expiryDate}
`,
}

const zh = {
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
  zh,
}
