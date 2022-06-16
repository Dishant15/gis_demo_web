import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { cloneDeep, size } from "lodash";

import { Box, Divider, Stack, Typography } from "@mui/material";

import WorkOrderLoading from "ticket/components/WorkOrderLoading";
import WorkOrderMap from "ticket/components/WorkOrderMap";

import { fetchTicketWorkorders } from "ticket/data/services";
import { coordsToLatLongMap } from "utils/map.utils";

import "../styles/ticket_survey_list.scss";
import WorkOrderItem from "ticket/components/WorkOrderItem";

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

  const handleSurveySelect = useCallback(
    (surveyId) => () => {
      if (surveyId === selectedSurveyId) {
        setSelectedSurveyId(null);
      } else {
        setSelectedSurveyId(surveyId);
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
            {work_orders.map((surveyWorkorder) => {
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
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default WorkOrderPage;
