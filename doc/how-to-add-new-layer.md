## Steps to add new layer on frontend side

- update files in src/planning/GisMap/layers
  - create LayerComponents
  - create configurations
  - export everythin from index
- Update src/planning/GisMap/utils
  - import all details and update mapping -> LayerKeyMappings
  - update converter function -> convertLayerServerData add key in one of the if conditions
- Update src/gis_user/components/UserPermissions
  - add entry in USER_LAYER_PERMS_CONFIG
