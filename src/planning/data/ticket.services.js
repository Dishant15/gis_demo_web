import Api from "utils/api.utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  apiGetSurveyExportPdf,
  apiGetSurveyWoDetails,
  apiGetSurveyWoImages,
  apiGetTicketWorkorderElements,
  apiPutTicketWorkorderEdit,
} from "utils/url.constants";

export const fetchTicketWorkorderData = async (ticketId) => {
  const res = await Api.get(apiGetTicketWorkorderElements(ticketId));
  return res.data;
};

export const fetchTicketWorkorderDataThunk = createAsyncThunk(
  "planningGis/fetchTicketWorkorderData",
  fetchTicketWorkorderData
);

// data: { status, remark }
export const updateTicketWorkOrder = async ({ workOrderId, data }) => {
  const res = await Api.put(apiPutTicketWorkorderEdit(workOrderId), data);
  return res.data;
};

export const fetchSurveyWoDetails = async ({ queryKey }) => {
  const res = await Api.get(apiGetSurveyWoDetails(queryKey[1], queryKey[2]));
  return res.data;
};

export const fetchSurveyWoImages = async ({ queryKey }) => {
  const res = await Api.get(apiGetSurveyWoImages(queryKey[1], queryKey[2]));
  return res.data;
};

export const fetchExportSurveyForm = async (data) => {
  const res = await Api.post(apiGetSurveyExportPdf(), data, null, {
    responseType: "blob",
  });
  return res.data;
};
