import React from "react";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import PolylineOutlinedIcon from "@mui/icons-material/PolylineOutlined";

import ExpandMore from "components/common/ExpandMore";

import AcceptImg from "assets/accept.png";
import CancelImg from "assets/cancel.png";
import InprogressImg from "assets/inprogress.png";

const WorkOrderItem = ({
  surveyWorkorder,
  expanded,
  handleExpandClick,
  selectedSurveyId,
  handleSurveySelect,
  handleSurveyMapEdit,
  handleUnitMapEdit,
  handleSurveyStatusEdit,
  handleSurveyDetailsEdit,
  handleUnitDetailsEdit,
}) => {
  /**
   * Parent:
   *    WorkOrderPage
   */
  const { id, name, status, address, tags, updated_on, units, center, remark } =
    surveyWorkorder;

  const formatedUpdatedOn = format(new Date(updated_on), "do MMM, hh:mm aaa");
  const totalHomePass = units.reduce(function (sum, u) {
    return sum + u.total_home_pass;
  }, 0);
  const isExpanded = expanded.has(id);

  return (
    <Card elevation={0} sx={{ maxWidth: 345, backgroundColor: "#efefef" }}>
      <CardHeader
        avatar={<StatusAvatar status={status} />}
        action={
          <Tooltip title="Change Status" placement="top">
            <IconButton
              aria-label="settings"
              onClick={(e) => {
                handleSurveyStatusEdit(e, surveyWorkorder);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        }
        title={name}
        subheader={formatedUpdatedOn}
      />
      <CardContent>
        <Typography mb={1} variant="body2" color="text.secondary">
          {address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Home Pass : <b>{totalHomePass}</b>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tags}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="View on map" placement="top">
          <IconButton
            aria-label="add to favorites"
            onClick={handleSurveySelect(id, center)}
          >
            {id === selectedSurveyId ? (
              <MyLocationIcon />
            ) : (
              <LocationSearchingIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Survey Details" placement="top">
          <IconButton
            aria-label="edit"
            onClick={handleSurveyDetailsEdit(surveyWorkorder)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Survey Coordinates" placement="top">
          <IconButton
            aria-label="edit-location"
            onClick={handleSurveyMapEdit(surveyWorkorder)}
          >
            <PolylineOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={isExpanded ? "Hide Units" : "Show Units"}
          placement="top"
        >
          <ExpandMore
            expand={isExpanded}
            onClick={handleExpandClick(id)}
            aria-expanded={isExpanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Tooltip>
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
              <CardActions disableSpacing>
                <Tooltip title="Edit unit details" placement="top">
                  <IconButton
                    aria-label="edit"
                    onClick={handleUnitDetailsEdit(unit, id, tags)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit unit map" placement="top">
                  <IconButton
                    aria-label="edit"
                    onClick={handleUnitMapEdit({
                      id: unit.id,
                      coordinates: unit.coordinates,
                    })}
                  >
                    <AddLocationAltOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </CardContent>
          );
        })}
      </Collapse>
    </Card>
  );
};

const StatusAvatar = ({ status }) => {
  if (status === "V") {
    return <Avatar alt={status} src={AcceptImg} />;
  } else if (status === "R") {
    return <Avatar alt={status} src={CancelImg} />;
  } else if (status === "S") {
    return <Avatar alt={status} src={InprogressImg} />;
  }
  return null;
};

export default WorkOrderItem;
