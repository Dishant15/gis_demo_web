import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import CableSplicingBlock from "./CableSplicingBlock";
import SplitterSplicingBlock from "./SplitterSplicingBlock";
import { useSelector } from "react-redux";
import { getSplicingElement } from "planning/data/splicing.selectors";
import JcSplicingBlock from "./JcSplicingBlock";
import CableThroughConnect from "./CableThroughConnect";

const SplicingContainer = ({ onConnectionAdd }) => {
  // middle will always be there which is selected element, left and right is optional but one of them will be there
  const left = useSelector(getSplicingElement("left"));
  const right = useSelector(getSplicingElement("right"));
  const middle = useSelector(getSplicingElement("middle"));
  // render helpers
  const hasLeft = !!left;
  const hasRight = !!right;
  // show through cable connect option if user has both left and right
  // both sides are cable types
  const showThroughConnection =
    hasLeft &&
    left.layer_key === "p_cable" &&
    hasRight &&
    right.layer_key === "p_cable";

  const renderSplicingElement = (elementData, side) => {
    if (!elementData) {
      return null;
    } else if (elementData.layer_key === "p_cable") {
      return <CableSplicingBlock portData={elementData} side={side} />;
    } else if (elementData.layer_key === "p_splitter") {
      return (
        <SplitterSplicingBlock
          onConnectionAdd={onConnectionAdd}
          portData={elementData}
          side={side}
          hasLeft={hasLeft}
          hasRight={hasRight}
        />
      );
    } else if (elementData.layer_key === "p_jointcloser") {
      return <JcSplicingBlock portData={elementData} side={side} />;
    }
  };

  return (
    <Box p={5}>
      {showThroughConnection ? (
        <CableThroughConnect fromData={left} toData={right} />
      ) : null}
      <Stack spacing={15} direction="row" overflow="auto">
        {renderSplicingElement(left, "left")}
        {renderSplicingElement(middle, "middle")}
        {renderSplicingElement(right, "right")}
      </Stack>
    </Box>
  );
};

export default SplicingContainer;
