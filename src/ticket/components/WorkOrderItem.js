import React from "react";
import { format } from "date-fns";
import size from "lodash/size";

import { Button, Divider } from "@mui/material";
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
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";

import ExpandMore from "components/common/ExpandMore";

import AcceptImg from "assets/accept.png";
import CancelImg from "assets/cancel.png";
import InprogressImg from "assets/inprogress.png";

const WorkOrderItem = ({
  surveyWorkorder,
  selectedSurveyId,
  handleSurveySelect,
  handleSurveyStatusEdit,
  canTicketWorkorderEdit,
}) => {
  /**
   * Parent:
   *    WorkOrderPage
   */
  const {
    id,
    name,
    status,
    address,
    updated_on,
    lat,
    long: lng,
  } = surveyWorkorder;

  const formatedUpdatedOn = format(new Date(updated_on), "do MMM, hh:mm aaa");

  const isVerified = status === "V";
  const showActions = canTicketWorkorderEdit && !isVerified;
  const isActive = id === selectedSurveyId;

  return (
    <Card
      elevation={isActive ? 5 : 0}
      sx={{ maxWidth: 345, backgroundColor: "#efefef" }}
      data-id={id}
    >
      <CardHeader
        avatar={<StatusAvatar status={status} />}
        action={
          showActions ? (
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
          ) : null
        }
        title={name}
        subheader={formatedUpdatedOn}
      />
      <CardContent>
        <Typography mb={1} variant="body2" color="text.secondary">
          {address}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Home Pass : <b>{totalHomePass}</b>
        </Typography> */}
        {/* <Typography variant="body2" color="text.secondary">
          {tags}
        </Typography> */}
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="View on map" placement="top">
          <IconButton
            aria-label="add to favorites"
            onClick={handleSurveySelect(id, { lat, lng })}
          >
            {isActive ? <MyLocationIcon /> : <LocationSearchingIcon />}
          </IconButton>
        </Tooltip>
        {/* {showActions ? (
          <>
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
                <HighlightAltIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : null} */}
      </CardActions>
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
