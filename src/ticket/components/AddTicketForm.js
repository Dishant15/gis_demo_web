import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { map, pick } from "lodash";

import { Box, TextField, Stack, Button } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { FormDatePicker, FormSelect } from "components/common/FormFields";
import {
  NetworkTypeList,
  TicketTypeList,
  TicketStatusList,
} from "utils/constant";
import { fetchRegionList } from "region/data/services";
import { fetchUserList } from "gis_user/data/services";
import { getTicketListPage } from "utils/url.constants";
import { coordsToLatLongMap } from "utils/map.utils";

const AddTicketForm = ({ formData, onSubmit }) => {
  console.log(
    "🚀 ~ file: AddTicketForm.js ~ line 23 ~ AddTicketForm ~ formData",
    formData
  );
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

  const handleTicketDetailsSubmit = useCallback(
    (formData) => {
      let ticketSubmitData = pick(formData, [
        "due_date",
        "name",
        "remarks",
        "unique_id",
      ]);
      // transform ticket data into server acceptable data
      ticketSubmitData.status = formData.status.value;
      ticketSubmitData.ticket_type = formData.ticket_type.value;
      ticketSubmitData.network_type = formData.network_type.value;
      ticketSubmitData.assigneeId = formData.assigneeId.value;
      ticketSubmitData.regionId = formData.region.id;
      ticketSubmitData.regionCoords = coordsToLatLongMap(
        formData.region.coordinates
      );
      // navigate to next step
      onSubmit(ticketSubmitData);
    },
    [onSubmit]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      status: TicketStatusList[0],
    },
  });

  return (
    <Box
      p={2}
      component="form"
      onSubmit={handleSubmit(handleTicketDetailsSubmit)}
    >
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
            name="region"
            control={control}
            options={regionList}
            getOptionLabel={(opt) => opt.name}
            getOptionValue={(opt) => opt.id}
            error={!!errors.regionId}
            helperText={errors.regionId?.message}
            isLoading={regionListLoading}
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
            isLoading={userListLoading}
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
      <Stack flex={1} p={4} direction="row" sx={{ alignItems: "flex-end" }}>
        <Button
          variant="contained"
          color="error"
          component={Link}
          to={getTicketListPage()}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          type="submit"
          startIcon={<ArrowForwardIosIcon />}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default AddTicketForm;
