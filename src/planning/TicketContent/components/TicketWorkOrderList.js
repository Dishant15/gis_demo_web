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
import Badge from "@mui/material/Badge";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import LanguageIcon from "@mui/icons-material/Language";

import ChangeForm from "ticket/components/StatusChangeForm";

import { addNotification } from "redux/reducers/notification.reducer";
import { getPlanningTicketId } from "planning/data/planningGis.selectors";
import {
  fetchTicketWorkorderDataThunk,
  updateTicketWorkOrder,
} from "planning/data/ticket.services";

import { LayerKeyMappings } from "planning/GisMap/utils";
import { Paper } from "@mui/material";
import { onTicketWoShowOnMapClick } from "planning/data/planning.actions";
import { workOrderStatusFormTypes, workOrderStatusTypes } from "utils/constant";
import {
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from "planning/data/planningState.selectors";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";

/**
 * Parent
 *   TicketSideBar
 */
const TicketWorkOrderList = ({ workOrderList = [] }) => {
  const dispatch = useDispatch();
  const $anchorEl = useRef();
  const [statusData, setStatusData] = useState({});
  const ticketId = useSelector(getPlanningTicketId);

  const regionIdList = useSelector(getSelectedRegionIds);
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);

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
              // refetch layer data on verify workorder
              if (data.status === workOrderStatusFormTypes.V.value) {
                for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
                  const currLayerKey = selectedLayerKeys[l_ind];
                  dispatch(
                    fetchLayerDataThunk({
                      regionIdList,
                      layerKey: currLayerKey,
                    })
                  );
                }
              }
            },
          }
        );
      }
    },
    [statusData, regionIdList, selectedLayerKeys]
  );

  const handleShowOnMap = useCallback(
    (workOrder) => () => {
      dispatch(onTicketWoShowOnMapClick(workOrder));
    },
    []
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
    <Stack spacing={1} divider={<Divider />} py={2}>
      {workOrderList.map((workOrder) => {
        const { id, status, layer_key, element, work_order_type } = workOrder;
        const showStatusChangeIcon = status !== "V";
        const Icon =
          LayerKeyMappings[layer_key]["getViewOptions"](element).icon;

        return (
          <Stack
            key={id}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              borderLeft: "5px solid",
              borderLeftColor:
                work_order_type === "A" ? "success.main" : "warning.main",
            }}
          >
            <Tooltip title={get(workOrderStatusTypes, [status, "label"])}>
              <Paper
                sx={{
                  width: "42px",
                  height: "42px",
                  lineHeight: "42px",
                  textAlign: "center",
                  marginLeft: "8px",
                }}
              >
                <Badge color={getStatusColor(status)} badgeContent=" ">
                  <img className="responsive-img" src={Icon} alt={layer_key} />
                </Badge>
              </Paper>
            </Tooltip>

            <Stack flex={1} flexDirection="row">
              <Box flex={1}>
                <Typography variant="subtitle1" lineHeight={1.1}>
                  {get(element, "name", "")}
                </Typography>
                <Typography variant="caption">
                  #{get(element, "network_id", "")}
                </Typography>
              </Box>
              <Tooltip title="Show on map">
                <IconButton
                  aria-label="show-location"
                  onClick={handleShowOnMap(workOrder)}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              {showStatusChangeIcon ? (
                <Tooltip title="Change Status">
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

const getStatusColor = (status) => {
  switch (status) {
    case "V":
      return "success";
    case "R":
      return "error";
    case "S":
      return "warning";
    default:
      return "secondary";
  }
};

export default TicketWorkOrderList;
