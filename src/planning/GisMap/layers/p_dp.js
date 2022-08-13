import React from "react";

import { RedMarker2 } from "components/common/Map/GoogleMapWrapper";

const LAYER_KEY = "p_dp";

export const ViewLayer = () => {
  // get data of p_dp layer
  // if show is true render markers on map

  return (
    <>
      {data.map((dp) => {
        const { id, coordinates } = dp;
        return <RedMarker2 key={dp.id} position={coordinates} />;
      })}
    </>
  );
};

// export EditLayer

// export detailsPopup = {
//   "name" : "String"
// }

// export addForm

// export editForm = {
//   "name" : "String"
//   "multi sel": {
//     options :
//   }
// }
