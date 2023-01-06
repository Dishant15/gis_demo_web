import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import isNull from "lodash/isNull";
import get from "lodash/get";

import useValidateGeometry from "planning/GisMap/hooks/useValidateGeometry";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import {
  onElementListItemClick,
  openElementDetails,
} from "planning/data/planning.actions";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { LayerKeyMappings } from "planning/GisMap/utils";
import { generateNetworkIdFromParent } from "planning/data/planning.utils";
import { editElementDetails } from "planning/data/layer.services";

export const useElementListHook = () => {
  const dispatch = useDispatch();
  const { validateElementMutation, isValidationLoading } =
    useValidateGeometry();

  const { mutate: editElement, isLoading: isEditLoading } = useMutation(
    editElementDetails,
    {
      onSuccess: (res) => {
        console.log("🚀 ~ file: useElementList.js:32 ~ res", res);
      },
      onError: (err) => {
        console.log("🚀 ~ file: useElementList.js:33 ~ err", err);
      },
    }
  );

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const { data: eventData } = useSelector(getPlanningMapState);
  const { elementList, elementData: parentData, isAssociationList } = eventData;

  const [elementToAssociate, setElementToAssociate] = useState(null);

  const handleShowOnMap = useCallback(
    (element) => () => {
      dispatch(onElementListItemClick(element));
    },
    []
  );

  const handleShowDetails = useCallback(
    (element) => () => {
      dispatch(
        openElementDetails({
          layerKey: element.layerKey,
          elementId: element.id,
        })
      );
    },
    []
  );

  const handleAddExistingAssociation = useCallback(() => {
    handleHidePopup();
    console.log("elementToAssociate ", elementToAssociate);
    console.log("parentData ", parentData);

    const layerKey = elementToAssociate.layerKey;
    // layer key based data default data from utils -> LayerKeyMappings
    const featureType = get(LayerKeyMappings, [layerKey, "featureType"]);

    // call validation api with parent geomentry
    validateElementMutation(
      {
        layerKey,
        element_id: elementToAssociate.id,
        featureType,
        geometry: parentData.coordinates,
        region_id_list: selectedRegionIds,
      },
      {
        onSuccess: (res) => {
          console.log("🚀 ~ file: handleAddExistingAssociation ~ res", res);
          // update submit data based on validation res
          let submitData = { geometry: parentData.coordinates };
          const children = get(res, "data.children", {});
          const parents = get(res, "data.parents", {});
          const region_list = get(res, "data.region_list");

          const network_id = generateNetworkIdFromParent(
            elementToAssociate.unique_id,
            parents,
            region_list
          );

          const getDependantFields = get(
            LayerKeyMappings,
            [layerKey, "getDependantFields"],
            ({ submitData }) => submitData
          );
          submitData = getDependantFields({
            submitData,
            children,
            parents,
            region_list,
          });
          submitData.association = get(res, "data", {});
          submitData.network_id = network_id;
          console.log(
            "🚀 ~ file: useElementList.js:93 ~ submitData",
            submitData
          );
          editElement({
            data: submitData,
            layerKey,
            elementId: elementToAssociate.id,
          });
        },
      }
    );
    // call edit api for element with all the parent child and other data
  }, [elementToAssociate, parentData, selectedRegionIds]);

  const handleShowPopup = useCallback(
    (elementToAssociate) => () => {
      setElementToAssociate(elementToAssociate);
    },
    []
  );

  const handleHidePopup = useCallback(() => setElementToAssociate(null), []);

  return {
    elementList,
    parentData,
    isAssociationList,
    showPopup: !isNull(elementToAssociate),
    isValidationLoading,
    handleShowOnMap,
    handleShowDetails,
    handleAddExistingAssociation,
    handleShowPopup,
    handleHidePopup,
  };
};
