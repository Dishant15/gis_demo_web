import Api from "utils/api.utils";
import { apiPostAddElement } from "utils/url.constants";

export const addNewElement = async ({ data, layerKey }) => {
  const res = await Api.post(apiPostAddElement(layerKey), data);
  return res.data;
};
