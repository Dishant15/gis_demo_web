import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { pick, get, find, size } from "lodash";

import { Box, TextField, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Cancel } from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { FormDatePicker, FormSelect } from "components/common/FormFields";
import {
  NetworkTypeList,
  TicketTypeList,
  TicketStatusList,
} from "utils/constant";
import { editTicket } from "ticket/data/services";
import { fetchRegionList } from "region/data/services";
import { fetchUserList } from "gis_user/data/services";
import { getTicketListPage } from "utils/url.constants";
import { coordsToLatLongMap } from "utils/map.utils";

const AddTicketForm = ({ formData, onSubmit }) => {
  /**
   * Parent:
   *    TicketEditPage
   *    TicketAddForm
   */
  const navigate = useNavigate();
  const isEdit = !!size(formData);

  const { isLoading: regionListLoading, data: regionList } = useQuery(
    "regionList",
    fetchRegionList,
    {
      initialData: [],
      onSuccess: (res) => {
        const region = find(res, ["id", get(formData, "region.id")]);
        if (region) {
          setValue("region", region);
        }
      },
    }
  );

  const { isLoading: userListLoading, data: userList } = useQuery(
    "userList",
    fetchUserList,
    {
      initialData: [],
      onSuccess: (res) => {
        const assignee = find(res, ["id", get(formData, "assignee")]);
        if (assignee) {
          setValue("assignee", assignee);
        }
      },
    }
  );

  const { mutate, isLoading: isTicketEditing } = useMutation(editTicket, {
    onSuccess: (res) => {
      navigate(getTicketListPage());
    },
  });

  const handleTicketDetailsSubmit = useCallback(
    (data) => {
      let ticketSubmitData = pick(data, [
        "due_date",
        "name",
        "remarks",
        "unique_id",
      ]);
      // transform ticket data into server acceptable data
      ticketSubmitData.status = data.status.value;
      ticketSubmitData.ticket_type = data.ticket_type.value;
      ticketSubmitData.network_type = data.network_type.value;
      ticketSubmitData.assigneeId = data.assignee.id;
      ticketSubmitData.regionId = data.region.id;
      ticketSubmitData.regionCoords = coordsToLatLongMap(
        data.region.coordinates
      );
      if (isEdit) {
        mutate({ ticketId: formData.id, data: ticketSubmitData });
      } else {
        // navigate to next step
        onSubmit(ticketSubmitData);
      }
    },
    [onSubmit]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      name: get(formData, "name", ""),
      remarks: get(formData, "remarks", ""),
      unique_id: get(formData, "unique_id", ""),
      status: find(TicketStatusList, ["value", get(formData, "status") || "A"]),
      due_date: get(formData, "due_date") ? new Date(formData.due_date) : "",
      ticket_type: find(TicketTypeList, [
        "value",
        get(formData, "ticket_type"),
      ]),
      network_type: find(NetworkTypeList, [
        "value",
        get(formData, "network_type"),
      ]),
      assignee: find(userList, ["id", get(formData, "assignee")]),
      regionId: find(regionList, ["id", get(formData, "region.id")]),
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
            disabled={isEdit}
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
            disabled={isEdit}
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
            disabled={isEdit}
            name="region"
            control={control}
            options={regionList}
            getOptionLabel={(opt) => opt.name}
            getOptionValue={(opt) => opt.id}
            error={!!errors.region}
            helperText={errors.region?.message}
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
            name="assignee"
            control={control}
            options={userList}
            getOptionLabel={(opt) => `${opt.name} - ${opt.username}`}
            getOptionValue={(opt) => opt.id}
            error={!!errors.assignee}
            helperText={errors.assignee?.message}
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
            label="Due Date"
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
      <Stack flex={1} p={4} direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          color="error"
          component={Link}
          to={getTicketListPage()}
          startIcon={<Cancel />}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="success"
          type="submit"
          endIcon={<ArrowForwardIosIcon />}
          loading={isTicketEditing}
        >
          {isEdit ? "Update" : "Next"}
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default AddTicketForm;