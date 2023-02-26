import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserService from "../services/UserService";
import { errorMessage } from "../libs/Misc";
import EventBus from "../libs/EventBus";
import { toast } from "./Toast";

function PaymentRedirect(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const { pathname, search } = useLocation();

  useEffect(() => {
    const status =
      pathname.match("/payment-success") ? "success" :
      pathname.match("/payment-cancel") ? "cancel" :
      "unknown"
    ;
    const queryParams = new URLSearchParams(search);
    const planName = queryParams.get("product");

    if (status === "success") {
      UserService.updatePlan({
        plan: planName,
      }).then(
        result => {
          if (result instanceof Error) {
            console.error("profileUpdate error:", result);
            toast.error(errorMessage(result));
            return; //setError({ code: result.message });
          }
          console.log("*** updatePlan result OK (user?):", result);
          EventBus.dispatch("plan-change");
          toast.success(t("Plan updated successfully"));
        }
      );

    } else {
      console.warn("PaymentRedirect - path name was:", pathname);
    }

    // redirect to profile, plans tab (2nd)
    history.push("/profile", { tabValue: 1 });
  });

  return <></>;
}


export default React.memo(PaymentRedirect);