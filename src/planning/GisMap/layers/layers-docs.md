# Layer folder structure

- components
  - CustomOverrideComponent.js ( ie. forms, fields for dynamic form )
- configurations
- index

# configurations

- LAYER_KEY : identify layer by this key
- LAYER_FEATURE_TYPE: point, polygon, polyline
- [FIELD_NAME]\_OPTIONS: list of options for select fields

## form related data

- INITIAL_ELEMENT_DATA: empty data for add form
- ELEMENT_FORM_TEMPLATE: config data to generate DynamicForm

## Configurable elements data

- INITIAL_CONFIG_DATA: empty data for admin add config form
- CONFIG_LIST_TABLE_COL_DEFS: table col details, used to show list of configs on admin layer config list page
- ELEMENT_CONFIG_TEMPLATE: config data to generate DynamicForm for layer configurations

## utils functions

- transformAndValidateConfigData
