import React from "react";
import { useSelector } from "react-redux";
import { Marker } from "@react-google-maps/api";
import get from "lodash/get";

import DynamicForm from "components/common/DynamicForm";
import PDPViewIcon from "assets/markers/p_dp_view.svg";

import { getLayerViewData } from "planning/data/planningGis.selectors";
import { LAYER_KEY, FORM_CONFIGS } from "./configurations";

export const Geometry = ({ coordinates }) => (
  <Marker icon={{ url: PDPViewIcon }} position={coordinates} />
);

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));
  const data = layerData.viewData;
  const popup = layerData.popupType || null;

  return (
    <>
      {popup === "edit" ? (
        <DynamicForm
          formConfigs={FORM_CONFIGS}
          data={get(layerData, "editData", {})}
        />
      ) : null}
      {data.map((dp) => {
        const { id, coordinates } = dp;
        return (
          <Marker icon={{ url: PDPViewIcon }} key={id} position={coordinates} />
        );
      })}
    </>
  );
};

// export EditLayer
