import React from "react";
import { format } from "date-fns";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { red } from "@mui/material/colors";

import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import ExpandMore from "components/common/ExpandMore";

const WorkOrderItem = ({
  surveyWorkorder,
  expanded,
  handleExpandClick,
  selectedSurveyId,
  handleSurveySelect,
}) => {
  /**
   * Parent:
   *    WorkOrderPage
   */
  const { id, name, status, address, tags, updated_on, units } =
    surveyWorkorder;
  const formatedUpdatedOn = format(new Date(updated_on), "do MMM, hh:mm aaa");
  const isExpanded = expanded.has(id);

  return (
    <Card elevation={0} sx={{ maxWidth: 345, backgroundColor: "#efefef" }}>
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
          expand={isExpanded}
          onClick={handleExpandClick(id)}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
};

export default WorkOrderItem;
