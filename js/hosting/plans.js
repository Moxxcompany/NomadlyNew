const CHAT_BOT_NAME = process.env.CHAT_BOT_NAME
const TG_HANDLE = process.env.TG_HANDLE
const SUPPORT_USERNAME = process.env.SUPPORT_USERNAME

const HOSTING_STARTER_PLAN_PRICE = parseFloat(process.env.HOSTING_STARTER_PLAN_PRICE)
const HOSTING_PRO_PLAN_PRICE = parseFloat(process.env.HOSTING_PRO_PLAN_PRICE)
const HOSTING_BUSINESS_PLAN_PRICE = parseFloat(process.env.HOSTING_BUSINESS_PLAN_PRICE)

const plans = (hostingType)=> {
  return {
    starterPlan: {
      name: 'Starter Plan',
        price: HOSTING_STARTER_PLAN_PRICE,
        duration: '30 days',
        storage: '10 GB SSD',
        bandwidth: '100 GB',
        domains: 'Unlimited Domains',
        emailAccounts: '5 email accounts',
        databases: '1 MySQL database',
        features: `Full access to ${hostingType} for managing files, databases, emails, etc.`,
        idealFor: 'Personal blogs, small business websites, or portfolios.',
    },
    proPlan: {
      name: 'Pro Plan',
        price: HOSTING_PRO_PLAN_PRICE,
        duration: '30 days',
        storage: '50 GB SSD',
        bandwidth: '500 GB',
        domains: 'Unlimited Domains',
        emailAccounts: '25 email accounts',
        databases: '10 MySQL databases',
        features: `Full access to ${hostingType} with advanced tools for backups, security, and analytics.`,
        additionalFeatures: 'Free website migration, daily backups.',
        idealFor: 'Small to medium-sized business websites, e-commerce sites.',
    },
    businessPlan: {
      name: 'Business Plan',
        price: HOSTING_BUSINESS_PLAN_PRICE,
        duration: '30 days',
        storage: '100 GB SSD',
        bandwidth: 'Unlimited',
        domains: 'Unlimited domains',
        emailAccounts: 'Unlimited email accounts',
        databases: 'Unlimited MySQL databases',
          features: `Full access to ${hostingType} with all advanced features, including priority support.`,
        additionalFeatures: 'Free website migration, daily backups, staging environment, enhanced security features.',
        idealFor: 'Large businesses, high-traffic websites, and developers needing more flexibility.',
    },
  }
}

const generatePlanText = (hostingType, planKey) => {
  const plan = plans(hostingType)[planKey]
  return `
🚀 <b>${plan.name}: $${plan.price}</b>

<b>- Duration:</b> ${plan.duration}
<b>- Storage:</b> ${plan.storage}
<b>- Bandwidth:</b> ${plan.bandwidth}
<b>- Domains:</b> ${plan.domains}
<b>- Email Accounts:</b> ${plan.emailAccounts}
<b>- Databases:</b> ${plan.databases}
<b>- Free SSL:</b> Yes
<b>- ${hostingType} Features:</b> ${plan.features}
${plan.additionalFeatures ? `<b>- Additional Features:</b> ${plan.additionalFeatures}` : ''}
<b>- Ideal for:</b> ${plan.idealFor}`
}

const generatePlanStepText = step => {
  const commonSteps = {
    buyText: 'Great choice! Do you need a new domain or want to use an existing one?',
    registerNewDomainText: 'Please enter the domain name you want to register (e.g., example.com).',
    domainNotFound:
      'The domain you entered could not be found. Please ensure the right domain or try using a different one.',
    useExistingDomainText: 'Please enter your existing domain name (e.g., example.com).',
    useExistingDomainNotFound:
      'The domain you entered is not associated with your account. Please ensure you are using the correct domain or contact support for assistance.',
    enterYourEmail: 'Please provide your email address to create your account and send your receipt.',
    invalidEmail: 'Please provide a valid email',
    paymentConfirmation: 'Please confirm the transaction to proceed with your purchase.',
    paymentSuccess: `We are verifying your payment. You will be promptly notified as soon as it is confirmed. Thank you for choosing us!`,
    paymentFailed: 'Payment failed. Please try again.',
  }

  return `${commonSteps[step]}`
}

const generateDomainFoundText = (websiteName, price) =>
  `The domain ${websiteName} is available!. The cost is $${price}.`
const generateExistingDomainText = websiteName => `You have selected ${websiteName} as your domain.`
const domainNotFound = websiteName => `The domain ${websiteName} is not available.`
const nameserverSelectionText = websiteName => `Please select the nameserver provider you would like to use for ${websiteName}.`
const confirmEmailBeforeProceeding = email => `Are you sure you want to proceed with this ${email} email?`

const generateInvoiceText = payload => `
<b>Domain Registration</b>
<b>- Domain: </b> ${payload.domainName}
<b>- Price: </b> $${payload?.existingDomain ? '0 (using existing domain)' : payload.domainPrice}

<b>Web Hosting</b>
<b>- Duration: </b> 1 Month
<b>- Price: </b> $${payload.hostingPrice}

<b>Total Amount Due:</b>
<b>- Coupon Discount: </b> $${payload.couponDiscount}
<b>- USD: </b> $${payload?.couponApplied ? payload.newPrice : payload.totalPrice}
<b>- Tax: </b> $0.00

<b>Payment Terms</b>
This is a prepayment invoice. Please ensure payment is completed within 1 hr to activate your domain and hosting services. Once payment is received, we will proceed with the activation of your service.
`

const showCryptoPaymentInfo = (priceCrypto, tickerView, address, plan) => `
Please remit ${priceCrypto} ${tickerView} to

<code>${address}</code>

Please note, crypto transactions can take up to 30 minutes to complete. Once the transaction has been confirmed, you will be promptly notified, and your ${plan} will be seamlessly activated.

Best regards,
${CHAT_BOT_NAME}`

const successText = (info, response) =>
  `Here are your ${info.hostingType} Credentials for ${info.plan}:

Domain: ${info.website_name}
Username: ${response.username}
Email: ${info.email}
Password: ${response.password}
URL: ${response.url}

<b>Nameservers</b>
  - ${response.nameservers.ns1}
  - ${response.nameservers.ns2}
  
Your ${info.hostingType} credentials has been successfully sent to your email ${info.email} as well`

const support = (plan, statusCode) => `Something went wrong while setting up your ${plan}|${statusCode}. 
                                              Please contact support ${SUPPORT_USERNAME}.
                                              Discover more ${TG_HANDLE}.`

const bankPayDomain = (priceNGN, plan) => `Please remit ${priceNGN} NGN by clicking “Make Payment” below. Once the transaction has been confirmed, you will be promptly notified, and your ${plan} will be seamlessly activated.

Best regards,
${CHAT_BOT_NAME}`

module.exports = {
  generatePlanText,
  generatePlanStepText,
  generateDomainFoundText,
  generateExistingDomainText,
  generateInvoiceText,
  nameserverSelectionText,
  confirmEmailBeforeProceeding,
  showCryptoPaymentInfo,
  domainNotFound,
  successText,
  support,
  bankPayDomain,
}
