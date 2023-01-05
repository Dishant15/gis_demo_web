import replace from "lodash/replace";

export const FIBER_COLOR_CODE_HEX_MAPPING = {
  blue: "#0142f2",
  orange: "#f37b02",
  green: "#01a51d",
  brown: "#833f00",
  slate: "#7d7d7d",
  white: "#FFF",
  red: "#f42300",
  black: "#000",
  yellow: "#f2d302",
  violet: "#9973ff",
  rose: "#ffbab8",
  aqua: "#65c4ff",
};

export const transformCablePortData = (portList = []) => {
  let portNameWiseData = {};
  for (let index = 0; index < portList.length; index++) {
    const port = portList[index];

    let portName = replace(port.name, ".I", "").replace(".O", "");
    if (!portNameWiseData[portName]) {
      portNameWiseData[portName] = port;
      portNameWiseData[portName]["common_name"] = portName;
    }
    if (port.is_input) {
      portNameWiseData[portName]["conn__to_A_end"] = port.element_unique_id;
    }
    if (!port.is_input) {
      portNameWiseData[portName]["conn__to_B_end"] = port.element_unique_id;
    }
  }
  return Object.values(portNameWiseData);
};
