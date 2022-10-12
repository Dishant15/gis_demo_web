import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "App/Layout";
import Dashboard from "pages/Dashboard";
import LoginPage from "pages/Authentication/LoginPage";
import RegionPage from "../region/RegionPage";
import UserAdminPage from "gis_user/UserAdminPage";
import UserListPage from "gis_user/pages/UserListPage";
import UserAdminForm from "gis_user/pages/UserAdminForm";

import TicketAdminPage from "ticket/TicketAdminPage";
import TicketListPage from "ticket/pages/TicketListPage";
import TicketAddForm from "ticket/pages/TicketAddForm";
import TicketEditPage from "ticket/pages/TicketEditPage";
import WorkOrderPage from "ticket/pages/WorkOrderPage";

import PlanningPage from "planning/PlanningPage";
import GeoSurveyPage from "geo_survey/GeoSurveyPage";
import ElementConfig from "ElementConfig";

import { RequireAuth } from "App/RequireAuth";
import { theme } from "App/theme";
import store, { persistor } from "redux/store";

import {
  getAddTicketPage,
  getAddUserPage,
  getEditTicketPage,
  getEditUserPage,
  getGeoSurveyPath,
  getHomePath,
  getLoginPath,
  getElementConfigPage,
  getPlanningPage,
  getRegionPage,
  getTicketListPage,
  getTicketWorkorderPage,
  getUserListPage,
} from "../utils/url.constants";

import "./global.scss";
import "./ag-grid.scss";
import "./ag-theme-alpine.scss";
import "react-datetime-range-super-picker/dist/index.css";

export const queryClient = new QueryClient();

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
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path={getPlanningPage()}
                    element={
                      <RequireAuth>
                        <PlanningPage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path={getElementConfigPage()}
                    element={
                      <RequireAuth>
                        <ElementConfig />
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
                  <Route
                    path={getGeoSurveyPath()}
                    element={
                      <RequireAuth>
                        <GeoSurveyPage />
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
                          <UserAdminForm />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={getEditUserPage()}
                      element={
                        <RequireAuth>
                          <UserAdminForm />
                        </RequireAuth>
                      }
                    />
                  </Route>
                  <Route path="/ticket" element={<TicketAdminPage />}>
                    <Route
                      path={getTicketListPage()}
                      element={
                        <RequireAuth>
                          <TicketListPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={getAddTicketPage()}
                      element={
                        <RequireAuth>
                          <TicketAddForm />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={getEditTicketPage()}
                      element={
                        <RequireAuth>
                          <TicketEditPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path={getTicketWorkorderPage()}
                      element={
                        <RequireAuth>
                          <WorkOrderPage />
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
