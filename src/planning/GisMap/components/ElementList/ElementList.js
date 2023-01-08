import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import size from "lodash/size";
import get from "lodash/get";
import isNull from "lodash/isNull";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";

import LanguageIcon from "@mui/icons-material/Language";

import GisMapPopups from "../GisMapPopups";
import TableHeader from "../ElementDetailsTable/TableHeader";
import ConfirmDialog from "components/common/ConfirmDialog";

import { setMapState } from "planning/data/planningGis.reducer";
import { LayerKeyMappings } from "../../utils";
import { useElementListHook } from "./useElementList";

const ElementList = () => {
  const [minimized, setMinimized] = useState(false);
  const dispatch = useDispatch();

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handlePopupMinimize = useCallback(() => {
    setMinimized((val) => !val);
  }, []);

  return (
    <GisMapPopups dragId="ElementList">
      <Box minWidth="350px" maxWidth="550px">
        <TableHeader
          title="Element List"
          minimized={minimized}
          handlePopupMinimize={handlePopupMinimize}
          handleCloseDetails={handleCloseDetails}
        />
        {minimized ? null : <ElementListTable />}
      </Box>
    </GisMapPopups>
  );
};

const ElementListTable = () => {
  const {
    elementList,
    isAssociationList,
    selectedElement,
    isEditLoading,
    handleShowOnMap,
    handleShowDetails,
    handleAddExistingAssociation,
    handleShowPopup,
    handleHidePopup,
  } = useElementListHook();

  const showPopup = !isNull(selectedElement);

  if (!size(elementList))
    return (
      <Box p={2}>
        <Typography variant="h6" color="text.secondary">
          No element available arround selected area
        </Typography>
      </Box>
    );

  return (
    <>
      <Stack
        spacing={1}
        divider={<Divider />}
        py={1}
        maxHeight="72vh"
        overflow="auto"
      >
        {elementList.map((element) => {
          const Icon =
            LayerKeyMappings[element.layerKey]["getViewOptions"](element).icon;
          const networkId = get(element, "network_id", "");

          return (
            <Stack
              key={networkId}
              direction="row"
              spacing={1}
              alignItems="center"
              py={0.5}
              className="change-bg-on-hover"
            >
              <Paper
                sx={{
                  width: "42px",
                  height: "42px",
                  lineHeight: "42px",
                  textAlign: "center",
                  marginLeft: "8px",
                }}
              >
                <img
                  className="responsive-img"
                  src={Icon}
                  alt={element.layerKey}
                />
              </Paper>
              <Stack flex={1} flexDirection="row">
                <Box
                  className="clickable"
                  flex={1}
                  onClick={
                    isAssociationList
                      ? handleShowPopup(element)
                      : handleShowDetails(element)
                  }
                >
                  <Typography variant="subtitle1" lineHeight={1.1}>
                    {get(element, "name", "")}
                  </Typography>
                  <Typography variant="caption">#{networkId}</Typography>
                </Box>
                <Tooltip title="Show on map">
                  <IconButton
                    sx={{
                      marginLeft: "8px",
                      marginRight: "8px",
                    }}
                    aria-label="show-location"
                    onClick={handleShowOnMap(element)}
                  >
                    <LanguageIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      <ConfirmDialog
        show={showPopup}
        onClose={handleHidePopup}
        onConfirm={handleAddExistingAssociation}
        isLoading={isEditLoading}
        title={`Associate ${selectedElement?.name}`}
        text={`Are you sure you want to add association with element : ${selectedElement?.name} #${selectedElement?.unique_id}`}
        confirmText="Associate"
      />
    </>
  );
};

export default ElementList;
