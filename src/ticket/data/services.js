import Api from "utils/api.utils";
import {
  apiPostTicketAdd,
  apiGetTicketList,
  apiGetTicketDetails,
  apiPostTicketEdit,
  apiPostTicketEditArea,
  apiGetTicketWorkorders,
  apiPutWorkOrderEdit,
} from "utils/url.constants";

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
  const res = await Api.get(apiGetTicketWorkorders(ticketId));
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

export const changeWorkOrderStatus = async ({ workOrderId, status }) => {
  const res = await Api.put(apiPutWorkOrderEdit(workOrderId), { status });
  return res.data;
};
