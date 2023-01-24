import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "utils/api.utils";
import {
  apiGetElementPortDetails,
  apiPostAddPortConnection,
  apiPostElementSplicingDetails,
} from "utils/url.constants";

export const fetchElementPortDetails = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementPortDetails(layerKey, elementId));
  return res.data;
};

export const fetchElementPortSplicingDetails = async (data) => {
  const res = await Api.post(apiPostElementSplicingDetails(), data);
  return res.data;
};

export const postAddPortConnection = async (data) => {
  const res = await Api.post(apiPostAddPortConnection(), data);
  return res.data;
};

export const postAddPortConnectionThunk = createAsyncThunk(
  "splicing/postAddPortConnection",
  postAddPortConnection
);
