import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";
import { addItemToWishlist } from "./features/wishlist-slice";

import { TypedUseSelectorHook, useSelector } from "react-redux";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addItemToWishlist,
  effect: (action) => {
    toast.success(`${action.payload.title} added to wishlist`);
  },
});

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
