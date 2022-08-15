## Steps to add new layer on frontend side

- Add Gis layer component in src/planning/GisMap/layers folder with layer-key as file name
  - create ViewLayer component
- Update src/planning/GisMap/utils
  - getLayerCompGromKey -> import and add ViewLayer with LAYER_KEY
  - covertLayerServerData -> add converter function to convert coordinates data
