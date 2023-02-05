import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import get from "lodash/get";
import size from "lodash/size";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";

import { FormSelect } from "components/common/FormFields/FormSelect";
import { UploadButton } from "components/common/FilePickerDialog";

import { addNotification } from "redux/reducers/notification.reducer";
import { uploadLayerData } from "planning/data/layer.services";
import { LayerKeyMappings } from "planning/GisMap/utils";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { NOTIFICATION_TYPE } from "components/common/Notification/Notification";
import { setActiveTab } from "planning/data/planningState.reducer";

const UploadForm = ({ importLayerCofigs, onClose }) => {
  /**
   * Parent
   *    AddElementContent
   */
  const dispatch = useDispatch();
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const { mutate: uploadLayerDataMutation, isLoading } = useMutation(
    uploadLayerData,
    {
      onError: (err) => {
        const statusCode = get(err, "response.status");
        if (statusCode === 403) {
          dispatch(
            addNotification({
              type: "error",
              title: "Upload layer data",
              text: "Permission required to upload this layer",
            })
          );
        } else {
          dispatch(
            addNotification({
              type: "error",
              title: "Upload layer data",
              text: "Invalid file data",
            })
          );
        }
      },
      onSuccess: (res) => {
        const success_count = get(res, "success_count", 0);
        const error_list = get(res, "error_list", []);

        if (error_list?.length) {
          console.log("failed => ", error_list);
          dispatch(
            addNotification({
              type: NOTIFICATION_TYPE.WARNING,
              title: "Upload layer data",
              text: `${success_count} elements added successfully. ${error_list?.length} elements are failed to add.`,
            })
          );
        } else {
          dispatch(
            addNotification({
              type: NOTIFICATION_TYPE.SUCCESS,
              title: "Upload layer data",
              text: `${success_count} elements added successfully.`,
            })
          );
        }
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPE.SUCCESS,
            title: "Upload layer data",
            text: get(res, "data.__all__"),
          })
        );
        onClose();
      },
    }
  );

  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    defaultValues: { layerKey: "" },
  });

  const [files, setFiles] = useState(null);

  const handleFileUpload = useCallback((event) => {
    setFiles(event.target.files);
  }, []);

  const onFormSubmit = useCallback(
    (data) => {
      if (!size(selectedRegionIds)) {
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPE.ERROR,
            title: "Select Region first",
            text: "Please select region to narrow down your upload of elements.",
          })
        );
        // change tab to regions
        dispatch(setActiveTab(0));
        return;
      }
      if (!size(files)) {
        dispatch(
          addNotification({
            type: NOTIFICATION_TYPE.ERROR,
            title: "Input",
            text: "Please select file",
          })
        );
      }
      const formData = new FormData();
      formData.append("file", files[0], files[0].name);

      const featureType = get(LayerKeyMappings, [data.layerKey, "featureType"]);
      formData.append("featureType", featureType);
      formData.append("region_ids", selectedRegionIds);
      uploadLayerDataMutation({ layerKey: data.layerKey, data: formData });
    },
    [files, selectedRegionIds]
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        <Box />
        <Typography variant="h6" color="primary.dark">
          Upload File
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent
        dividers
        sx={{
          padding: 0,
        }}
      >
        <Box p={4}>
          <FormSelect
            label="Layer"
            name="layerKey"
            control={control}
            rules={{
              required: "Layer is required",
            }}
            required={true}
            options={importLayerCofigs}
            error={!!get(errors, "layerKey")}
            helperText={get(errors, "layerKey.message", "")}
            labelKey="name"
            valueKey="layer_key"
          />
          <Box py={2}>
            <Typography
              pl={1}
              pb={0.5}
              variant="caption"
              color="GrayText"
              component="div"
            >
              Upload File
            </Typography>
            <UploadButton
              text="Select File"
              variant="contained"
              accept=".kml, .kmz"
              onChange={handleFileUpload}
            />
            <Typography variant="body2" pl={1} pt={0.5}>
              {get(files, "0.name", "")}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <LoadingButton
          variant="outlined"
          onClick={handleSubmit(onFormSubmit)}
          loading={isLoading}
        >
          Upload
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default UploadForm;
