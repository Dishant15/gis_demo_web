import get from "lodash/get";

export const getSplicingElement = (side) => (store) =>
  get(store, ["splicing", side], null);

export const getSplicingSelectedPorts = (store) => store.splicing.selectedPorts;

export const getFirstSelectedPort = (store) => {
  const selectedPort = get(store, "splicing.selectedPorts.0", {});
  return { id: selectedPort.id || null, element: selectedPort.element || null };
};
