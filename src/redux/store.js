import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducers/auth.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root-network-gis-web",
  storage,
  whitelist: ["auth"],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;