import React, { useEffect } from "react";

export const usePersistedState = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  const [state, setState] = React.useState(
    () => value ? JSON.parse(value) : defaultValue
    //() => {console.log("usePersistedState GET KEY:", key, cookies.get(key) || defaultValue); return cookies.get(key) || defaultValue}
  );
  useEffect(() => {
console.log("usePersistedState SET KEY:", key, "- state:", state, " - JSON.stringify(state):", JSON.stringify(state));
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};
