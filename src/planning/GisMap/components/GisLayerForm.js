import React, { useCallback, useRef } from "react";
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
import { setMapState } from "planning/data/planningGis.reducer";
import { addNotification } from "redux/reducers/notification.reducer";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import { handleLayerSelect } from "planning/data/planningState.reducer";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import {
  getLayerSelectedConfiguration,
  getSelectedRegionIds,
} from "planning/data/planningState.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import { openElementDetails } from "planning/data/planning.actions";

export const GisLayerForm = ({ layerKey }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const configuration = useSelector(getLayerSelectedConfiguration(layerKey));
  const { event, data: mapStateData } = useSelector(getPlanningMapState);
  const isEdit = event === PLANNING_EVENT.editElementForm;
  const formConfig = get(LayerKeyMappings, [layerKey, "formConfig"]);
  const transformAndValidateData = get(LayerKeyMappings, [
    layerKey,
    "transformAndValidateData",
  ]);

  const onSuccessHandler = ({ id }) => {
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

    dispatch(openElementDetails({ layerKey, elementId: id }));
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
      editElementDetails({
        data: mutationData,
        layerKey,
        elementId: mapStateData?.id,
      }),
    {
      onSuccess: onSuccessHandler,
      onError: onErrorHandler,
    }
  );

  const onSubmit = (data, setError, clearErrors) => {
    clearErrors();
    // if form is edit get configuration if from data otherwise get from redux;
    const configId = isEdit
      ? get(mapStateData, "configuration")
      : get(configuration, "id");
    let validatedData = prepareServerData(data, isEdit, formConfig);
    // convert data to server friendly form
    validatedData = transformAndValidateData
      ? transformAndValidateData(data, setError, isEdit, configId)
      : data;

    if (isEdit) {
      editElement({ ...validatedData, geometry: undefined });
    } else {
      addElement(validatedData);
    }
  };

  const prepareServerData = useCallback((data, isEdit, formConfig) => {
    let serverData = {};
    for (let index = 0; index < formConfig.sections.length; index++) {
      const { fieldConfigs } = formConfig.sections[index];
      for (let fInd = 0; fInd < fieldConfigs.length; fInd++) {
        const { field_key } = fieldConfigs[fInd];
        serverData[field_key] = data[field_key];
      }
    }
    if (isEdit) {
      serverData["id"] = data?.id;
    }
    return serverData;
  }, []);

  const onClose = () => {
    dispatch(setMapState({}));
  };

  if (!formConfig) throw new Error("form config is required");

  return (
    <GisMapPopups>
      <Box minWidth="350px" maxWidth="550px" overflow="auto" maxHeight="85vh">
        <DynamicForm
          ref={formRef}
          formConfigs={formConfig}
          data={mapStateData}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isEdit ? isEditLoading : isAddLoading}
        />
      </Box>
    </GisMapPopups>
  );
};
