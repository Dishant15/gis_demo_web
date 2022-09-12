import React from "react";
import { size } from "lodash";

import { Popover } from "@mui/material";

import ChangeForm from "ticket/components/StatusChangeForm";
import { getTicketElementId } from "./TicketWorkOrderList";

/**
 * render status change from into popover
 *
 * Parent:
 *    TicketWorkOrderList
 */
const StatusChangeForm = ({
  statusData,
  isLoading,
  handleStatusCancel,
  handleStatusEditSubmit,
}) => {
  const showForm = !!size(statusData);

  if (showForm) {
    return (
      <Popover
        open={true}
        anchorEl={getTicketElementId(statusData.id)}
        onClose={handleStatusCancel}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <ChangeForm
          data={statusData}
          editSurveyLoading={isLoading}
          onEditComplete={handleStatusEditSubmit}
          handleSurveyStatusCancel={handleStatusCancel}
        />
      </Popover>
    );
  } else {
    return null;
  }
};

export default StatusChangeForm;
