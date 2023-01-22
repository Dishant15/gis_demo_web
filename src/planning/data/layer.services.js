import pick from "lodash/pick";

import Api from "utils/api.utils";
import {
  apiGetElementAssociations,
  apiGetElementConnections,
  apiGetElementDetails,
  apiGetRegionDetails,
  apiGetTicketDetails,
  apiPostAddElement,
  apiPostLayerDownload,
  apiPostLayerUpload,
  apiPostRegionAdd,
  apiPostValidateElementGeometry,
  apiPutEditElement,
  apiDeteleElement,
  apiPutRegionEdit,
  apiUpdateElementConnections,
  apiGetElementPortDetails,
  apiPostElementSplicingDetails,
} from "utils/url.constants";

export const fetchElementDetails = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  if (layerKey === "ticket") {
    const res = await Api.get(apiGetTicketDetails(elementId));
    return res.data;
  } else if (layerKey === "region") {
    const res = await Api.get(apiGetRegionDetails(elementId, "detail"));
    return res.data;
  } else {
    const res = await Api.get(apiGetElementDetails(layerKey, elementId));
    return res.data;
  }
};

// data : { layerKey, element_id*, featureType, geometry, region_id_list / ticket_id }
export const validateElementGeometry = async (data) => {
  const res = await Api.post(apiPostValidateElementGeometry(), data);
  return res.data;
};

export const fetchElementConnections = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementConnections(layerKey, elementId));
  return res.data;
};

export const addNewElement = async ({ data, layerKey }) => {
  if (layerKey === "region") {
    let submitData = pick(data, ["name", "unique_id", "layer", "parentId"]);
    submitData.coordinates = data.geometry;
    const res = await Api.post(apiPostRegionAdd(), submitData);
    return res.data;
  } else {
    const res = await Api.post(apiPostAddElement(layerKey), data);
    return res.data;
  }
};

export const editElementDetails = async ({ data, layerKey, elementId }) => {
  if (layerKey === "region") {
    let submitData = pick(data, ["name", "unique_id", "layer", "parentId"]);
    if (data?.geometry && Array.isArray(data.geometry)) {
      submitData.coordinates = data.geometry;
    }
    const res = await Api.put(apiPutRegionEdit(elementId), submitData);
    return res.data;
  } else {
    const res = await Api.put(apiPutEditElement(layerKey, elementId), data);
    return res.data;
  }
};

export const addElementConnection = async ({ data, cableId }) => {
  const res = await Api.put(apiUpdateElementConnections(cableId), data);
  return res.data;
};

export const fetchElementAssociations = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementAssociations(layerKey, elementId));
  return res.data;
};

export const fetchElementPortDetails = async ({ queryKey }) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementPortDetails(layerKey, elementId));
  return res.data;
};

export const fetchElementPortSplicingDetails = async (data) => {
  const res = await Api.post(apiPostElementSplicingDetails(), data);
  return res.data;
};

export const fetchDownloadLayerData = async ({ data, layerKey }) => {
  const res = await Api.post(apiPostLayerDownload(layerKey), data, null, {
    responseType: "blob",
  });
  return res.data;
};

export const uploadLayerData = async ({ data, layerKey }) => {
  const res = await Api.post(apiPostLayerUpload(layerKey), data);
  return res.data;
};

export const deleteLayer = async ({ layerKey, elementId }) => {
  const res = await Api.delete(apiDeteleElement(layerKey, elementId));
  return res.data;
};
