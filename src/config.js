module.exports = {
  "companyName": "Sistemi Solari",
  "companyHomeSiteName": "sistemisolari.com",
  "companyHomeSiteUrl": "https://www.sistemisolari.com",
  "companyOwner": "Marco Solari",
  "companyOwnerFiscalCode": "SLRMRC61M31L219Y",
  "companyOwnerStreetAddress": "Corso Quintino Sella, 92/43",
  "companyOwnerCity": "Torino",
  "companyOwnerProvince": "TO",
  "companyOwnerZipCode": "10132",
  "companyOwnerPhone": "+39 333 6480983",
  "companyOwnerEmail": "marcosolari@gmail.com",
  "appName": "quiccasa",
  "appTitle": "Quiccasa",
  "appSiteUrl": "quiccasa.sistemisolari.com",
  "startUrl": ".",
  "display": "standalone",
  "spinner": {
    "delay": 100,
    "type": "Audio",
    "color": "darkred",
    "size": 200,
    "opacity": .48,
  },
  "footerHeight": "1.5rem",
  "extraSmallWatershed": 600,
  "mobileDesktopWatershed": 900,
  "federatedSigninProviders": [ // we currently handle "Facebook", "Google"
    //"Facebook", // does not work yet
    "Google",
  ],
  "oauth": {
    //"HostedUIDomain": "quiccasa.sistemisolari.com",
    "domain": "auth.sistemisolari.com",
    "scope": [ "phone", "email", "profile", "openid", "aws.cognito.signin.user.admin" ],
    "responseType": "code",
  },
  "oauthRedirectSignInLocal": "http://localhost:3000/",
  "oauthRedirectSignInPublic": "https://quiccasa.sistemisolari.com/",
  "oauthRedirectSignOutLocal": "http://localhost:3000/",
  "oauthRedirectSignOutPublic": "https://quiccasa.sistemisolari.com/",
  "debugAwsAmplify": false,
};