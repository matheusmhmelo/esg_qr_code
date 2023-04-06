/* eslint-disable no-unused-vars */
import { useState } from "react";

const adminKey = "ESG_Quim_2023_admin"

export const useLocalStorage = () => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(adminKey);
      if (value) {
        return JSON.parse(value);
      }
    } catch (err) {
      return null;
    }
  });
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(adminKey, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
