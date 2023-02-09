import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";
import SurveyDetailsTable from "./SurveyDetailsTable";

import { setMapState } from "planning/data/planningGis.reducer";
import { useQuery } from "react-query";
import { fetchSurveyWoDetails } from "planning/data/ticket.services";
import { GisElementTableLoader } from "../GisMapPopups/GisMapPopupLoader";
import { getPlanningMapState } from "planning/data/planningGis.selectors";

const SurveyDetails = () => {
  const [minimized, setMinimized] = useState(false);
  const dispatch = useDispatch();
  const mapState = useSelector(getPlanningMapState);

  const { data, isLoading, isError } = useQuery(
    [mapState.layerKey, mapState.data.elementId],
    fetchSurveyWoDetails,
    {
      retry: false,
    }
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    setMinimized((val) => !val);
  }, []);

  if (isLoading) {
    return <GisElementTableLoader />;
  } else if (isError) {
    return (
      <GisMapPopups dragId="surveyDetails">
        <Box minWidth="350px" maxWidth="550px">
          <TableHeader
            title="Survey Details"
            minimized={minimized}
            handlePopupMinimize={handlePopupMinimize}
            handleCloseDetails={handleCloseDetails}
          />
          <Typography color="text.secondary" textAlign="center" py={8}>
            Survey Not found
          </Typography>
        </Box>
      </GisMapPopups>
    );
  }

  return (
    <GisMapPopups dragId="surveyDetails">
      <Box minWidth="750px" maxWidth="950px">
        <TableHeader
          title="Survey Details"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : <SurveyDetailsTable surveyData={data} />}
      </Box>
    </GisMapPopups>
  );
};

export default SurveyDetails;
