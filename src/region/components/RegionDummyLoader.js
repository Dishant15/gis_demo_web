import { Box, Skeleton } from "@mui/material";
import { range } from "lodash";
import React from "react";

const RegionDummyLoader = () => {
  const regionPills = range(6);

  return (
    <div id="region-page" className="page-wrapper">
      <div className="reg-content-wrapper">
        <div className="reg-pocket-list">
          <div className="reg-list-wrapper">
            {regionPills.map((ind) => {
              return <Skeleton key={ind} animation="wave" height="100px" />;
            })}
          </div>
        </div>

        <div className="reg-content">
          <div className="reg-map-container">
            <Box sx={{ padding: "20px" }}>
              <Skeleton animation="wave" height="30rem" />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionDummyLoader;
