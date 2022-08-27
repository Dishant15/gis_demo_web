import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, Divider, Stack, Container, Paper } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { filter } from "lodash";

import ConfigurationList from "./components/ConfigurationList";
import PermissionNotFound from "components/common/PermissionNotFound";

import { fetchLayerList } from "planning/data/actionBar.services";
import { getIsSuperAdminUser } from "redux/selectors/auth.selectors";

import "../region/styles/region-page.scss";
import "./styles/planning-config.scss";

const ElementConfigPageWrapper = () => {
  const isSuperUser = useSelector(getIsSuperAdminUser);

  if (isSuperUser) {
    return <ElementConfigPage />;
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

const ElementConfigPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const { isLoading, data = [] } = useQuery(
    "planningLayerConfigs",
    fetchLayerList,
    {
      staleTime: Infinity,
    }
  );

  const layerCofigs = useMemo(() => {
    // get only configurable layer data
    return filter(data, ["is_configurable", true]);
  }, [data]);

  const handleLayerSelect = useCallback(
    (layerKey) => () => {
      setSearchParams({ layerKey });
    },
    [setSearchParams]
  );

  if (isLoading) {
    return <div>Dummy Loader</div>;
  }

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
              const { layer_key, name } = config;
              const isActive = searchParams.get("layerKey") === layer_key;

              return (
                <Box className="reg-list-pill planning-pill" key={layer_key}>
                  <Stack
                    direction="row"
                    width="100%"
                    spacing={2}
                    px={1}
                    py={1.5}
                    justifyContent="space-between"
                    className="clickable"
                    onClick={handleLayerSelect(layer_key)}
                  >
                    <span>{name}</span>
                    {isActive ? <ArrowForwardIosIcon /> : null}
                  </Stack>
                  <Divider flexItem />
                </Box>
              );
            })}
          </div>
        </div>
        <div className="reg-content">
          <ConfigurationList layerKey={searchParams.get("layerKey")} />
        </div>
      </div>
    </div>
  );
};

export default ElementConfigPageWrapper;
