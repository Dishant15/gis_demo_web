import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Polygon } from "@react-google-maps/api";
import { polygon, booleanContains } from "@turf/turf";

import AddGisMapLayer from "planning/GisMap/components/AddGisMapLayer";
import ElementDetailsTable from "planning/GisMap/components/ElementDetailsTable";
import EditGisLayer from "planning/GisMap/components/EditGisLayer";
import TicketLayerForm from "./TicketLayerForm";

import {
  getLayerViewData,
  getPlanningMapStateData,
  getPlanningMapStateEvent,
} from "planning/data/planningGis.selectors";
import { INITIAL_ELEMENT_DATA, LAYER_KEY } from "./configurations";
import { PLANNING_EVENT } from "planning/GisMap/utils";

import { zIndexMapping } from "../common/configuration";
import { editTicketArea } from "ticket/data/services";
import { addNotification } from "redux/reducers/notification.reducer";

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

export const EditMapLayer = () => {
  const options = getOptions({});

  const dispatch = useDispatch();
  const mapStateData = useSelector(getPlanningMapStateData);

  const handleEditElementAction = useCallback(
    (mutationData) => {
      const coordinates = mutationData.geometry;
      // check if coordinates are valid
      const areaPoly = polygon([coordinates]);

      for (
        let regPolyInd = 0;
        regPolyInd < mapStateData.region.coordinates.length;
        regPolyInd++
      ) {
        const regionPoly = polygon([
          mapStateData.region.coordinates[regPolyInd],
        ]);

        if (booleanContains(regionPoly, areaPoly)) {
          editTicketArea({
            ticketId: mapStateData.id,
            data: { coordinates: mutationData.geometry },
          }).then(() => {
            // fire notification of area updated
            dispatch(
              addNotification({
                type: "success",
                title: "Ticket work area updated Successfully",
              })
            );
          });
          return;
        }
      }
      dispatch(
        addNotification({
          type: "error",
          title: "Input Error",
          text: "Ticket work area must be inside ticket region",
        })
      );
    },
    [mapStateData]
  );
  return (
    <EditGisLayer
      options={options}
      helpText="Click on map to place area points on map. Complete polygon and adjust points."
      featureType="polygon"
      layerKey={LAYER_KEY}
      editElementAction={handleEditElementAction}
    />
  );
};

export const ElementForm = () => {
  // get map state event
  const currEvent = useSelector(getPlanningMapStateEvent);
  // check if add or edit event
  const isEdit = currEvent === PLANNING_EVENT.editElementForm;

  return <TicketLayerForm isEdit={isEdit} layerKey={LAYER_KEY} />;
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
