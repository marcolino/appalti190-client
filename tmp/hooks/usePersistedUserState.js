import React, { useEffect } from "react";

export const usePersistedUserState = (key, defaultValue) => {
  
  const user = JSON.parse(localStorage.getItem("user"));
  const value = user && user[key] ? user[key] : {};
  //const value = localStorage.getItem(key);
console.log("£££ usePersistedUserState value before:", value);

  const [state, setState] = React.useState(
    //() => value ? JSON.parse(value) : defaultValue
    () => value ? value : defaultValue
  );
  useEffect(() => {
    //console.log("usePersistedUserState SET KEY:", key, "- state:", state, " - JSON.stringify(state):", JSON.stringify(state));
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user[key] = state;
console.log("£££ usePersistedUserState value after:", state);
      localStorage.setItem("user", JSON.stringify(user));
    }
    //localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};
