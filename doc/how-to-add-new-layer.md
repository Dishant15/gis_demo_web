## Steps to add new layer on frontend side

- update files in src/planning/GisMap/layers
  - create configurations
  - (optional) create custom override components inside components folder of layer
  - export everythin from index
- Update src/planning/GisMap/utils
  - import all details and update mapping -> LayerKeyMappings
- Update src/gis_user/components/UserPermissions
  - add entry in USER_LAYER_PERMS_CONFIG
