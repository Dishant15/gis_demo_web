import React, { useCallback } from "react";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { pick, get, find } from "lodash";

import { Box, TextField, Stack, Divider, Chip, Skeleton } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormDatePicker, FormSelect } from "components/common/FormFields";
import {
  NetworkTypeList,
  TicketTypeList,
  TicketStatusList,
} from "utils/constant";
import { fetchRegionList } from "region/data/services";
import { fetchUserList } from "gis_user/data/services";
import { generateTicketUid } from "ticket/data/utils";
import { nanoid } from "planning/GisMap/utils";

const TicketFormWrapper = ({
  formData,
  isEdit,
  handleFormSubmit,
  formCancelButton,
  isButtonLoading,
  formActionProps,
  formSubmitButtonProps,
  formSubmitButtonText,
}) => {
  /**
   * Parent:
   *    TicketEditPage
   *    TicketAddForm
   *    TicketLayerForm
   */
  const { isLoading: regionListLoading, data: regionList = [] } = useQuery(
    ["regionList", "data"],
    fetchRegionList
  );

  const { isLoading: userListLoading, data: userList = [] } = useQuery(
    "userList",
    fetchUserList
  );

  const isLoading = regionListLoading || userListLoading;
  if (isLoading) {
    return (
      <Box p={2}>
        <Skeleton animation="wave" height="30rem" />
      </Box>
    );
  }

  return (
    <TicketForm
      formData={formData}
      regionList={regionList}
      userList={userList}
      isEdit={isEdit}
      handleFormSubmit={handleFormSubmit}
      formCancelButton={formCancelButton}
      isButtonLoading={isButtonLoading}
      formActionProps={formActionProps}
      formSubmitButtonProps={formSubmitButtonProps}
      formSubmitButtonText={formSubmitButtonText}
      randomTicketId={nanoid()}
    />
  );
};

const TicketForm = ({
  formData,
  regionList,
  userList,
  handleFormSubmit,
  isEdit,
  randomTicketId,
  formCancelButton = null,
  isButtonLoading = false,
  formActionProps = {},
  formSubmitButtonProps = {},
  formSubmitButtonText = "Submit",
}) => {
  /**
   * TicketFormWrapper
   */
  const handleTicketDetailsSubmit = useCallback(
    (data) => {
      let ticketSubmitData = pick(data, [
        "due_date",
        "name",
        "remarks",
        "unique_id",
      ]);
      // transform ticket data into server acceptable data
      ticketSubmitData.status = data.status;
      ticketSubmitData.ticket_type = data.ticket_type;
      ticketSubmitData.network_type = data.network_type;
      ticketSubmitData.assigneeId = data.assignee.id;
      ticketSubmitData.regionId = data.region.id;
      handleFormSubmit(ticketSubmitData);
    },
    [handleFormSubmit]
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      name: get(formData, "name", ""),
      remarks: get(formData, "remarks", ""),
      unique_id: get(formData, "unique_id", `TKT.${randomTicketId}`),
      network_id: get(formData, "network_id", `RGN-TKT.${randomTicketId}`),
      status: get(formData, "status") || "A",
      due_date: get(formData, "due_date") ? new Date(formData.due_date) : "",
      ticket_type: get(formData, "ticket_type"),
      network_type: get(formData, "network_type"),
      assignee: find(userList, ["id", get(formData, "assignee")]),
      region: find(regionList, ["id", get(formData, "region.id")]),
    },
  });

  const handleUniqueIdOnClose = useCallback(() => {
    const [region, ticket_type] = getValues(["region", "ticket_type"]);
    const unique_id = generateTicketUid(get(region, "unique_id"), ticket_type);
    setValue("unique_id", `${unique_id}.${randomTicketId}`);
    setValue(
      "network_id",
      `${get(region, "unique_id")}-${unique_id}.${randomTicketId}`
    );
  }, [randomTicketId]);

  return (
    <Box
      p={2}
      component="form"
      onSubmit={handleSubmit(handleTicketDetailsSubmit)}
      sx={{
        overflow: "auto",
      }}
    >
      <Divider textAlign="right">
        <Chip label="Network" />
      </Divider>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          py={2}
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <FormSelect
            label="Select Region"
            required
            isDisabled={isEdit}
            name="region"
            control={control}
            options={regionList}
            labelKey="name"
            valueKey="id"
            simpleValue
            error={!!errors.region}
            helperText={errors.region?.message}
            onBlur={handleUniqueIdOnClose}
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
            label="Ticket Type"
            required
            isDisabled={isEdit}
            name="ticket_type"
            control={control}
            options={TicketTypeList}
            error={!!errors.ticket_type}
            helperText={errors.ticket_type?.message}
            onBlur={handleUniqueIdOnClose}
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

      <Divider textAlign="right">
        <Chip label="Details" />
      </Divider>
      <Stack my={2} spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            InputLabelProps={{
              required: true,
            }}
            error={!!errors.unique_id}
            label="Unique Id"
            disabled={true}
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
            InputLabelProps={{
              required: true,
            }}
            error={!!errors.network_id}
            label="Network Id"
            disabled={true}
            {...register("network_id", {
              required: "This fields is required.",
            })}
            helperText={errors.network_id?.message}
          />
        </Stack>
      </Stack>

      <Stack my={2} spacing={2} direction={{ md: "row", xs: "column" }}>
        <Stack
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          <TextField
            InputLabelProps={{
              required: true,
            }}
            error={!!errors.name}
            label="Name"
            {...register("name", { required: "This fields is required." })}
            helperText={errors.name?.message}
          />
        </Stack>
      </Stack>

      <Divider textAlign="right">
        <Chip label="User Info" />
      </Divider>
      <Stack spacing={2} direction={{ md: "row", xs: "column" }}>
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
            simpleValue
            name="assignee"
            control={control}
            options={userList}
            getOptionLabel={(opt) => `${opt.name} - ${opt.username}`}
            getOptionValue={(opt) => opt.id}
            labelKey="name"
            valueKey="id"
            error={!!errors.assignee}
            helperText={errors.assignee?.message}
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
            errors={!!errors.due_date}
            helperText={errors.due_date?.message}
            label="Select due date"
            required
            name="due_date"
            control={control}
            rules={{
              required: "This fields is required.",
            }}
            popupStyle={{
              bottom: "calc(100% + 1em)",
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
      <Stack flex={1} direction="row" {...formActionProps}>
        {formCancelButton}
        <LoadingButton
          type="submit"
          loading={isButtonLoading}
          {...formSubmitButtonProps}
        >
          {formSubmitButtonText}
        </LoadingButton>
      </Stack>
    </Box>
  );
};

export default TicketFormWrapper;
