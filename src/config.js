const serverBaseUrl = `${process.env.NODE_ENV === "production" ?
  "https://appalti190.herokuapp.com" :
  "http://localhost:5000"
}`;

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
  service: {
    endpoint: `${serverBaseUrl}/`
  },
  checkout: {
    endpoint: `${serverBaseUrl}/create-checkout-session`,
  },
  api: {
    version: "1", // semver syntax
    endpoint: `${serverBaseUrl}/api`,
    headers: {
      "Content-Type": "application/json",
    },
    backendType: "NodeJsExpress", // NodeJsExpress / SpringBoot
    rolesNamesDefault: [ "user" ],
  },
  languages: {
    supported: {
      "en": { icon: "🇬🇧" },
      "fr": { icon: "🇫🇷" },
      "it": { icon: "🇮🇹" },
    },
    fallback: "it",
  },
  ui: {
    userCanForceTabChange: true,
    // sounds: {
    //   buttonClick,
    // },
    footerHeight: "1.5rem",
    extraSmallWatershed: 600,
    mobileDesktopWatershed: 900,
  },
  federatedSigninProviders: [ // we currently handle "Facebook", "Google"
    //"Facebook",
    //"Google",
  ],
  oauthRedirectSignInLocal: "http://localhost:5000/",
  oauthRedirectSignInPublic: "https://appalti190.arsistemi.it/",
  oauthRedirectSignOutLocal: "http://localhost:5000/",
  oauthRedirectSignOutPublic: "https://appalti190.arsistemi.it/",
  data: {
    templateDownloadName: "Appalti190.ots",
    templateDownloadLink: "/data/Appalti190.ots",
  },
};
