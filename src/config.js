const serverBaseUrl = `${process.env.NODE_ENV === "production" ?
  "https://appalti190.herokuapp.com" :
  "http://localhost:5000"
}`;

const config = {
  companyName: "AR Sistemi",
  companyHomeSiteName: "arsistemi.it",
  companyHomeSiteUrl: "https://www.arsistemi.it",
  companyOwner: "Antonio Rossi & Marco Solari",
  companyOwnerFiscalCode: "SLRMRC61M31L219Y",
  companyOwnerStreetAddress: "Strada di Reaglie, 18",
  companyOwnerCity: "Torino",
  companyOwnerProvince: "TO",
  companyOwnerZipCode: "10132",
  companyOwnerPhone: "+39 333 6480983",
  companyOwnerEmail: "marcosolari@gmail.com",
  appName: "appalti190",
  appTitle: "Appalti190",
  appSiteUrl: "appalti190.arsistemi.it",
  appTermsValidityStartDate: "01-01-2022",
  referenceLawName: "LEGGE 6 novembre 2012, n. 190",
  display: "standalone", // for manifest
  service: {
    endpoint: `${serverBaseUrl}/`
  },
  checkout: {
    endpoint: `${serverBaseUrl}/createCheckoutSession`,
  },
  api: {
    version: "1", // semver syntax
    endpoint: `${serverBaseUrl}/api`,
    headers: {
      "Content-Type": "application/json",
    },
    backendType: "NodeJsExpress", // NodeJsExpress / SpringBoot
    rolesNamesDefault: [ "user" ],
    planNameDefault: "free",
  },
  languages: {
    supported: {
      "en": { icon: "🇬🇧" },
      "fr": { icon: "🇫🇷" },
      "it": { icon: "🇮🇹" },
    },
    default: "it",
  },
  currency: {
    default: "€",
  },
  ui: {
    userCanForceTabChange: false,
    // sounds: {
    //   buttonClick,
    // },
    extraSmallWatershed: 600,
    mobileDesktopWatershed: 900,
    toolbarHeight: 90,
    tabbarHeight: 100,
    footerHeight: 90,
    //footerHeight: "1.5rem",
  },
  federatedSigninProviders: [ // we currently handle "Facebook", "Google"
    //"Facebook",
    //"Google",
  ],
  oauthRedirectSignInLocal: "http://localhost:5000/",
  oauthRedirectSignInPublic: "https://appalti190.arsistemi.it/",
  oauthRedirectSignOutLocal: "http://localhost:5000/",
  oauthRedirectSignOutPublic: "https://appalti190.arsistemi.it/",
  support: {
    email: "nccnygv645@nefvfgrzv.vg", // emailScramble.encode(appalti190 @ arsistemi dot it),
    phone: "+39 347 7307209",
    freePlan: {
      emailMaximumAnswerHoursDelay: 48,
    },
    classicPlan: {
      emailMaximumAnswerHoursDelay: 4,
    },
    unlimitedPlan: {
      emailMaximumAnswerHoursDelay: 1,
    },
  },
  data: {
    templateDownloadUrl: "/data/Appalti190.ots",
  },
};

module.exports = config;
//export default config;