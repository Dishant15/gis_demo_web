import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "react-query";

import get from "lodash/get";
import map from "lodash/map";
import snakeCase from "lodash/snakeCase";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import LoadingButton from "@mui/lab/LoadingButton";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { addNotification } from "redux/reducers/notification.reducer";
import { fetchDownloadLayerData } from "planning/data/layer.services";

const ExportLayer = ({ layerConfig }) => {
  const dispatch = useDispatch();
  const { layer_key, name } = layerConfig;

  // get list of elements for current key
  const layerData = useSelector(getLayerViewData(layer_key));

  const { mutate: exportMutation, isLoading: loadingExport } = useMutation(
    fetchDownloadLayerData,
    {
      onSuccess: (res) => {
        const report_name =
          snakeCase(name) +
          "_" +
          format(new Date(), "dd/MM/yyyy") +
          "_" +
          format(new Date(), "hh:mm");
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${report_name}.xlsx`);
        // have to add element to doc for firefox
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "Error",
            text: err.message,
          })
        );
      },
    }
  );

  const handleDownload = useCallback(() => {
    exportMutation({
      layerKey: layer_key,
      data: { export_type: "xlsx", element_ids: map(layerData, "id") },
    });
  }, [layer_key, layerData]);

  return (
    <Box p={1} justifyContent="flex-end" display="flex">
      {map(get(layerConfig, "export_as", []), (exportType, ind) => {
        return (
          <LoadingButton
            key={exportType}
            variant="text"
            color="error"
            size="small"
            startIcon={<DownloadForOfflineIcon />}
            onClick={handleDownload}
            loading={loadingExport}
          >
            Download
          </LoadingButton>
        );
      })}
    </Box>
  );
};

export default ExportLayer;
