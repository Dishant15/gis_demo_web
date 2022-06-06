import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "App/Layout";
import HomePage from "pages/HomePage";
import LoginPage from "pages/Authentication/LoginPage";
import AreaPocketPage from "pages/AreaPocketPage";
import RegionPage from "../region/RegionPage";
import UserAdminPage from "gis_user/UserAdminPage";
import UserListPage from "gis_user/pages/UserListPage";
import AddUserPage from "gis_user/pages/UserAdminForm";

import { theme } from "App/theme";
import store, { persistor } from "redux/store";

import { RequireAuth } from "App/RequireAuth";
import {
  getAddUserPage,
  getAreaPocketPath,
  getHomePath,
  getLoginPath,
  getRegionPage,
  getUserListPage,
} from "../utils/url.constants";

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
                  <Route
                    path={getRegionPage()}
                    element={
                      <RequireAuth>
                        <RegionPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="/users" element={<UserAdminPage />}>
                    <Route
                      path={getUserListPage()}
                      element={
                        <RequireAuth>
                          <UserListPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={getAddUserPage()}
                      element={
                        <RequireAuth>
                          <AddUserPage />
                        </RequireAuth>
                      }
                    />
                  </Route>
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
