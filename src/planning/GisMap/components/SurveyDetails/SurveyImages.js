import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { size } from "lodash";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

import GisMapPopups from "../GisMapPopups";

import { setMapState } from "planning/data/planningGis.reducer";
import { fetchSurveyWoImages } from "planning/data/ticket.services";
import { GisElementTableLoader } from "../GisMapPopups/GisMapPopupLoader";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import TableHeader from "../ElementDetailsTable/TableHeader";
import { POPUP_CHILD_STYLES } from "../GisMapPopups/GisMapPopups";

const SurveyImages = () => {
  const dispatch = useDispatch();
  const mapState = useSelector(getPlanningMapState);
  const [minimized, setMinimized] = useState(false);

  const { data, isLoading, isError } = useQuery(
    ["surveyWoImages", mapState.layerKey, mapState.data.elementId],
    fetchSurveyWoImages,
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

  if (isLoading) return <GisElementTableLoader />;

  return (
    <GisMapPopups dragId="surveyDetails">
      <Box sx={POPUP_CHILD_STYLES}>
        <TableHeader
          title="Survey Images"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : (
          <Box sx={{ maxHeight: "80vh", overflow: "auto" }}>
            <SurveyImageList images={data} />
          </Box>
        )}
      </Box>
    </GisMapPopups>
  );
};

const SurveyImageList = ({ images }) => {
  if (!size(images)) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "400px", minWidth: "300px" }}
      >
        <Typography variant="h5">No images uploaded</Typography>
      </Box>
    );
  } else {
    return (
      <ImageList>
        {images.map((item) => (
          <ImageListItem key={item.id}>
            <img
              src={`${item.image}?w=248&fit=crop&auto=format`}
              srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.caption}
              subtitle={item.updated_on}
              actionIcon={
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`info about ${item.title}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  }
};

export default SurveyImages;
