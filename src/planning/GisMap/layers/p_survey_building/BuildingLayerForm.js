import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";

import get from "lodash/get";
import noop from "lodash/noop";
import Box from "@mui/material/Box";

import GisMapPopups from "planning/GisMap/components/GisMapPopups";

import {
  addNewElement,
  editElementDetails,
} from "planning/data/layer.services";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import { setMapState } from "planning/data/planningGis.reducer";
import { addNotification } from "redux/reducers/notification.reducer";
import { getPlanningMapStateData } from "planning/data/planningGis.selectors";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import UnitEditForm from "ticket/components/UnitEditForm";
import { SURVEY_TAG_LIST } from "utils/constant";
import { handleLayerSelect } from "planning/data/planningState.reducer";

export const BuildingLayerForm = ({ layerKey, isEdit }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const data = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const onSuccessHandler = () => {
    dispatch(
      addNotification({
        type: "success",
        title: "Element operation completed Successfully",
      })
    );
    // close form
    dispatch(setMapState({}));
    dispatch(handleLayerSelect(layerKey));
    // refetch layer
    dispatch(
      fetchLayerDataThunk({
        regionIdList: selectedRegionIds,
        layerKey,
      })
    );
  };

  const onErrorHandler = (err) => {
    const errStatus = get(err, "response.status");
    let notiText;
    if (errStatus === 400) {
      let errData = get(err, "response.data");
      for (const fieldKey in errData) {
        if (Object.hasOwnProperty.call(errData, fieldKey)) {
          const errList = errData[fieldKey];
          formRef.current.onError(fieldKey, get(errList, "0", ""));
        }
      }
      notiText = "Please correct input errors and submit again";
    } else {
      // maybe Internal server or network error
      // --- can not set error as not possible to clear this ---
      // formRef.current.onError(
      //   "__all__",
      //   "Something went wrong. Can not perform operation"
      // );
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
  };

  const { mutate: addElement, isLoading: isAddLoading } = useMutation(
    (mutationData) => addNewElement({ data: mutationData, layerKey }),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    }
  );

  const { mutate: editElement, isLoading: isEditLoading } = useMutation(
    (mutationData) =>
      editElementDetails({ data: mutationData, layerKey, elementId: data.id }),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    }
  );

  const onSubmit = (submitData, setError, clearErrors) => {
    if (isEdit) {
      editElement({ ...submitData, geometry: undefined, address: "" });
    } else {
      addElement({ ...submitData, geometry: data.geometry, address: "" });
    }
  };

  const onClose = () => {
    dispatch(setMapState({}));
  };

  const onEditComplete = (data, isDirty) => {
    onSubmit(data, noop, noop);
  };

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        <UnitEditForm
          ref={formRef}
          formData={data}
          editUnitLoading={isEdit ? isEditLoading : isAddLoading}
          onEditComplete={onEditComplete}
          handleUnitDetailsCancel={onClose}
          surveyTagList={SURVEY_TAG_LIST}
          showUniqueId={true}
          isEdit={isEdit}
        />
      </Box>
    </GisMapPopups>
  );
};
