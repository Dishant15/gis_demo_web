import Api from "utils/api.utils";
import {
  apiPostTicketAdd,
  apiGetTicketList,
  apiGetTicketDetails,
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

export const addNewTicket = async (postData) => {
  const res = await Api.post(apiPostTicketAdd(), postData);
  return res.data;
};
