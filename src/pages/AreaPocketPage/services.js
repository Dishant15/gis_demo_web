import { apiGetAreaPocketList } from "../../utils/url.constants";
import Api from "../../utils/api.utils";
import { get } from "lodash";

export const getFillColor = (layer_index) => {
  return get(uniq_colors, layer_index - 1, "#59666C");
};

export const fetchAreaPockets = async () => {
  const res = await Api.get(apiGetAreaPocketList());
  return res.data;
};

export const uniq_colors = [
  "#59666C",
  "#51ADAC",
  "#CE855A",
  "#88B14B",
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
  "#1b9e77",
  "#d95f02",
  "#7570b3",
  "#e7298a",
  "#66a61e",
  "#e6ab02",
  "#a6761d",
  "#666",
  "#7fc97f",
  "#beaed4",
  "#fdc086",
  "#ffff99",
  "#386cb0",
  "#f0027f",
];
