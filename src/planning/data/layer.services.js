import Api from "utils/api.utils";
import {
  apiGetElementConnections,
  apiGetElementDetails,
  apiPostAddElement,
  apiPutEditElement,
} from "utils/url.constants";

export const fetchElementDetails = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementDetails(layerKey, elementId));
  return res.data;
};

export const fetchElementConnections = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementConnections(layerKey, elementId));
  return res.data;
};

export const addNewElement = async ({ data, layerKey }) => {
  const res = await Api.post(apiPostAddElement(layerKey), data);
  return res.data;
};

export const editElementDetails = async ({ data, layerKey, elementId }) => {
  const res = await Api.put(apiPutEditElement(layerKey, elementId), data);
  return res.data;
};
