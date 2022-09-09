import React, { useRef } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import DynamicForm from "components/common/DynamicForm";
import GisMapPopups from "planning/GisMap/components/GisMapPopups";

import { getPlanningMapStateData } from "planning/data/planningGis.selectors";

import { addNewElement } from "planning/data/layer.services";
import { setMapState } from "planning/data/planningGis.reducer";
import { getSelectedRegionIds } from "planning/data/planningState.selectors";
import { fetchLayerDataThunk } from "planning/data/actionBar.services";
import { get } from "lodash";

export const GisLayerForm = ({
  layerKey,
  formConfig,
  transformAndValidateData,
}) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const data = useSelector(getPlanningMapStateData);
  const selectedRegionIds = useSelector(getSelectedRegionIds);

  const { mutate: addElement, isLoading } = useMutation(
    (mutationData) => addNewElement({ data: mutationData, layerKey }),
    {
      onSuccess: (res) => {
        // close form
        dispatch(setMapState({}));
        // refetch layer
        dispatch(
          fetchLayerDataThunk({
            regionIdList: selectedRegionIds,
            layerKey,
          })
        );
      },
      onError: (err) => {
        let errData = get(err, "response.data");

        for (const fieldKey in errData) {
          if (Object.hasOwnProperty.call(errData, fieldKey)) {
            const errList = errData[fieldKey];
            formRef.current.onError(fieldKey, get(errList, "0", ""));
          }
        }
      },
    }
  );
  const onSubmit = (data, setError, clearErrors) => {
    clearErrors();
    // convert data to server friendly form
    const validatedData = transformAndValidateData(data, setError);
    addElement(validatedData);
  };

  const onClose = () => {
    dispatch(setMapState({}));
  };

  return (
    <GisMapPopups>
      <DynamicForm
        ref={formRef}
        formConfigs={formConfig}
        data={data}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </GisMapPopups>
  );
};
