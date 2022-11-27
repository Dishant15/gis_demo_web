import orderBy from "lodash/orderBy";
import { coordsToLatLongMap } from "utils/map.utils";
import { FEATURE_TYPES } from "./layers/common/configuration";
import { customAlphabet } from "nanoid";

import * as RegionLayer from "./layers/region";
import * as TicketLayer from "./layers/ticket";
import * as DPLayer from "./layers/p_dp";
import * as SplitterLayer from "./layers/p_splitter";
import * as CableLayer from "./layers/p_cable";
import * as BuildingLayer from "./layers/p_survey_building";
import * as SAreaLayer from "./layers/p_survey_area";
import * as PopLayer from "./layers/p_pop";
import * as SPopLayer from "./layers/p_spop";
import * as FSALayer from "./layers/p_fsa";
import * as DSALayer from "./layers/p_dsa";
import * as CSALayer from "./layers/p_csa";
import * as PoleLayer from "./layers/p_pole";
import * as ManholeLayer from "./layers/p_manhole";
import * as JointCloserLayer from "./layers/p_jointcloser";
import * as OltLayer from "./layers/p_olt";

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElementGeometry: 1,
  editElementGeometry: 2,
  addElementForm: 3,
  editElementForm: 4,
  showElementDetails: 5,
  // special events
  showElementConnections: 6,
  addElementConnection: 7,
  showPossibleAddAssociatiation: 8,
  showAssociatedElements: 9,
  // map select elements on location
  selectElementsOnMapClick: 10,
  listElementsOnMap: 11,
};

