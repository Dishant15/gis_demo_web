import React from "react";
import { Box, Skeleton } from "@mui/material";

import range from "lodash/range";

const RegionDummyLoader = () => {
  return (
    <div id="region-page" className="page-wrapper">
      <div className="reg-content-wrapper">
        <div className="reg-pocket-list">
          <div className="reg-list-wrapper">
            <RegionListDummyLoader />
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

export const RegionListDummyLoader = () => {
  const regionPills = range(6);
  return regionPills.map((ind) => {
    return <Skeleton key={ind} animation="wave" height="100px" />;
  });
};

export default RegionDummyLoader;
