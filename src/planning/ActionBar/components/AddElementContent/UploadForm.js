import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
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

const UploadForm = ({ importLayerCofigs, onClose }) => {
  const dispatch = useDispatch();

  const { mutate: uploadLayerDataMutation, isLoading } = useMutation(
    uploadLayerData,
    {
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "Upload layer data",
            text: get(err, "data.__all__"),
          })
        );
      },
      onSuccess: (res) => {
        dispatch(
          addNotification({
            type: "success",
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
      if (!size(files)) {
        dispatch(
          addNotification({
            type: "error",
            title: "Input",
            text: "Please select file",
          })
        );
      }
      const formData = new FormData();
      formData.append("file", files[0], files[0].name);
      uploadLayerDataMutation({ layerKey: data.layerKey, data: formData });
    },
    [files]
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
              accept=".xlsx, .xls, .csv"
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
