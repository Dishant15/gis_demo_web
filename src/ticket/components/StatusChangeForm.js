import React from "react";
import { useForm, Controller } from "react-hook-form";

import {
  TextField,
  Stack,
  Chip,
  InputLabel,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

import { workOrderStatusTypes } from "utils/constant";
import { map } from "lodash";

/**
 * Parent:
 *    WorkOrderPage
 *    TicketWorkOrderList
 */
const StatusChangeForm = ({
  data,
  editSurveyLoading,
  onEditComplete,
  handleSurveyStatusCancel,
}) => {
  const { remark, status, id } = data;
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      id,
      remark: remark || "",
      status: status || null,
    },
  });

  return (
    <Box
      p={3}
      component="form"
      onSubmit={handleSubmit(onEditComplete)}
      sx={{
        paddingTop: "10px",
      }}
    >
      <Stack direction="row" spacing={2} width="100%">
        <Typography variant="h6" color="primary.dark" flex={1}>
          Change Status
        </Typography>
        <IconButton aria-label="close" onClick={handleSurveyStatusCancel}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Divider
        flexItem
        sx={{
          marginTop: "4px",
          marginBottom: "16px",
        }}
      />
      <Stack spacing={2}>
        <TextField
          label="Remarks"
          multiline
          rows={2}
          {...register("remark")}
          error={!!errors.remark}
          helperText={errors.remark?.message}
        />
        <Controller
          render={({ field }) => {
            return (
              <Stack>
                <InputLabel>Status</InputLabel>
                <Stack direction="row" spacing={1}>
                  {map(workOrderStatusTypes, (wStatus) => {
                    const selected = field.value === wStatus.value;
                    return (
                      <Chip
                        color={selected ? wStatus.color : undefined}
                        key={wStatus.value}
                        label={wStatus.label}
                        onClick={() => field.onChange(wStatus.value)}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            );
          }}
          name={"status"}
          control={control}
        />
        <Stack direction="row" justifyContent="flex-end">
          <LoadingButton
            variant="outlined"
            color="success"
            type="submit"
            endIcon={<DoneIcon />}
            sx={{
              flex: 1,
              marginLeft: "2px",
            }}
            loading={editSurveyLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default StatusChangeForm;
