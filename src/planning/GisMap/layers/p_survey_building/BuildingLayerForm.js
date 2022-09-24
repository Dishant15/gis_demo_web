import React, { useRef } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";

import Box from "@mui/material/Box";
import DynamicForm from "components/common/DynamicForm";
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

export const BuildingLayerForm = ({
  formConfig,
  layerKey,
  transformAndValidateData,
  isConfigurable,
  isEdit,
}) => {
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
      formRef.current.onError(
        "__all__",
        "Something went wrong. Can not perform operation"
      );
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

  const onSubmit = (data, setError, clearErrors) => {
    clearErrors();
    // convert data to server friendly form
    const validatedData = transformAndValidateData(data, setError);
    if (isEdit) {
      editElement(validatedData);
    } else {
      addElement(validatedData);
    }
  };

  const onClose = () => {
    dispatch(setMapState({}));
  };

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px">
        <DynamicForm
          ref={formRef}
          formConfigs={formConfig}
          data={data}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isEdit ? isEditLoading : isAddLoading}
        />
      </Box>
    </GisMapPopups>
  );
};
