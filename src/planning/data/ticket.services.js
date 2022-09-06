import Api from "utils/api.utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiGetTicketWorkorderElements } from "utils/url.constants";

export const fetchTicketWorkorderData = async (ticketId) => {
  const res = await Api.get(apiGetTicketWorkorderElements(ticketId));
  return res.data;
};

export const fetchTicketWorkorderDataThunk = createAsyncThunk(
  "planningGis/fetchTicketWorkorderData",
  fetchTicketWorkorderData
);
