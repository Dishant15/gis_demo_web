import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import {
  filter,
  isEqual,
  isNull,
  map,
  pick,
  size,
  get,
  orderBy,
  countBy,
} from "lodash";

import {
  Box,
  Divider,
  Stack,
  Typography,
  Chip,
  Popover,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import WorkOrderLoading from "ticket/components/WorkOrderLoading";
import WorkOrderMap from "ticket/components/WorkOrderMap";
import WorkOrderItem from "ticket/components/WorkOrderItem";
import StatusChangeForm from "ticket/components/StatusChangeForm";

import {
  fetchTicketDetails,
  fetchTicketWorkorders,
  updateWorkOrder,
} from "ticket/data/services";
import { workOrderStatusTypes } from "utils/constant";
import { addNotification } from "redux/reducers/notification.reducer";
import { checkUserPermission } from "redux/selectors/auth.selectors";

import "../styles/ticket_survey_list.scss";

const WorkOrderPage = () => {
  /**
   * Parent:
   *    App
   */

  // query and mutations
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const canTicketWorkorderEdit = useSelector(
    checkUserPermission("ticket_workorder_edit")
  );

  const {
    isLoading,
    data: work_orders,
    refetch,
  } = useQuery(["ticketWorkOrderList", ticketId], fetchTicketWorkorders);

  const { isLoading: isTicketLoading, data: ticketData } = useQuery(
    ["ticketDetails", ticketId],
    fetchTicketDetails
  );

  const { mutate: editSurveyMutation, isLoading: editSurveyLoading } =
    useMutation(
      (mutationData) => {
        // mutationData : { workOrderId, {...data to edit} }
        updateWorkOrder(mutationData);
      },
      {
        onSuccess: () => {
          dispatch(
            addNotification({
              type: "success",
              title: "Survey update",
              text: "Survey coordinates updated successfully",
            })
          );
          refetch();
        },
      }
    );

  const { area_pocket } = {};
  const countByStatus = countBy(work_orders, "status");
  // set states
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [surveyStatusEdit, setSurveyStatusEdit] = useState(null); // set clicked anchor
  const [surveyData, setSurveyData] = useState({});

  const [mapCenter, setMapCenter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    if (!mapCenter) {
      if (!!area_pocket?.center) {
        setMapCenter(area_pocket.center);
      }
    }
  }, [area_pocket, mapCenter]);

  // filter work orders according to statusFilter
  const filteredWorkOrders = isNull(statusFilter)
    ? [...(work_orders || [])]
    : filter(work_orders || [], ["status", statusFilter]);

  // Survey filter logic
  const handleFilterClick = useCallback(
    (newStatus) => () => {
      setStatusFilter((currStatus) =>
        currStatus === newStatus ? null : newStatus
      );
    },
    []
  );

  const handleSurveySelect = useCallback(
    (surveyId, center) => () => {
      if (surveyId === selectedSurveyId) {
        setSelectedSurveyId(null);
      } else {
        setSelectedSurveyId(surveyId);
        if (!!center) {
          setMapCenter(center);
        }
      }
      // center exist if clicked on workorder item
      if (!center) {
        // find list element using data-id from workorder item list
        const $ele = document.querySelector(`div[data-id='${surveyId}']`);
        if ($ele) {
          $ele.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [selectedSurveyId]
  );

  // survey status edit logic

  const handleSurveyStatusEdit = useCallback(
    (event, data) => {
      setSurveyStatusEdit(event.target);
      setSurveyData(pick(data, ["id", "status", "remark"]));
    },
    [setSurveyStatusEdit, setSurveyData]
  );

  const handleSurveyStatusCancel = useCallback(() => {
    setSurveyStatusEdit(null);
    setSurveyData({});
  }, [setSurveyStatusEdit, setSurveyData]);

  const handleStatusEditSubmit = useCallback(
    (data) => {
      if (isEqual(data, surveyData)) {
        handleSurveyStatusCancel();
      } else {
        editSurveyMutation(
          {
            workOrderId: data.id,
            data: { status: data.status, remark: data.remark },
          },
          {
            onSuccess: handleSurveyStatusCancel,
          }
        );
      }
    },
    [surveyData, handleSurveyStatusCancel]
  );

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const showStatusPopover = !isNull(surveyStatusEdit);
  const hasWorkorders = size(work_orders);
  const hasFilteredWorkOrders = size(filteredWorkOrders);

  if (isLoading || isTicketLoading) {
    return <WorkOrderLoading />;
  }

  return (
    <Box id="dash-task-list">
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="secondary"
          onClick={handleGoBack}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
        <Typography className="dtl-title" variant="h5" color="primary.dark">
          Workorders : {ticketData?.name}
        </Typography>
      </Stack>

      <Divider flexItem />

      <Stack
        className="dtl-content-wrapper"
        spacing={2}
        direction="row"
        height="100%"
        width="100%"
        sx={{
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 2, overflow: "auto" }} my={2}>
          <Stack spacing={2}>
            {!hasWorkorders ? (
              <Typography
                color="text.secondary"
                variant="h6"
                textAlign="center"
              >
                No workorders submitted yet
              </Typography>
            ) : null}
            {hasWorkorders ? (
              <Stack spacing={1} direction="row" alignItems="center" ml={1}>
                <Typography variant="body1">Filter :</Typography>
                {map(workOrderStatusTypes, (wStatus) => {
                  const selected = statusFilter === wStatus.value;
                  const chipLabel = `${wStatus.label} (${get(
                    countByStatus,
                    wStatus.value,
                    0
                  )})`;
                  return (
                    <Chip
                      color={selected ? wStatus.color : undefined}
                      key={wStatus.value}
                      label={chipLabel}
                      onClick={handleFilterClick(wStatus.value)}
                    />
                  );
                })}
              </Stack>
            ) : null}
            {hasFilteredWorkOrders ? (
              orderBy(filteredWorkOrders, ["id"], ["desc"]).map(
                (surveyWorkorder) => {
                  return (
                    <WorkOrderItem
                      key={surveyWorkorder.id}
                      surveyWorkorder={surveyWorkorder}
                      selectedSurveyId={selectedSurveyId}
                      handleSurveySelect={handleSurveySelect}
                      handleSurveyStatusEdit={handleSurveyStatusEdit}
                      canTicketWorkorderEdit={canTicketWorkorderEdit}
                    />
                  );
                }
              )
            ) : hasWorkorders ? (
              <Typography color="text.secondary" textAlign="center" py={8}>
                {get(workOrderStatusTypes, [statusFilter, "label"], "Filtered")}{" "}
                workorders not found
              </Typography>
            ) : null}
          </Stack>
        </Box>
        <Box sx={{ flex: 4 }} py={2}>
          <WorkOrderMap
            areaPocket={area_pocket}
            surveyList={work_orders || []}
            onSurveySelect={handleSurveySelect}
            center={mapCenter}
          />
        </Box>
        <Popover
          open={showStatusPopover}
          anchorEl={surveyStatusEdit}
          onClose={handleSurveyStatusCancel}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {showStatusPopover ? (
            <StatusChangeForm
              data={surveyData}
              editSurveyLoading={editSurveyLoading}
              onEditComplete={handleStatusEditSubmit}
              handleSurveyStatusCancel={handleSurveyStatusCancel}
            />
          ) : null}
        </Popover>
      </Stack>
    </Box>
  );
};

export default WorkOrderPage;
