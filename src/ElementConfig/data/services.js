import Api from "utils/api.utils";
import {
  apiGetElementList,
  apiPostElementAdd,
  apiPutElementEdit,
} from "utils/url.constants";

export const fetchElementList = async ({ queryKey }) => {
  const res = await Api.get(apiGetElementList(queryKey[1]));
  return res.data;
};

export const upsertElementConfig = async (data, layerKey) => {
  const configId = data?.id;

  if (configId) {
    delete data.id;
    const res = await Api.put(apiPutElementEdit(layerKey, configId), data);
    return res.data;
  } else {
    const postData = { ...data, splitter_type: data.splitter_type.value };
    const res = await Api.post(apiPostElementAdd(layerKey), postData);
    return res.data;
  }
};
