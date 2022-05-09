// coordinates :- [ [lat, lng], ...]
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

export const getCoordinatesFromFeature = (feature) => {
  let coords = feature.getPath().getArray();
  const resultLatLongs = [];
  for (let cInd = 0; cInd < coords.length; cInd++) {
    const currCoord = coords[cInd];
    resultLatLongs.push(currCoord.toJSON());
  }
  return resultLatLongs;
};
