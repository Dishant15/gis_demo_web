import React from "react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import ExpandMore from "components/common/ExpandMore";

import AcceptImg from "assets/accept.png";
import CancelImg from "assets/cancel.png";
import InprogressImg from "assets/inprogress.png";
import { Box, TextField, Stack, InputLabel } from "@mui/material";
import { workOrderStatusTypes } from "utils/constant";
import { map } from "lodash";

const WorkOrderItem = ({
  surveyWorkorder,
  expanded,
  handleExpandClick,
  selectedSurveyId,
  handleSurveySelect,
}) => {
  /**
   * Parent:
   *    WorkOrderPage
   */
  const { id, name, status, address, tags, updated_on, units, center } =
    surveyWorkorder;

  const formatedUpdatedOn = format(new Date(updated_on), "do MMM, hh:mm aaa");
  const isExpanded = expanded.has(id);

  return (
    <Card elevation={0} sx={{ maxWidth: 345, backgroundColor: "#efefef" }}>
      <CardHeader
        avatar={<StatusAvatar status={status} />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={formatedUpdatedOn}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {address}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={handleSurveySelect(id, center)}
        >
          {id === selectedSurveyId ? (
            <MyLocationIcon />
          ) : (
            <LocationSearchingIcon />
          )}
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={isExpanded}
          onClick={handleExpandClick(id)}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        {units.map((unit) => {
          return (
            <CardContent key={unit.id}>
              <Typography sx={{ fontWeight: "bold" }} paragraph>
                {unit.name}:
              </Typography>
              <Typography paragraph>
                Total Home pass: {unit.total_home_pass} <br />
                tags: {unit.tags}
              </Typography>
            </CardContent>
          );
        })}
      </Collapse>
    </Card>
  );
};

const StatusAvatar = ({ status }) => {
  if (status === "S") {
    return <Avatar alt={status} src={AcceptImg} />;
  } else if (status === "R") {
    return <Avatar alt={status} src={CancelImg} />;
  } else if (status === "V") {
    return <Avatar alt={status} src={InprogressImg} />;
  }
  return null;
};

const StatusChangeForm = ({ remarks, status }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      remarks: remarks || "",
      status: status || null,
    },
  });

  return (
    <Stack>
      <TextField
        label="Remarks"
        multiline
        rows={2}
        {...register("remarks")}
        error={!!errors.remarks}
        helperText={errors.remarks?.message}
      />
      {/* <Controller
        render={({ field }) => {
          return (
            <>
              <InputLabel>Status</InputLabel>
              {map(workOrderStatusTypes, (wStatus) => {
                const selected = field.value === wStatus.value;
                return (
                  <Chip
                    color={selected ? wStatus.color : undefined}
                    key={wStatus.value}
                    label={wStatus.label}
                    onClick={handleFilterClick(wStatus.value)}
                  />
                );
              })}
            </>
          );
        }}
        name={name}
        control={control}
        rules={rules}
      /> */}
    </Stack>
  );
};

export default WorkOrderItem;
