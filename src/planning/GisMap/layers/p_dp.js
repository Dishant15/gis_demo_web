import React from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import { getLayerViewData } from "planning/data/planningGis.selectors";

import PDPViewIcon from "assets/markers/p_dp_view.svg";

const LAYER_KEY = "p_dp";

const PDPMarker = (props) => <Marker {...props} icon={{ url: PDPViewIcon }} />;

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
        return <PDPMarker key={id} position={coordinates} />;
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
