import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Fuse from "fuse.js";

import { getPlanningMapState } from "planning/data/planningGis.selectors";
import {
  onLayerElementListItemClick,
  openElementDetails,
} from "planning/data/planning.actions";

export const useLayerElementList = () => {
  const dispatch = useDispatch();

  const { data: eventData } = useSelector(getPlanningMapState);
  const { elementList, elementLayerKey } = eventData;

  const [searchedKey, setSearchedKey] = useState("");
  const elementListSearch = new Fuse(elementList, {
    keys: ["name"],
    ignoreFieldNorm: true,
    fieldNormWeight: 0,
  });

  // const elementListSearch = [];

  const handleShowOnMap = useCallback(
    (element, layerKey) => () => {
      dispatch(onLayerElementListItemClick(element, layerKey));
    },
    []
  );

  const handleShowDetails = useCallback(
    (elementId, layerKey) => () => {
      dispatch(
        openElementDetails({
          layerKey,
          elementId,
        })
      );
    },
    []
  );

  const handleElementListFilter = useCallback((searchText) => {
    setSearchedKey(searchText);
  }, []);

  return {
    elementLayerKey,
    elementList: searchedKey
      ? elementListSearch.search(searchedKey)
      : elementList,
    handleShowOnMap,
    handleShowDetails,
    handleElementListFilter,
    searchedKey,
  };
};
