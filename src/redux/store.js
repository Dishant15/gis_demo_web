import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { debounce } from "lodash";
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
import authReducer from "redux/reducers/auth.reducer";
import appStateReducer, { setWindowSize } from "./reducers/appState.reducer";
import notificationReducer from "./reducers/notification.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  appState: appStateReducer,
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

// update window size state when window resize event fires
const handleWindowResize = debounce(
  () => {
    store.dispatch(setWindowSize());
  },
  300,
  { trailing: true }
);

window.addEventListener("resize", handleWindowResize);