export const LayerKeyMappings = {
  [RegionLayer.LAYER_KEY]: {
    preUid: TicketLayer.PRE_UID,
    featureType: RegionLayer.LAYER_FEATURE_TYPE,
    getViewOptions: RegionLayer.getViewOptions,
    elementTableFields: RegionLayer.ELEMENT_TABLE_FIELDS,
  },
  [TicketLayer.LAYER_KEY]: {
    [PLANNING_EVENT.addElementForm]: TicketLayer.ElementForm,
    [PLANNING_EVENT.editElementForm]: TicketLayer.ElementForm,
    preUid: TicketLayer.PRE_UID,
    featureType: TicketLayer.LAYER_FEATURE_TYPE,
    getViewOptions: TicketLayer.getViewOptions,
    initialElementData: TicketLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: TicketLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: TicketLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    getDependantFields: TicketLayer.getDependantFields,
  },
  [DPLayer.LAYER_KEY]: {
    preUid: DPLayer.PRE_UID,
    featureType: DPLayer.LAYER_FEATURE_TYPE,
    getViewOptions: DPLayer.getViewOptions,
    initialElementData: DPLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: DPLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: DPLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: DPLayer.ELEMENT_FORM_TEMPLATE,
  },
  [SplitterLayer.LAYER_KEY]: {
    preUid: SplitterLayer.PRE_UID,
    featureType: SplitterLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SplitterLayer.getViewOptions,
    initialElementData: SplitterLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SplitterLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: SplitterLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: SplitterLayer.ELEMENT_FORM_TEMPLATE,
    // config fields
    ConfigFormTemplate: SplitterLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: SplitterLayer.INITIAL_CONFIG_DATA,
    TableColDefs: SplitterLayer.CONFIG_LIST_TABLE_COL_DEFS,
  },
  [CableLayer.LAYER_KEY]: {
    preUid: CableLayer.PRE_UID,
    featureType: CableLayer.LAYER_FEATURE_TYPE,
    getViewOptions: CableLayer.getViewOptions,
    initialElementData: CableLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: CableLayer.ELEMENT_TABLE_FIELDS,
    formConfig: CableLayer.ELEMENT_FORM_TEMPLATE,
    // config fields
    ConfigFormTemplate: CableLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: CableLayer.INITIAL_CONFIG_DATA,
    TableColDefs: CableLayer.CONFIG_LIST_TABLE_COL_DEFS,
  },
  [BuildingLayer.LAYER_KEY]: {
    preUid: BuildingLayer.PRE_UID,
    [PLANNING_EVENT.addElementForm]: BuildingLayer.ElementForm,
    [PLANNING_EVENT.editElementForm]: BuildingLayer.ElementForm,
    featureType: BuildingLayer.LAYER_FEATURE_TYPE,
    getViewOptions: BuildingLayer.getViewOptions,
    initialElementData: BuildingLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: BuildingLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: BuildingLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
  [SAreaLayer.LAYER_KEY]: {
    preUid: SAreaLayer.PRE_UID,
    featureType: SAreaLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SAreaLayer.getViewOptions,
    initialElementData: SAreaLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SAreaLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: SAreaLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: SAreaLayer.ELEMENT_FORM_TEMPLATE,
    getDependantFields: SAreaLayer.getDependantFields,
  },
  [PopLayer.LAYER_KEY]: {
    preUid: PopLayer.PRE_UID,
    featureType: PopLayer.LAYER_FEATURE_TYPE,
    getViewOptions: PopLayer.getViewOptions,
    initialElementData: PopLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: PopLayer.ELEMENT_TABLE_FIELDS,
    formConfig: PopLayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: PopLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
  [SPopLayer.LAYER_KEY]: {
    preUid: SPopLayer.PRE_UID,
    featureType: SPopLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SPopLayer.getViewOptions,
    initialElementData: SPopLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SPopLayer.ELEMENT_TABLE_FIELDS,
    formConfig: SPopLayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: SPopLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
  [FSALayer.LAYER_KEY]: {
    preUid: FSALayer.PRE_UID,
    featureType: FSALayer.LAYER_FEATURE_TYPE,
    getViewOptions: FSALayer.getViewOptions,
    initialElementData: FSALayer.INITIAL_ELEMENT_DATA,
    elementTableFields: FSALayer.ELEMENT_TABLE_FIELDS,
    formConfig: FSALayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: FSALayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    getDependantFields: FSALayer.getDependantFields,
  },
  [DSALayer.LAYER_KEY]: {
    preUid: DSALayer.PRE_UID,
    featureType: DSALayer.LAYER_FEATURE_TYPE,
    getViewOptions: DSALayer.getViewOptions,
    initialElementData: DSALayer.INITIAL_ELEMENT_DATA,
    elementTableFields: DSALayer.ELEMENT_TABLE_FIELDS,
    formConfig: DSALayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: DSALayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    getDependantFields: DSALayer.getDependantFields,
  },
  [CSALayer.LAYER_KEY]: {
    preUid: CSALayer.PRE_UID,
    featureType: CSALayer.LAYER_FEATURE_TYPE,
    getViewOptions: CSALayer.getViewOptions,
    initialElementData: CSALayer.INITIAL_ELEMENT_DATA,
    elementTableFields: CSALayer.ELEMENT_TABLE_FIELDS,
    formConfig: CSALayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: CSALayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    getDependantFields: CSALayer.getDependantFields,
  },
  [PoleLayer.LAYER_KEY]: {
    preUid: PoleLayer.PRE_UID,
    featureType: PoleLayer.LAYER_FEATURE_TYPE,
    getViewOptions: PoleLayer.getViewOptions,
    initialElementData: PoleLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: PoleLayer.ELEMENT_TABLE_FIELDS,
    formConfig: PoleLayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: PoleLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
  [ManholeLayer.LAYER_KEY]: {
    preUid: ManholeLayer.PRE_UID,
    featureType: ManholeLayer.LAYER_FEATURE_TYPE,
    getViewOptions: ManholeLayer.getViewOptions,
    initialElementData: ManholeLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: ManholeLayer.ELEMENT_TABLE_FIELDS,
    formConfig: ManholeLayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: ManholeLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
  [JointCloserLayer.LAYER_KEY]: {
    preUid: JointCloserLayer.PRE_UID,
    featureType: JointCloserLayer.LAYER_FEATURE_TYPE,
    getViewOptions: JointCloserLayer.getViewOptions,
    initialElementData: JointCloserLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: JointCloserLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: JointCloserLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: JointCloserLayer.ELEMENT_FORM_TEMPLATE,
  },
  [OltLayer.LAYER_KEY]: {
    preUid: OltLayer.PRE_UID,
    featureType: OltLayer.LAYER_FEATURE_TYPE,
    getViewOptions: OltLayer.getViewOptions,
    initialElementData: OltLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: OltLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: OltLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: OltLayer.ELEMENT_FORM_TEMPLATE,
    // config fields
    ConfigFormTemplate: OltLayer.ELEMENT_CONFIG_TEMPLATE,
    ConfigInitData: OltLayer.INITIAL_CONFIG_DATA,
    TableColDefs: OltLayer.CONFIG_LIST_TABLE_COL_DEFS,
  },
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = orderBy(serverData, ["id"], ["desc"]);
  const featureType = LayerKeyMappings[layerKey]["featureType"];

  // PolyLine / Polygon
  if (
    featureType === FEATURE_TYPES.POLYGON ||
    featureType === FEATURE_TYPES.POLYLINE
  ) {
    resultData.map((d) => {
      d.geometry = [...d.coordinates];
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // Point gis layer
  else if (featureType === FEATURE_TYPES.POINT) {
    resultData.map((d) => {
      d.geometry = [...d.coordinates];
      d.coordinates = coordsToLatLongMap([d.coordinates])[0];
    });
    return resultData;
  }
  // Multi polygon
  else if (featureType === FEATURE_TYPES.MULTI_POLYGON) {
    resultData.map((d) => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
};

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const nanoid = customAlphabet(alphabet, 6);

export const generateElementUid = (layerKey) => {
  return `${LayerKeyMappings[layerKey]["preUid"]}.${nanoid()}`;
};
