import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, Divider, Stack, Container, Paper } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { filter } from "lodash";

import ConfigurationList from "./components/ConfigurationList";
import PermissionNotFound from "components/common/PermissionNotFound";

import { fetchLayerList } from "planning/data/actionBar.services";
import { getIsSuperAdminUser } from "redux/selectors/auth.selectors";

import "../region/styles/region-page.scss";
import "./styles/planning-config.scss";

const PlanningConfigurationPageWrapper = () => {
  const isSuperUser = useSelector(getIsSuperAdminUser);
  if (isSuperUser) {
    return <PlanningConfigurationPage />;
  } else {
    return (
      <Container>
        <Paper
          sx={{
            mt: 3,
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PermissionNotFound />
        </Paper>
      </Container>
    );
  }
};

const PlanningConfigurationPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const { isLoading, data } = useQuery("planningLayerConfigs", fetchLayerList, {
    staleTime: Infinity,
  });

  const layerCofigs = useMemo(() => {
    return filter(data, ["is_configurable", true]);
  }, [data]);

  return (
    <div id="region-page" className="page-wrapper planning-config-page">
      <div className="reg-content-wrapper">
        <div className="reg-pocket-list">
          <div className="reg-list-wrapper">
            <Stack direction="row">
              <Box
                color="primary.dark"
                flex={1}
                className="reg-list-header-pill"
              >
                Select Config Type
              </Box>
            </Stack>
            <Divider flexItem orientation="horizontal" />

            {layerCofigs.map((config) => {
              const isActive =
                searchParams.get("layerkey") === config.layer_key;
              return (
                <Box
                  className="reg-list-pill planning-pill"
                  key={config.layer_key}
                >
                  <Stack
                    direction="row"
                    width="100%"
                    spacing={2}
                    px={1}
                    py={1.5}
                    justifyContent="space-between"
                    className="clickable"
                    onClick={() => {
                      setSearchParams({ layerkey: config.layer_key });
                    }}
                  >
                    <span>{config.name}</span>
                    {isActive ? <VisibilityIcon /> : null}
                  </Stack>
                  <Divider flexItem />
                </Box>
              );
            })}
          </div>
        </div>
        <div className="reg-content">
          <ConfigurationList layerkey={searchParams.get("layerkey")} />
        </div>
      </div>
    </div>
  );
};

export default PlanningConfigurationPageWrapper;
