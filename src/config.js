module.exports = {
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
  display: "standalone", // for manifest
  api: {
    version: "1", // semver syntax
    endpoint: {
      development: "http://localhost:5000/api",
      production: "https://appalti190.herokuapp.com/api",
    },
    headers: {
      "Content-Type": "application/json",
      "Content-Type-BACKUP": "x-www-form-urlencoded",
    },
    //redirect: "follow",
    backendType: "NodeJsExpress", // NodeJsExpress / SpringBoot
  },
  languages: {
    supported: {
      "en": { icon: "🇬🇧" },
      "it": { icon: "🇮🇹" },
    },
    fallback: "it",
  },
  ui: {
    userCanForceTabChange: true,
    // sounds: {
    //   buttonClick,
    // },
  },
  footerHeight: "1.5rem",
  extraSmallWatershed: 600,
  mobileDesktopWatershed: 900,
  federatedSigninProviders: [ // we currently handle "Facebook", "Google"
    //"Facebook",
    //"Google",
  ],
  oauthRedirectSignInLocal: "http://localhost:5000/",
  oauthRedirectSignInPublic: "https://appalti190.arsistemi.it/",
  oauthRedirectSignOutLocal: "http://localhost:5000/",
  oauthRedirectSignOutPublic: "https://appalti190.arsistemi.it/",
  debugAwsAmplify: false,
  indexedDb: {
    name: 'sw-background-push-messages',
    version: 1,
    objectStoresMeta: [
      {
        store: 'messages',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'name', keypath: 'name', options: { unique: false } },
          { name: 'email', keypath: 'email', options: { unique: false } }
        ]
      }
    ]
  },
  data: {
    templateDownloadName: "Appalti190.ots",
    templateDownloadLink: "/data/Appalti190.ots",
  },
};
