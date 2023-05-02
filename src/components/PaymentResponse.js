import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
//import { errorMessage } from "../libs/Misc";
import EventBus from "../libs/EventBus";
import { toast } from "./Toast";
import UserService from "../services/UserService";
import TokenService from "../services/TokenService";
//import JobService from "../services/JobService";

function PaymentResponse(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const [ user, setUser ] = useState(TokenService.getUser());
  const [ plans, setPlans ] = useState([]);

 // get user profile on load
  // useEffect(() => {
  //   console.log("useeffect getAllPlans");
  //   JobService.getAllPlans().then(
  //     result => {
  //       if (result instanceof Error) {
  //         console.error("getAllPlans error:", result);
  //         toast.error(errorMessage(result));
  //         return; //setError({ code: result.message });
  //       }
  //   console.log(`plans got successfully:`, result);
  //       setPlans(result.data);
  //     },
  //     error => {
  //       console.error("getAllPlans error:", error);
  //     }
  //   );
  // }, []);

  useEffect(() => {
    const status =
      pathname.match("/payment-success") ? "success" :
      pathname.match("/payment-cancel") ? "cancel" :
      "unknown"
    ;
    const queryParams = new URLSearchParams(search);
    const planName = queryParams.get("product");
console.log("queryParams, search:", queryParams, search);
//alert("planName:" + planName);

    if (status === "success") {
      UserService.updatePlan({
        plan: planName,
      }).then(
        result => {
          UserService.getAllPlans().then(
            result => {
              console.log("*** updatePlan result OK (user?):", result);
              EventBus.dispatch("plan-change");
              toast.success(t("Plan updated successfully"));
              console.log("useeffect getAllPlans");
              console.log(`plans got successfully:`, result);
              setPlans(result.data);
              const p = result.data.find(plan => plan.name === planName);
              //setPlan(p);
              user.plan = p;
              setUser(user);
              TokenService.setUser(user);
            },
            error => {
              console.error("getAllPlans error:", error);
            }
          );
        },
        error => {
          console.error("updatePlan error:", error);
        }
      );
    } else {
      console.warn("PaymentResponse - path name was:", pathname);
    }

    // redirect to profile, plans tab (2nd)
    history.push("/profile", { tabValue: 1 });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [plans]);

  return <></>;
}


export default React.memo(PaymentResponse);