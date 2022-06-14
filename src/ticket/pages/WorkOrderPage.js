import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { cloneDeep, size } from "lodash";
import { format } from "date-fns";

import { Box, Divider, Stack, Typography } from "@mui/material";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  const [expanded, setExpanded] = React.useState(false);

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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
              const { id, name, status, address, tags, updated_on, units } =
                surveyWorkorder;
              const formatedUpdatedOn = format(
                new Date(updated_on),
                "do MMM, hh:mm aaa"
              );

              return (
                <Card
                  key={id}
                  elevation={0}
                  sx={{ maxWidth: 345, backgroundColor: "#efefef" }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {status}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={name}
                    subheader={formatedUpdatedOn}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {address}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton
                      aria-label="add to favorites"
                      onClick={handleSurveySelect(id)}
                    >
                      {id === selectedSurveyId ? (
                        <MyLocationIcon />
                      ) : (
                        <LocationSearchingIcon />
                      )}
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {units.map((unit) => {
                      return (
                        <CardContent key={unit.id}>
                          <Typography sx={{ fontWeight: "bold" }} paragraph>
                            {unit.name}:
                          </Typography>
                          <Typography paragraph>
                            Total Home pass: {unit.total_home_pass} <br />
                            tags: {unit.tags}
                          </Typography>
                        </CardContent>
                      );
                    })}
                  </Collapse>
                </Card>
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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default WorkOrderPage;
