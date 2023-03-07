import React, { Suspense, lazy } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../libs/I18n";

const Home = lazy(() => import("./Home"));
const Support = lazy(() => import("./Support"));
const SignUp = lazy(() => import("./auth/SignUp")); 
const SignIn = lazy(() => import("./auth/SignIn"));
const SignOut = lazy(() => import("./auth/SignOut"));
const Profile = lazy(() => import("./auth/Profile"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const Notifications = lazy(() => import("./Notifications"));
const NotFound = lazy(() => import("./NotFound"));
const TermsOfUse = [];
      TermsOfUse["en"] = lazy(() => import("./legal/en/TermsOfUse"));
      TermsOfUse["it"] = lazy(() => import("./legal/it/TermsOfUse"));
const Legal = lazy(() => import("./legal/legal"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const PaymentResponse = lazy(() => import("./PaymentResponse"));


function Routes() {
  const location = useLocation();
  const { i18n } = useTranslation();

/*
  // check for error parameters in location url
  useEffect(() => {
    const search = queryString.parse(location.search);
    if (search.error) {
      toast.warning(`Social login did not work, sorry.\n${search.error}: ${search.error_description}`);
    }
  }, [location]);
*/

  return (
    <Suspense fallback="...">
      <div style={styles.content}>
        <Switch location={location}>
        <Route path="/" exact component={Home} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
        <Route path="/support" exact component={Support} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
        <Route path="/signup" component={SignUp} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
        <Route path="/signin" component={SignIn} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
        <Route path="/profile" render={(props) => <Profile {...props} /> } /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
        <Route path="/signout" component={SignOut} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
        <Route path="/forgot-password" component={ForgotPassword} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
        <Route path="/notifications" component={Notifications} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
        <Route path="/privacy-policy" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"privacyPolicy"} /> } /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
        <Route path="/terms-of-use" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"termsOfUse"} /> } /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
        <Route path="/admin-panel" component={AdminPanel} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
        <Route path="/payment-success" render={(props) => <PaymentResponse {...props} /> } /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
        <Route path="/payment-cancel" render={(props) => <PaymentResponse {...props} /> } /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
        <Route path="" component={NotFound} />
      </Switch>
      </div>
    </Suspense>
  );
}

const styles = {};

styles["fade-enter"] = {
  opacity: 0,
  zIndex: 1,
};

styles["fade-enter"] = {
  opacity: 0,
  transition: "opacity 250ms ease-in",
};

styles["fade-enter-active"] = {
  opacity: 1,
  transition: "opacity 250ms ease-in",
};

export default React.memo(Routes);
