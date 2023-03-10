import Api from "utils/api.utils";
import {
  apiPostTicketAdd,
  apiGetTicketList,
  apiGetTicketDetails,
  apiPostTicketEdit,
  apiPostTicketEditArea,
  apiGetTicketWorkorders,
  apiPutWorkOrderEdit,
  apiPutUnitEdit,
  apiExportTicket,
  apiImportTicket,
  apiGetTicketListSummery,
  apiGetTicketListSummeryExport,
  apiGetSurveyTicketWorkorders,
} from "utils/url.constants";

export const fetchTicketSummeryList = async () => {
  const res = await Api.get(apiGetTicketListSummery());
  return res.data;
};

export const fetchTicketList = async () => {
  const res = await Api.get(apiGetTicketList());
  return res.data;
};

export const fetchTicketDetails = async ({ queryKey }) => {
  const [_key, ticketId] = queryKey;
  const res = await Api.get(apiGetTicketDetails(ticketId));
  return res.data;
};

export const fetchTicketWorkorders = async ({ queryKey }) => {
  const [_key, ticketId] = queryKey;
  const res = await Api.get(apiGetSurveyTicketWorkorders(ticketId));
  return res.data;
};

export const addNewTicket = async (postData) => {
  const res = await Api.post(apiPostTicketAdd(), postData);
  return res.data;
};

export const editTicket = async ({ ticketId, data }) => {
  const res = await Api.put(apiPostTicketEdit(ticketId), data);
  return res.data;
};

export const editTicketArea = async ({ ticketId, data }) => {
  const res = await Api.put(apiPostTicketEditArea(ticketId), data);
  return res.data;
};

// data: { status, remark }
export const updateWorkOrder = async ({ workOrderId, data }) => {
  const res = await Api.put(apiPutWorkOrderEdit(workOrderId), data);
  return res.data;
};

export const updateUnitWorkOrder = async (data) => {
  const res = await Api.put(apiPutUnitEdit(data.id), data);
  return res.data;
};

// for zip file responseType arraybuffer is working here, if not pass, file format invalid
export const exportTicket = async (ticketId) => {
  const res = await Api.get(apiExportTicket(ticketId), null, {
    responseType: "arraybuffer",
  });
  return res.data;
};

export const importTicket = async ({ ticketId, data }) => {
  const res = await Api.post(apiImportTicket(ticketId), data, null, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetchExportTicketSummery = async () => {
  const res = await Api.get(apiGetTicketListSummeryExport(), null, {
    responseType: "blob",
  });
  return res.data;
};
