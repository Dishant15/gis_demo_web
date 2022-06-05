import { get } from "lodash";

// Ahmedabad city center
export const DEFAULT_MAP_CENTER = { lat: 23.033863, lng: 72.585022 };
export const DEFAULT_MAP_ZOOM = 12;

// coordinates :- [ [lng, lat], ...]
export const coordsToLatLongMap = (coordinates) => {
  const latLongMap = [];
  for (let cInd = 0; cInd < coordinates.length; cInd++) {
    const coord = coordinates[cInd];
    latLongMap.push({
      lat: Number(coord[1]),
      lng: Number(coord[0]),
    });
  }
  return latLongMap;
};

// latLongMap :- [ {lat, lng}, ...]
export const latLongMapToCoords = (latLongMap) => {
  const coordinates = [];
  for (let lInd = 0; lInd < latLongMap.length; lInd++) {
    const currLatLong = latLongMap[lInd];
    coordinates.push([currLatLong.lng, currLatLong.lat]);
  }
  // create a closed polygon
  if (
    coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
    coordinates[0][1] !== coordinates[coordinates.length - 1][1]
  ) {
    coordinates.push(coordinates[0]);
  }
  return coordinates;
};

export const getCoordinatesFromFeature = (feature) => {
  let coords = feature.getPath().getArray();
  const resultLatLongs = [];
  for (let cInd = 0; cInd < coords.length; cInd++) {
    const currCoord = coords[cInd];
    resultLatLongs.push(currCoord.toJSON());
  }
  return resultLatLongs;
};

export const getFillColor = (layer_index) => {
  return get(uniq_colors, layer_index - 1, "#59666C");
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
