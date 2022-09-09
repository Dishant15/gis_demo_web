import React from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";

import PrimarySpliterIcon from "assets/markers/spliter_view_primary.svg";
import SecondarySpliterIcon from "assets/markers/spliter_view.svg";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { LAYER_KEY } from "./configurations";

export const getIcon = ({ splitter_type }) =>
  splitter_type === "P" ? PrimarySpliterIcon : SecondarySpliterIcon;

export const Geometry = ({ coordinates, splitterType }) => {
  return (
    <Marker
      icon={{
        url: getIcon({ splitter_type: splitterType }),
      }}
      position={coordinates}
    />
  );
};

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;

  return (
    <>
      {data.map((splitter) => {
        const { id, coordinates, splitter_type } = splitter;
        return (
          <Geometry
            key={id}
            splitterType={splitter_type}
            coordinates={coordinates}
          />
        );
      })}
    </>
  );
};
