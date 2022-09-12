import React, { useCallback, useState } from "react";
import { noop, pick, isEqual } from "lodash";
import { format } from "date-fns";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

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

import StatusChangeForm from "./StatusChangeForm";

import { addNotification } from "redux/reducers/notification.reducer";
import { updateTicketWorkOrder } from "planning/data/ticket.services";

import AcceptImg from "assets/accept.png";
import CancelImg from "assets/cancel.png";
import InprogressImg from "assets/inprogress.png";

export const getTicketElementId = (id) => {
  return `ticket-workorder-${id}`;
};

const TicketWorkOrderList = ({ workOrderList = [] }) => {
  const [statusData, setStatusData] = useState({});
  const dispatch = useDispatch();

  const { mutate, isLoading } = useMutation(
    (mutationData) => {
      // mutationData : { workOrderId, {...data to edit} }
      updateTicketWorkOrder(mutationData);
    },
    {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
            title: "workorder update",
            text: "workorder status updated successfully",
          })
        );
        // refetch();
      },
    }
  );

  const handleStatusEdit = useCallback(
    (workOrder) => (e) => {
      setStatusData(pick(workOrder, ["id", "status", "remark"]));
    },
    []
  );

  const handleStatusCancel = useCallback(() => {
    setStatusData({});
  }, []);

  const handleStatusEditSubmit = useCallback(
    (data) => {
      if (isEqual(data, statusData)) {
        handleStatusCancel();
      } else {
        mutate(
          {
            workOrderId: data.id,
            data: { status: data.status, remark: data.remark },
          },
          {
            onSuccess: handleStatusCancel,
          }
        );
      }
    },
    [statusData]
  );

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
                  <IconButton
                    aria-label="settings"
                    id={getTicketElementId(id)}
                    onClick={handleStatusEdit(workOrder)}
                  >
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
      <StatusChangeForm
        statusData={statusData}
        handleStatusCancel={handleStatusCancel}
        isLoading={isLoading}
        handleStatusEditSubmit={handleStatusEditSubmit}
      />
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
