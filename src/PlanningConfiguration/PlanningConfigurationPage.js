import React from "react";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import "../region/styles/region-page.scss";

const configTypeList = ["p_splitter"];
const configTypeMap = {
  p_splitter: "Spliter",
};
const PlanningConfigurationPage = () => {
  return (
    <div id="region-page" className="page-wrapper">
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

            {configTypeList.map((config) => {
              const isActive = true;
              return (
                <Box className="reg-list-pill">
                  <Stack direction="row" width="100%" spacing={2}>
                    <Stack
                      direction="row"
                      flex={1}
                      sx={{
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      p={1}
                    >
                      <span>{configTypeMap[config]}</span>
                      {isActive ? <VisibilityIcon /> : null}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </div>
        </div>
        <div className="reg-content"></div>
      </div>
    </div>
  );
};

export default PlanningConfigurationPage;
