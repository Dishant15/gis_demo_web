import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { debounce } from "lodash";

import authReducer from "redux/reducers/auth.reducer";
import appStateReducer, { setWindowSize } from "./reducers/appState.reducer";
import notificationReducer from "./reducers/notification.reducer";
import planningStateReducer from "planning/data/planningState.reducer";
import planningGisReducer from "planning/data/planningGis.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  appState: appStateReducer,

  planningState: planningStateReducer,
  planningGis: planningGisReducer,
});

const persistConfig = {
  key: "root-network-gis-web",
  storage,
  whitelist: ["auth"],
};

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: process.env.NODE_ENV !== "production",
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
