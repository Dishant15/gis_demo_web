import React from "react";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { map } from "lodash";

import { Box, TextField, Stack, Button, CircularProgress } from "@mui/material";
import { Done } from "@mui/icons-material";

import { FormDatePicker, FormSelect } from "components/common/FormFields";
import {
  NetworkTypeList,
  TicketTypeList,
  TicketStatusList,
} from "utils/constant";
import { fetchRegionList } from "region/data/services";
import { fetchUserList } from "gis_user/data/services";

const AddTicketForm = ({ onSubmit }) => {
  const { isLoading: regionListLoading, data: regionList } = useQuery(
    "regionList",
    fetchRegionList,
    {
      initialData: [],
    }
  );

  const { isLoading: userListLoading, data: userList } = useQuery(
    "userList",
    fetchUserList,
    {
      initialData: [],
    }
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      status: TicketStatusList[0],
    },
  });

  const initialLoading = userListLoading || regionListLoading;
  if (initialLoading) {
    return (
      <Box p={2}>
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  return (
    <Box p={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            required
            error={!!errors.unique_id}
            label="Unique Id"
            {...register("unique_id", { required: "This fields is required." })}
            helperText={errors.unique_id?.message}
          />
        </Stack>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            required
            error={!!errors.name}
            label="Name"
            {...register("name", { required: "This fields is required." })}
            helperText={errors.name?.message}
          />
        </Stack>
      </Stack>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <FormSelect
            label="Ticket Type"
            required
            name="ticket_type"
            control={control}
            options={TicketTypeList}
            error={!!errors.ticket_type}
            helperText={errors.ticket_type?.message}
            rules={{
              required: "This fields is required.",
            }}
          />
        </Stack>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <FormSelect
            label="Network Type"
            required
            name="network_type"
            control={control}
            options={NetworkTypeList}
            error={!!errors.network_type}
            helperText={errors.network_type?.message}
            rules={{
              required: "This fields is required.",
            }}
          />
        </Stack>
      </Stack>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <FormSelect
            label="Region"
            required
            name="regionId"
            control={control}
            options={map(regionList, (d) => ({ value: d.id, label: d.name }))}
            error={!!errors.regionId}
            helperText={errors.regionId?.message}
            rules={{
              required: "This fields is required.",
            }}
          />
        </Stack>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <FormSelect
            label="Assign to"
            required
            name="assigneeId"
            control={control}
            options={map(userList, (d) => ({
              value: d.id,
              label: `${d.name} - ${d.username}`,
            }))}
            error={!!errors.assigneeId}
            helperText={errors.assigneeId?.message}
            rules={{
              required: "This fields is required.",
            }}
          />
        </Stack>
      </Stack>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <FormSelect
            label="Status"
            required
            name="status"
            control={control}
            options={TicketStatusList}
            error={!!errors.status}
            helperText={errors.status?.message}
            rules={{
              required: "This fields is required.",
            }}
          />
          <FormDatePicker
            errors={errors}
            label="Target Date"
            required
            name="due_date"
            control={control}
            rules={{
              required: "This fields is required.",
            }}
          />
        </Stack>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            label="Remarks"
            multiline
            rows={2}
            {...register("remarks")}
            error={!!errors.remarks}
            helperText={errors.remarks?.message}
          />
        </Stack>
      </Stack>
      <Stack p={4} sx={{ alignItems: "flex-end" }}>
        <Button type="submit" startIcon={<Done />}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default AddTicketForm;
