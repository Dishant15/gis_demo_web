import React, { useCallback, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import get from "lodash/get";

import Box from "@mui/material/Box";
import DynamicForm from "components/common/DynamicForm";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";

import {
  addNewElement,
  editElementDetails,
} from "planning/data/layer.services";
import { setMapState } from "planning/data/planningGis.reducer";
import { addNotification } from "redux/reducers/notification.reducer";
import {
  fetchLayerDataThunk,
  fetchLayerListDetails,
} from "planning/data/actionBar.services";
import { handleLayerSelect } from "planning/data/planningState.reducer";
import { getPlanningMapState } from "planning/data/planningGis.selectors";
import {
  getSelectedRegionIds,
  getSingleLayerConfigurationList,
} from "planning/data/planningState.selectors";
import { LayerKeyMappings, PLANNING_EVENT } from "../utils";
import {
  onFetchLayerListDetailsSuccess,
  openElementDetails,
} from "planning/data/planning.actions";

export const GisLayerForm = ({ layerKey }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const configList = useSelector(getSingleLayerConfigurationList(layerKey));
  const { event, data: mapStateData } = useSelector(getPlanningMapState);

  const isEdit = event === PLANNING_EVENT.editElementForm;
  const formConfig = get(LayerKeyMappings, [layerKey, "formConfig"]);
  const transformAndValidateData = get(LayerKeyMappings, [
    layerKey,
    "transformAndValidateData",
  ]);
  const isConfigurable = !!get(mapStateData, "configuration");

  const queryRes = useQuery(
    "planningLayerConfigsDetails",
    fetchLayerListDetails,
    {
      staleTime: Infinity,
      enabled: isConfigurable,
      onSuccess: (layerConfData) => {
        dispatch(onFetchLayerListDetailsSuccess(layerConfData));
      },
    }
  );

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
    let validatedData = prepareServerData(data, isEdit, formConfig);
    // convert data to server friendly form
    validatedData = transformAndValidateData
      ? transformAndValidateData(validatedData, setError, isEdit)
      : validatedData;

    if (isEdit) {
      editElement(validatedData);
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
    // update add edit related fields
    if (isEdit) {
      serverData["id"] = data?.id;
      delete serverData["geometry"];
    } else {
      delete serverData["coordinates"];
      // add geometry data bcoz, formConfig dont have that field
      serverData["geometry"] = data?.geometry;
    }

    // add configuration id if have
    if (data?.configuration) {
      serverData["configuration"] = data?.configuration;
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
          configurationOptions={configList}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isEdit ? isEditLoading : isAddLoading}
        />
      </Box>
    </GisMapPopups>
  );
};
