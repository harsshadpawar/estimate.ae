// src/app/store.ts
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// Import other reducers as needed
import authSlice from '../features/authSlice';
import userReducer from "../features/userSlice";
import languageSlice from '../features/languageSlice';
import transactionReducer from "../features/transactionSlice";
import forgeReducer from "../features/forge/forgeSlice";
import cadReducer from "../features/cad/cadSlice";
import materialsReducer from "../features/materials/materialsSlice";
import machinesReducer from "../features/machines/machinesSlice";
import surfaceTreatmentsReducer from "../features/surfaceTreatments/surfaceTreatmentsSlice";
import costsReducer from "../features/costs/costsSlice";
import companyReducer from "../features/company/companySlice";
import subscriptionReducer from "../features/subscription/subscriptionSlice";
import fileReducer from "../features/file/fileSlice";
import productReducer from "../features/product/productSlice";
export const store = configureStore({
  reducer: {
    // Add other reducers here
    auth: authSlice,
    users: userReducer,
    language: languageSlice,
    transactions: transactionReducer,
    forge: forgeReducer,
    cad: cadReducer,
    materials: materialsReducer,
    machines: machinesReducer,
    surfaceTreatments: surfaceTreatmentsReducer,
    costs: costsReducer,
    company: companyReducer,
    subscription: subscriptionReducer,
    file: fileReducer,
    product:productReducer,
    
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;