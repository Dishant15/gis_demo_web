import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { get, size } from "lodash";
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
import TaskLoading from "./components/TaskLoading";

import { fetchUserTasks } from "./data/task.services";

import "./styles/dash_task_list.scss";
import TaskListMap from "./components/TaskListMap";
import { coordsToLatLongMap } from "../utils/map.utils";
import { DraftsTwoTone } from "@mui/icons-material";

const DashTaskList = () => {
  const { isLoading, data } = useQuery("userTaskList", fetchUserTasks);

  const userTaskList = useMemo(() => {
    let resultData = data ? [...data] : [];
    for (let r_ind = 0; r_ind < resultData.length; r_ind++) {
      const userTask = resultData[r_ind];
      let { area_pocket, survey_boundaries } = userTask;

      userTask.survey_count = size(survey_boundaries);
      // convert area coordinate data
      area_pocket.coordinates = coordsToLatLongMap(area_pocket.coordinates);
      // convert survey_boundaries coordinate, tags data
      for (let s_ind = 0; s_ind < survey_boundaries.length; s_ind++) {
        const survey = survey_boundaries[s_ind];
        const { units } = survey;
        // convert survey_boundaries.units coordinate, tags data
        survey.coordinates = coordsToLatLongMap(survey.coordinates);
        survey.tags = survey.tags.toString().split(",");
        for (let u_ind = 0; u_ind < units.length; u_ind++) {
          const unit = units[u_ind];
          // convert survey_boundaries.units coordinate, tags data
          unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
          unit.tags = unit.tags.toString().split(",");
        }
      }
    }

    return resultData;
  }, [data]);

  // on task select we will actually set area of given task
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [surveyList, setSurveyList] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  const handleTaskSelect = (task) => (event, isExpanded) => {
    const { id, area_pocket, survey_boundaries } = task;

    setSelectedTask(isExpanded ? id : null);
    setSelectedArea(isExpanded ? area_pocket : null);
    setSurveyList(isExpanded ? survey_boundaries : []);
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
    return <TaskLoading />;
  }

  return (
    <Box id="dash-task-list" sx={{ backgroundColor: "#efefef" }}>
      <Typography className="dtl-title" variant="h5">
        Ongoing Tasks
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
            {userTaskList.map((userTask) => {
              const { id, name, area_pocket, survey_boundaries } = userTask;
              return (
                <Accordion
                  key={id}
                  expanded={selectedTask === id}
                  onChange={handleTaskSelect(userTask)}
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
                      {area_pocket.area}, {area_pocket.pincode}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {!size(survey_boundaries) ? (
                      <Typography variant="h6" textAlign="center">
                        No survey added to this task yet
                      </Typography>
                    ) : null}
                    <List>
                      {survey_boundaries.map((survey) => {
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
                              // color: isActive ? "white" : "inherit",
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
                                primary={name}
                                secondary={`- ${created_by} @ ${updated_date}`}
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
          <TaskListMap
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

export default DashTaskList;
