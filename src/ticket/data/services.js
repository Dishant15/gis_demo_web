import Api from "utils/api.utils";
import { apiGetTicketList } from "utils/url.constants";

export const fetchTicketList = async () => {
  const res = await Api.get(apiGetTicketList());
  return res.data;
};
