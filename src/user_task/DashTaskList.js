import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { get, size } from "lodash";

import { Box, Stack, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskLoading from "./components/TaskLoading";

import { fetchUserTasks } from "./data/task.services";

import "./styles/dash_task_list.scss";
import TaskListMap from "./components/TaskListMap";
import { coordsToLatLongMap } from "../utils/map.utils";

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
  const [selectedSurveyInd, setSelectedSurveyInd] = useState(null);

  const handleTaskSelect = (task) => (event, isExpanded) => {
    console.log(
      "🚀 ~ file: DashTaskList.js ~ line 56 ~ handleTaskSelect ~ task",
      task
    );
    const { id, area_pocket, survey_boundaries } = task;

    setSelectedTask(isExpanded ? id : null);
    setSelectedArea(area_pocket);
    setSurveyList(survey_boundaries);
  };

  if (isLoading) {
    return <TaskLoading />;
  }

  return (
    <Box id="dash-task-list">
      <Typography
        className="dtl-title"
        variant="h4"
        sx={{ backgroundColor: "primary.light", color: "whitesmoke" }}
      >
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
              const { id, name } = userTask;
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
                      I am an accordion
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Nulla facilisi. Phasellus sollicitudin nulla et quam
                      mattis feugiat. Aliquam eget maximus est, id dignissim
                      quam.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </Box>
        <Box sx={{ flex: 4 }}>
          <TaskListMap areaPocket={selectedArea} surveyList={surveyList} />
        </Box>
      </Stack>
    </Box>
  );
};

export default DashTaskList;
