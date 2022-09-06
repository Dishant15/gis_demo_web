import React from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";
import SecondarySpliterIcon from "assets/markers/spliter_view.svg";

import { getLayerViewData } from "planning/data/planningGis.selectors";

export const LAYER_KEY = "p_splitter";

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
        const { id, coordinates, splitter_type } = dp;
        return (
          <Marker
            icon={{
              url:
                splitter_type === "P"
                  ? PrimarySpliterIcon
                  : SecondarySpliterIcon,
            }}
            key={id}
            position={coordinates}
          />
        );
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
