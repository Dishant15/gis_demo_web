import React from "react";
import { useSelector } from "react-redux";

import { RedMarker2 } from "components/common/Map/GoogleMapWrapper";

import { getLayerViewData } from "planning/data/planningGis.selectors";

const LAYER_KEY = "p_dp";

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return (
    <>
      {data.map((dp) => {
        const { id, coordinates } = dp;
        return <RedMarker2 key={id} position={coordinates} />;
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
