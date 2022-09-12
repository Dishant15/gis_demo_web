import React, { useCallback, useRef, useState } from "react";
import { noop, pick, isEqual, size } from "lodash";
import { format } from "date-fns";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import ChangeForm from "ticket/components/StatusChangeForm";

import { addNotification } from "redux/reducers/notification.reducer";
import { getPlanningTicketId } from "planning/data/planningGis.selectors";
import {
  fetchTicketWorkorderDataThunk,
  updateTicketWorkOrder,
} from "planning/data/ticket.services";

import AcceptImg from "assets/accept.png";
import CancelImg from "assets/cancel.png";
import InprogressImg from "assets/inprogress.png";

/**
 * Parent
 *   TicketSideBar
 */
const TicketWorkOrderList = ({ workOrderList = [] }) => {
  const dispatch = useDispatch();
  const $anchorEl = useRef();
  const [statusData, setStatusData] = useState({});
  const ticketId = useSelector(getPlanningTicketId);

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
      $anchorEl.current = e.target;
      setStatusData(pick(workOrder, ["id", "status", "remark"]));
    },
    []
  );

  const handleStatusCancel = useCallback(() => {
    setStatusData({});
    $anchorEl.current = null;
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
            onSuccess: () => {
              dispatch(fetchTicketWorkorderDataThunk(ticketId));
              handleStatusCancel();
            },
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

        const showStatusChangeIcon = status !== "V";

        const formatedUpdatedOn = format(
          new Date(updated_on),
          "do MMM, hh:mm aaa"
        );

        return (
          <Card elevation={0} key={id}>
            <CardHeader
              avatar={<StatusAvatar status={status} />}
              action={
                showStatusChangeIcon ? (
                  <Tooltip title="Change Status" placement="top">
                    <IconButton
                      aria-label="settings"
                      onClick={handleStatusEdit(workOrder)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
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

      <Popover
        open={!!size(statusData)}
        anchorEl={$anchorEl.current}
        onClose={handleStatusCancel}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <ChangeForm
          data={statusData}
          editSurveyLoading={isLoading}
          onEditComplete={handleStatusEditSubmit}
          handleSurveyStatusCancel={handleStatusCancel}
        />
      </Popover>
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
