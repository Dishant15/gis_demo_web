import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import HomePage from "pages/HomePage";
import AreaPocketPage from "pages/AreaPocketPage";
import Layout from "App/Layout";
import LoginPage from "pages/Authentication/LoginPage";

import {
  getAreaPocketPath,
  getHomePath,
  getLoginPath,
} from "utils/url.constants";
import { theme } from "App/theme";
import store, { persistor } from "redux/store";

import { RequireAuth } from "App/RequireAuth";
import "./global.scss";

// test imports

const queryClient = new QueryClient();

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <BrowserRouter>
              <Routes>
                <Route path={getHomePath()} element={<Layout />}>
                  <Route
                    index
                    path={getHomePath()}
                    element={
                      <RequireAuth>
                        <HomePage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path={getAreaPocketPath()}
                    element={
                      <RequireAuth>
                        <AreaPocketPage />
                      </RequireAuth>
                    }
                  />
                </Route>
                <Route path={getLoginPath()} element={<LoginPage />} />
                {/* testing routes */}
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
