import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { cloneDeep, size } from "lodash";
import { format } from "date-fns";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import WorkOrderLoading from "ticket/components/WorkOrderLoading";
import WorkOrderMap from "ticket/components/WorkOrderMap";

import { fetchTicketWorkorders } from "ticket/data/services";
import { coordsToLatLongMap } from "utils/map.utils";

import "../styles/ticket_survey_list.scss";

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
  console.log(
    "🚀 ~ file: WorkOrderPage.js ~ line 39 ~ WorkOrderPage ~ data",
    data
  );

  const ticketList = useMemo(() => {
    let ticket = cloneDeep(data);
    if (!size(ticket)) return [];
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

    return [ticket];
  }, [data]);

  // on task select we will actually set area of given task
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [surveyList, setSurveyList] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const handleTaskSelect = (task) => (event, isExpanded) => {
    const { id, area_pocket, work_orders } = task;

    setSelectedTask(isExpanded ? id : null);
    setSelectedArea(isExpanded ? area_pocket : null);
    setSurveyList(isExpanded ? work_orders : []);
    if (isExpanded) setSelectedSurveyId(null);
  };

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

  if (isLoading) {
    return <WorkOrderLoading />;
  }

  return (
    <Box id="dash-task-list">
      <Typography className="dtl-title" variant="h5">
        Ticket Work Orders
      </Typography>

      <Stack
        className="dtl-content-wrapper"
        spacing={2}
        direction="row"
        height="100%"
        width="100%"
      >
        <Box sx={{ flex: 2 }}>
          <Stack spacing={2}>
            {!size(ticketList) ? (
              <Typography variant="h6" textAlign="center">
                No available Tickets
              </Typography>
            ) : null}
            {ticketList.map((userTicket) => {
              const { id, unique_id, name, work_orders } = userTicket;
              return (
                <Accordion
                  key={id}
                  expanded={selectedTask === id}
                  onChange={handleTaskSelect(userTicket)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      {name}
                    </Typography>
                    <Typography sx={{ color: "text.secondary" }}>
                      #{unique_id}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {!size(work_orders) ? (
                      <Typography variant="h6" textAlign="center">
                        No survey added to this task yet
                      </Typography>
                    ) : null}
                    <List>
                      {work_orders.map((survey) => {
                        const { id, name, created_by, updated_on } = survey;
                        const updated_date = format(
                          new Date(updated_on),
                          "d MMM, HH:mm"
                        );
                        const isActive = id === selectedSurveyId;
                        return (
                          <ListItem
                            disablePadding
                            key={id}
                            onClick={handleSurveySelect(id)}
                            sx={{
                              backgroundColor: isActive
                                ? "primary.light"
                                : "inherit",
                              color: isActive ? "white" : "inherit",
                            }}
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                {isActive ? (
                                  <MyLocationIcon />
                                ) : (
                                  <LocationSearchingIcon />
                                )}
                              </ListItemIcon>

                              <ListItemText
                                color={
                                  isActive ? "white !important" : "inherit"
                                }
                                primary={name}
                                secondary={`user - ${created_by}, updated on: ${updated_date}`}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </Box>
        <Box sx={{ flex: 4 }}>
          <WorkOrderMap
            areaPocket={selectedArea}
            surveyList={surveyList}
            highlightSurvey={selectedSurveyId}
            onSurveySelect={handleSurveySelect}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default WorkOrderPage;
