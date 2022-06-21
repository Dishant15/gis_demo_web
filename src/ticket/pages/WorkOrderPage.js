import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { cloneDeep, filter, isEqual, isNull, map, size } from "lodash";

import { Box, Divider, Stack, Typography, Chip, Popover } from "@mui/material";

import WorkOrderLoading from "ticket/components/WorkOrderLoading";
import WorkOrderMap from "ticket/components/WorkOrderMap";
import WorkOrderItem from "ticket/components/WorkOrderItem";

import { fetchTicketWorkorders, updateWorkOrder } from "ticket/data/services";
import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";
import { workOrderStatusTypes } from "utils/constant";
import { addNotification } from "redux/reducers/notification.reducer";

import "../styles/ticket_survey_list.scss";
import StatusChangeForm from "ticket/components/StatusChangeForm";

const WorkOrderPage = () => {
  /**
   * Parent:
   *    App
   */

  // query and mutations
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, data, refetch } = useQuery(
    ["ticketWorkOrderList", ticketId],
    fetchTicketWorkorders,
    { initialData: {} }
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

  // data Transformation stage
  const ticketData = useMemo(() => {
    let ticket = cloneDeep(data);
    if (!size(ticket)) return {};
    // work order here is Survey workorder
    let { area_pocket, work_orders } = ticket;

    ticket.survey_count = size(work_orders);
    // convert area coordinate data
    area_pocket.coordinates = coordsToLatLongMap(area_pocket.coordinates);
    area_pocket.center = coordsToLatLongMap([area_pocket.center])[0];
    // convert work_orders coordinate, tags data
    for (let s_ind = 0; s_ind < work_orders.length; s_ind++) {
      const survey = work_orders[s_ind];
      const { units } = survey;
      // convert work_orders.units coordinate, tags data
      survey.coordinates = coordsToLatLongMap(survey.coordinates);
      survey.center = coordsToLatLongMap([survey.center])[0];
      survey.tags = survey.tags.toString().split(",");
      for (let u_ind = 0; u_ind < units.length; u_ind++) {
        const unit = units[u_ind];
        // convert work_orders.units coordinate, tags data
        unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
        unit.tags = unit.tags.toString().split(",");
      }
    }

    return ticket;
  }, [data]);
  const { area_pocket, work_orders = [] } = ticketData;

  // set states
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [surveyMapEdit, setSurveyMapEdit] = useState(null);
  const [surveyStatusEdit, setSurveyStatusEdit] = useState(null); // set clicked anchor
  const [surveyData, setSurveyData] = useState({});

  const [expanded, setExpanded] = useState(new Set([]));
  const [mapCenter, setMapCenter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(null);
  // filter work orders according to statusFilter
  const filteredWorkOrders = isNull(statusFilter)
    ? [...work_orders]
    : filter(work_orders, ["status", statusFilter]);

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
    },
    [selectedSurveyId]
  );

  // survey status edit logic
  const handleSurveyStatusEdit = useCallback(
    (event) => {
      setSurveyStatusEdit(event.target);
    },
    [setSurveyStatusEdit]
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

  // survey polygon edit logic

  const handleSurveyMapEdit = useCallback(
    (survey) => () => {
      setSurveyMapEdit(survey);
    },
    [setSurveyMapEdit]
  );

  const handleEditCancel = useCallback(() => {
    setSurveyMapEdit(null);
  }, [setSurveyMapEdit]);

  const handleEditSubmit = useCallback(
    (data) => {
      editSurveyMutation({
        workOrderId: data.id,
        data: { coordinates: latLongMapToCoords(data.coordinates) },
      });
      setSurveyMapEdit(null);
    },
    [setSurveyMapEdit]
  );

  const handleExpandClick = useCallback(
    (surveyId) => () => {
      setExpanded((surveyIdSet) => {
        let newSet = new Set(surveyIdSet);
        if (newSet.has(surveyId)) {
          newSet.delete(surveyId);
        } else {
          newSet.add(surveyId);
        }
        return newSet;
      });
    },
    []
  );

  const showStatusPopover = !isNull(surveyStatusEdit);

  if (isLoading) {
    return <WorkOrderLoading />;
  }

  return (
    <Box id="dash-task-list">
      <Typography className="dtl-title" variant="h5" color="primary.dark">
        Workorders : {ticketData.name}
      </Typography>

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
            {!size(work_orders) ? (
              <Typography variant="h6" textAlign="center">
                No workorders submitted yet
              </Typography>
            ) : null}
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="body1">Filter By :</Typography>
              {map(workOrderStatusTypes, (wStatus) => {
                const selected = statusFilter === wStatus.value;
                return (
                  <Chip
                    color={selected ? wStatus.color : undefined}
                    key={wStatus.value}
                    label={wStatus.label}
                    onClick={handleFilterClick(wStatus.value)}
                  />
                );
              })}
            </Stack>
            {filteredWorkOrders.map((surveyWorkorder) => {
              return (
                <WorkOrderItem
                  key={surveyWorkorder.id}
                  surveyWorkorder={surveyWorkorder}
                  expanded={expanded}
                  handleExpandClick={handleExpandClick}
                  selectedSurveyId={selectedSurveyId}
                  handleSurveySelect={handleSurveySelect}
                  handleSurveyMapEdit={handleSurveyMapEdit}
                  handleSurveyStatusEdit={handleSurveyStatusEdit}
                  setSurveyData={setSurveyData}
                />
              );
            })}
          </Stack>
        </Box>
        <Box sx={{ flex: 4 }} py={2}>
          <WorkOrderMap
            areaPocket={area_pocket}
            surveyList={work_orders}
            surveyMapEdit={surveyMapEdit}
            editSurveyLoading={editSurveyLoading}
            onEditCancel={handleEditCancel}
            onEditComplete={handleEditSubmit}
            highlightSurvey={selectedSurveyId}
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
