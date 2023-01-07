import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import get from "lodash/get";
import merge from "lodash/merge";

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
import { addNotification } from "redux/reducers/notification.reducer";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";

export const useElementListHook = () => {
  const dispatch = useDispatch();
  const { validateElementMutation, isValidationLoading } =
    useValidateGeometry();

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const { data: eventData } = useSelector(getPlanningMapState);
  const {
    elementList,
    elementData: parentData,
    extraParent,
    isAssociationList,
  } = eventData;

  const [elementToAssociate, setElementToAssociate] = useState(null);

  const { mutate: editElement, isLoading: isEditLoading } = useMutation(
    editElementDetails,
    {
      onSuccess: (res) => {
        dispatch(
          addNotification({
            type: "success",
            title: "Element association updated Successfully",
          })
        );

        // refetch layer
        dispatch(
          fetchLayerDataThunk({
            regionIdList: selectedRegionIds,
            layerKey: elementToAssociate.layerKey,
          })
        );
        // go to new associated element details
        dispatch(
          openElementDetails({
            layerKey: elementToAssociate.layerKey,
            elementId: elementToAssociate.id,
          })
        );
      },
      onError: (err) => {
        const errStatus = get(err, "response.status");
        let notiText;
        if (errStatus === 400) {
          // handle bad data
          let errData = get(err, "response.data");
          for (const fieldKey in errData) {
            if (Object.hasOwnProperty.call(errData, fieldKey)) {
              const errList = errData[fieldKey];
              notiText = get(errList, "0", "");
              break;
            }
          }
        } else {
          notiText =
            "Something went wrong at our side. Please try again after refreshing the page.";
        }
        dispatch(
          addNotification({
            type: "error",
            title: "Operation Failed",
            text: notiText,
          })
        );
      },
      onSettled: () => {
        handleHidePopup();
      },
    }
  );

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
          submitData.association = {
            parents: merge(parents, extraParent),
            children,
          };
          submitData.network_id = network_id;
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
    selectedElement: elementToAssociate,
    isValidationLoading,
    isEditLoading,
    handleShowOnMap,
    handleShowDetails,
    handleAddExistingAssociation,
    handleShowPopup,
    handleHidePopup,
  };
};
