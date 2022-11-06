import React from "react";
import { useSelector } from "react-redux";

import { Polygon } from "@react-google-maps/api";
import AddGisMapLayer from "planning/GisMap/components/AddGisMapLayer";
import ElementDetailsTable from "planning/GisMap/components/ElementDetailsTable";

import {
  getLayerViewData,
  getPlanningMapStateData,
} from "planning/data/planningGis.selectors";
import { INITIAL_ELEMENT_DATA, LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";

import EditGisLayer from "planning/GisMap/components/EditGisLayer";
import { zIndexMapping } from "../common/configuration";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";

const STROKE_COLOR = "#88B14B";

export const getOptions = ({ hidden = false }) => {
  return {
    strokeColor: STROKE_COLOR,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: STROKE_COLOR,
    fillOpacity: 0.3,
    clickable: false,
    draggable: false,
    editable: false,
    visible: !hidden,
    zIndex: zIndexMapping[LAYER_KEY],
  };
};

export const Geometry = ({ coordinates, hidden }) => {
  const options = getOptions({ hidden });

  return <Polygon path={coordinates} options={options} />;
};

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > LayerKeyMaping.layerKey.ViewLayer
   */
  const layerData = useSelector(getLayerViewData(LAYER_KEY));

  return (
    <>
      {layerData.map((element) => {
        const { id, hidden, coordinates } = element;

        return <Geometry key={id} hidden={hidden} coordinates={coordinates} />;
      })}
    </>
  );
};

export const AddMapLayer = () => {
  // get icon
  const options = getOptions({});

  return (
    <AddGisMapLayer
      options={options}
      featureType="polygon"
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
      nextEvent={{
        event: PLANNING_EVENT.showElementForm, // event for "layerForm"
        layerKey: LAYER_KEY,
        // init data
        data: INITIAL_ELEMENT_DATA,
      }}
    />
  );
};

export const EditMapLayer = () => {
  const options = getOptions({});

  return (
    <EditGisLayer
      options={options}
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
      featureType="polygon"
      layerKey={LAYER_KEY}
    />
  );
};

export const ElementForm = () => {
  return (
    <GisMapPopups>
      <h1>This is going to be custom form</h1>
    </GisMapPopups>
  );
};

const ELEMENT_TABLE_FIELDS = [
  { label: "Name", field: "name", type: "simple" },
  { label: "Unique Id", field: "unique_id", type: "simple" },
  { label: "Ticket Type", field: "ticket_type_display", type: "simple" },
  { label: "Network Type", field: "network_type_display", type: "simple" },
  { label: "Due Date", field: "due_date", type: "date" },
  { label: "Remarks", field: "remarks", type: "simple" },
  // { label: "Assignee", field: "assignee.name", type: "simple" }, // need to update serializer, fix assignee in ticket edit after updating details serializer
  { label: "Updated On", field: "updated_on", type: "date" },
  { label: "Created On", field: "created_on", type: "date" },
  { label: "Created By", field: "created_by.name", type: "simple" },
  { label: "Ticket Status", field: "status_display", type: "simple" },
];

const convertDataBeforeForm = (data) => {
  return data;
};

export const ElementDetails = () => {
  const { elementId } = useSelector(getPlanningMapStateData);

  return (
    <ElementDetailsTable
      rowDefs={ELEMENT_TABLE_FIELDS}
      layerKey={LAYER_KEY}
      elementId={elementId}
      onEditDataConverter={convertDataBeforeForm}
    />
  );
};
