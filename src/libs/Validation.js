import i18n from "i18next";

const t = i18n.t;

export const isAdmin = (user) => {
  return user.roles.includes("admin");
};

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  /**
   * ^	                The password string will start this way
   * (?=.*[a-z])	      The string must contain at least 1 lowercase alphabetical character
   * (?=.*[A-Z])	      The string must contain at least 1 uppercase alphabetical character
   * (?=.*[0-9])	      The string must contain at least 1 numeric character
   * (?=.*[!@#$%^&*])	  The string must contain at least one special character,
   *                    but we are escaping reserved RegEx characters to avoid conflict
   * (?=.{8,})	        The string must be at least 8 characters long
   */
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return re.test(String(password));
}

export const explainPasswordRequirements = () => {
  return t(`\
The password must contain at least 1 lowercase character,
it must contain at least 1 uppercase character,
it must contain at least 1 numeric character,
it must contain at least one special character,
it must be at least eight characters long
.`);
}
