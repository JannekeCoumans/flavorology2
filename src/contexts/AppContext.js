import React, { createContext, useEffect, useState } from "react";
import { StorageHandler } from "config/C4";

export const AppContext = createContext();

const checkStorageItems = (callback) => {
  const storageItems = StorageHandler.get("shoppingcart");
  if (storageItems && storageItems.length > 0) {
    callback(storageItems);
  }
};

const AppContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (cartItems.length === 0) {
      checkStorageItems(setCartItems);
    }
  }, [cartItems, setCartItems]);

  return (
    <AppContext.Provider value={{ cartItems, setCartItems }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
