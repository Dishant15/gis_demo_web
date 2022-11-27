import React from "react";
import { useSelector } from "react-redux";

import get from "lodash/get";

import { FormSelect } from "../FormFields";

import { getSingleLayerConfigurationList } from "planning/data/planningState.selectors";

const ConfigSelect = ({
  label,
  field_key,
  validationProps,
  disabled,
  required,
  errors,
  configuration,
}) => {
  const configList = useSelector(
    getSingleLayerConfigurationList(configuration.layerKey)
  );
  console.log(configuration, configList);
  return (
    <FormSelect
      label={label}
      name={field_key}
      rules={validationProps}
      isDisabled={!!disabled}
      required={required}
      options={[]}
      error={!!get(errors, [field_key])}
      helperText={get(errors, [field_key, "message"], "")}
    />
  );
};

export default ConfigSelect;
