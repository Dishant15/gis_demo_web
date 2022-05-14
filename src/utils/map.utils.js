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
