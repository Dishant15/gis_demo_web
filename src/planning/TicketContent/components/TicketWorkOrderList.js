import React, { useCallback, useRef, useState } from "react";
import { pick, isEqual, size } from "lodash";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import ChangeForm from "ticket/components/StatusChangeForm";

import { addNotification } from "redux/reducers/notification.reducer";
import { getPlanningTicketId } from "planning/data/planningGis.selectors";
import {
  fetchTicketWorkorderDataThunk,
  updateTicketWorkOrder,
} from "planning/data/ticket.services";

import { LayerKeyMappings } from "planning/GisMap/utils";

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

  if (!size(workOrderList)) {
    return (
      <Box px={2} py="20%">
        <Typography variant="h5">
          No workOrders added to this ticket yet !!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} divider={<Divider />} my={1}>
      {workOrderList.map((workOrder) => {
        const { status, layer_key, element, work_order_type } = workOrder;
        const showStatusChangeIcon = status !== "V";
        const Icon = LayerKeyMappings[layer_key]["getViewOptions"]({}).icon;

        return (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              borderLeft: "5px solid",
              borderLeftColor:
                work_order_type === "A" ? "success.main" : "error.main",
            }}
          >
            <Box className="pl-layer-icon-block">
              <Box className="icon-wrapper">
                <img src={Icon} alt={layer_key} />
              </Box>
            </Box>
            <Stack flex={1} flexDirection="row">
              <Box>
                <Typography
                  variant="subtitle1"
                  lineHeight={1.1}
                  fontWeight={500}
                  fontSize="1.1rem"
                >
                  {get(element, "name", "")} {get(element, "name", "")}{" "}
                  {get(element, "name", "")}
                </Typography>
                <Typography variant="body2">
                  {get(element, "network_id", "")}
                </Typography>
              </Box>
              {showStatusChangeIcon ? (
                <Tooltip title="Change Status" placement="top">
                  <IconButton
                    aria-label="settings"
                    onClick={handleStatusEdit(workOrder)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box width="40px" />
              )}
            </Stack>
          </Stack>
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

export default TicketWorkOrderList;
