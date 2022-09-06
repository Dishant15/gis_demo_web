import React from "react";
import { noop } from "lodash";
import { format } from "date-fns";

import { Divider, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import AcceptImg from "assets/accept.png";
import CancelImg from "assets/cancel.png";
import InprogressImg from "assets/inprogress.png";

const TicketWorkOrderList = ({ workOrderList = [] }) => {
  return (
    <Stack spacing={2} divider={<Divider />}>
      {workOrderList.map((workOrder) => {
        const {
          id,
          status,
          layer_key,
          work_order_type_display,
          remark,
          updated_on,
        } = workOrder;
        const formatedUpdatedOn = format(
          new Date(updated_on),
          "do MMM, hh:mm aaa"
        );
        return (
          <Card elevation={0} key={id}>
            <CardHeader
              avatar={<StatusAvatar status={status} />}
              action={
                <Tooltip title="Change Status" placement="top">
                  <IconButton aria-label="settings" onClick={noop}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              }
              title={layer_key}
              subheader={formatedUpdatedOn}
            />
            <CardContent>
              <Typography mb={1} variant="body2" color="text.secondary">
                WorkOrder Type : {work_order_type_display}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remarks : {remark}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Tooltip title="View on map" placement="top">
                <IconButton aria-label="add to favorites" onClick={noop}>
                  {false ? <MyLocationIcon /> : <LocationSearchingIcon />}
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        );
      })}
    </Stack>
  );
};

const StatusAvatar = ({ status }) => {
  if (status === "V") {
    return <Avatar alt={status} src={AcceptImg} />;
  } else if (status === "R") {
    return <Avatar alt={status} src={CancelImg} />;
  } else if (status === "S") {
    return <Avatar alt={status} src={InprogressImg} />;
  }
  return null;
};

export default TicketWorkOrderList;
