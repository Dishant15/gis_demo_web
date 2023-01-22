import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import { get } from "lodash";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import noop from "lodash/noop";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";
import SplicingContainer from "./SplicingContainer";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { setMapState } from "planning/data/planningGis.reducer";
import { fetchElementPortSplicingDetails } from "planning/data/layer.services";

const SplicingView = () => {
  const dispatch = useDispatch();
  const splicingPostData = useSelector(getPlanningMapStateData);

  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [middleData, setMiddleData] = useState(null);

  const { mutate: getElementSplicingData, isLoading } = useMutation(
    fetchElementPortSplicingDetails,
    {
      onSuccess: (res) => {
        setLeftData(get(res, "left", null));
        setRightData(get(res, "right", null));
        setMiddleData(get(res, "middle", null));
      },
    }
  );

  useEffect(() => {
    getElementSplicingData(splicingPostData);
  }, [splicingPostData]);

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  return (
    <GisMapPopups dragId="SplicingView">
      <Box minWidth="350px">
        <TableHeader
          title="Splicing View"
          minimized={false}
          handlePopupMinimize={noop}
          handleCloseDetails={handleCloseDetails}
        />
      </Box>
      {isLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <SplicingContainer
          left={leftData}
          right={rightData}
          middle={middleData}
        />
      )}
    </GisMapPopups>
  );
};

export default SplicingView;
