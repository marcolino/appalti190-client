import api from "./API";

const mode = async() => {
  return await api.get("/payment/mode",
  ).then(
    response => {
      return response.data;
    },
    error => {
      return error;
    }
  );
};

const createCheckoutSession = async({product}) => {
  return await api.post("/payment/create-checkout-session", {
    product
  }).then(
    response => {
console.log("CCS - res:", response);
      return response.data;
    },
    error => {
console.log("CCS - err:", error);
      return error;
    }
  );
};

const PaymentService = {
  mode,
  createCheckoutSession
};

export default PaymentService;
