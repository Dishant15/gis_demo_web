export const CLIENT_ID = "react";

export const TicketTypeList = [
  { label: "Survey", value: "S" },
  { label: "Planning", value: "P" },
  { label: "Client", value: "C" },
];
export const NetworkTypeList = [
  { label: "As Build", value: "B" },
  { label: "As Planned", value: "P" },
];

export const TicketStatusList = [
  { label: "Active", value: "A" },
  { label: "Completed", value: "C" },
  { label: "In Active", value: "I" },
];

export const workOrderStatusTypes = {
  S: {
    value: "S",
    label: "Submited",
    color: "success",
  },
  V: {
    value: "V",
    label: "Verified",
    color: "warning",
  },
  R: {
    value: "R",
    label: "Rejected",
    color: "error",
  },
};
