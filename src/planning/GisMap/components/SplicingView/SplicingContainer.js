import React, { useMemo } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import CableSplicingBlock from "./CableSplicingBlock";

const SplitterSplicingBlock = ({ portData }) => {
  return <Box>{portData.name}</Box>;
};

const SplicingContainer = ({ left, right, middle }) => {
  // middle will always be there which is selected element, left and right is optional but one of them will be there
  const mayBeLeftComponent = useMemo(() => {
    if (!left) return null;
    if (left.layer_key === "p_cable") {
      return <CableSplicingBlock portData={left} side="left" />;
    }
  }, [left]);

  const middleComponent = useMemo(() => {
    if (!middle) return null;
    if (middle.layer_key === "p_cable") {
      return <CableSplicingBlock portData={middle} />;
    } else if (middle.layer_key === "p_splitter") {
      return <SplitterSplicingBlock portData={middle} />;
    }
  }, [middle]);

  const mayBeRightComponent = useMemo(() => {
    if (!right) return null;
    if (right.layer_key === "p_cable") {
      return <CableSplicingBlock portData={right} side="right" />;
    }
  }, [right]);

  return (
    <Box>
      <Stack spacing={5} direction="row" overflow="auto">
        {mayBeLeftComponent}
        {middleComponent}
        {mayBeRightComponent}
      </Stack>
    </Box>
  );
};

export default SplicingContainer;
