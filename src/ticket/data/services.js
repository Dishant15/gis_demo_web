import Api, { formatSubmitDate } from "utils/api.utils";
import { apiPostTicketAdd, apiGetTicketList } from "utils/url.constants";

export const fetchTicketList = async () => {
  const res = await Api.get(apiGetTicketList());
  return res.data;
};

export const addNewTicket = async (data) => {
  const postData = {
    ...data,
    assigneeId: data.assigneeId.value,
    network_type: data.network_type.value,
    regionId: data.regionId.value,
    ticket_type: data.ticket_type.value,
    due_date: formatSubmitDate(data.due_date),
    status: "A",
  };

  const res = await Api.post(apiPostTicketAdd(), postData);
  return res.data;
};
