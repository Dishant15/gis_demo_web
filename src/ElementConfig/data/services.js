import Api from "utils/api.utils";
import {
  apiDeleteLayerConfig,
  apiGetLayerConfigList,
  apiPostLayerConfigAdd,
  apiPutLayerConfigEdit,
} from "utils/url.constants";

export const fetchElementList = async ({ queryKey }) => {
  const res = await Api.get(apiGetLayerConfigList(queryKey[1]));
  return res.data;
};

export const upsertElementConfig = async (data, layerKey) => {
  const configId = data?.id;

  if (configId) {
    delete data.id;
    const res = await Api.put(apiPutLayerConfigEdit(layerKey, configId), data);
    return res.data;
  } else {
    const res = await Api.post(apiPostLayerConfigAdd(layerKey), data);
    return res.data;
  }
};

export const deleteElementConfig = async (configId, layerKey) => {
  const res = await Api.delete(apiDeleteLayerConfig(layerKey, configId));
  return res.data;
};
