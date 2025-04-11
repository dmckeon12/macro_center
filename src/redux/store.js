import { configureStore } from "@reduxjs/toolkit";
import CartReducer, { setCartFromLocalStorage } from "./slices/CartSlice";

export const store = configureStore({
  reducer: {
    cart: CartReducer,
  },
});

// Load cart from localStorage if it exists
const storedCart = localStorage.getItem("localCart");
if (storedCart) {
  const parsedCart = JSON.parse(storedCart);
  store.dispatch(setCartFromLocalStorage(parsedCart));
}

// Save cart to localStorage when it changes
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("localCart", JSON.stringify(state.cart));
});