import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { cloneDeep, filter, isNull, map, size } from "lodash";

import { Box, Divider, Stack, Typography, Chip } from "@mui/material";

import WorkOrderLoading from "ticket/components/WorkOrderLoading";
import WorkOrderMap from "ticket/components/WorkOrderMap";

import { fetchTicketWorkorders } from "ticket/data/services";
import { coordsToLatLongMap } from "utils/map.utils";

import "../styles/ticket_survey_list.scss";
import WorkOrderItem from "ticket/components/WorkOrderItem";
import { workOrderStatusTypes } from "utils/constant";

const WorkOrderPage = () => {
  /**
   * Parent:
   *    App
   */
  const { ticketId } = useParams();
  const { isLoading, data } = useQuery(
    ["ticketWorkOrderList", ticketId],
    fetchTicketWorkorders,
    { initialData: {} }
  );

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

  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [expanded, setExpanded] = useState(new Set([]));
  const [mapCenter, setMapCenter] = useState(undefined);
  const [workorderStatus, setWorkorderStatus] = useState(null);
  // filter work orders according to workorderStatus
  const filteredWorkOrders = isNull(workorderStatus)
    ? [...work_orders]
    : filter(work_orders, ["status", workorderStatus]);

  const handleSurveySelect = useCallback(
    (surveyId, center) => () => {
      if (surveyId === selectedSurveyId) {
        setSelectedSurveyId(null);
        setMapCenter(undefined);
      } else {
        setSelectedSurveyId(surveyId);
        setMapCenter(center);
      }
    },
    [selectedSurveyId]
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

  const handleFilterClick = useCallback(
    (newStatus) => () => {
      setWorkorderStatus((currStatus) =>
        currStatus === newStatus ? null : newStatus
      );
    },
    []
  );

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
              <Typography variant="body1">Filter By</Typography>
              {map(workOrderStatusTypes, (wStatus) => {
                const selected = workorderStatus === wStatus.value;
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
                />
              );
            })}
          </Stack>
        </Box>
        <Box sx={{ flex: 4 }} py={2}>
          <WorkOrderMap
            areaPocket={area_pocket}
            surveyList={work_orders}
            highlightSurvey={selectedSurveyId}
            onSurveySelect={handleSurveySelect}
            center={mapCenter}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default WorkOrderPage;
