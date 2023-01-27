import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import CableSplicingBlock from "./CableSplicingBlock";
import SplitterSplicingBlock from "./SplitterSplicingBlock";

import JcSplicingBlock from "./JcSplicingBlock";
import CableThroughConnect from "./CableThroughConnect";

import {
  getSplicingElement,
  getSplicingConnections,
  isPortUpdateLoading,
} from "planning/data/splicing.selectors";
import { getContentHeight } from "redux/selectors/appState.selectors";

const SplicingContainer = ({ onConnectionAdd }) => {
  const windowHeight = useSelector(getContentHeight);
  const portUpdateLoading = useSelector(isPortUpdateLoading);
  const connLinesRefs = useRef([]);
  // middle will always be there which is selected element, left and right is optional but one of them will be there
  const left = useSelector(getSplicingElement("left"));
  const right = useSelector(getSplicingElement("right"));
  const middle = useSelector(getSplicingElement("middle"));
  const connections = useSelector(getSplicingConnections);

  useEffect(() => {
    const $scrollBox = document.getElementById("splicing-container");
    if (!!$scrollBox) {
      $scrollBox.addEventListener(
        "scroll",
        function () {
          for (let llInd = 0; llInd < connLinesRefs.current.length; llInd++) {
            try {
              connLinesRefs.current[llInd].position();
            } catch (error) {}
          }
        },
        false
      );
    }

    return () => {
      // clear "scroll event listener"
    };
  }, []);

  useEffect(() => {
    for (let cIn = 0; cIn < connections.length; cIn++) {
      const currConn = connections[cIn];
      const elem1 = document.getElementById(currConn.elem1);
      const elem2 = document.getElementById(currConn.elem2);
      if (!!elem1 && !!elem2) {
        connLinesRefs.current.push(
          new window.LeaderLine(elem1, elem2, {
            size: 2,
            startPlug: "square",
            endPlug: "square",
          })
        );
      }
    }

    return () => {
      for (let llInd = 0; llInd < connLinesRefs.current.length; llInd++) {
        try {
          connLinesRefs.current[llInd].remove();
        } catch (error) {}
      }
    };
  }, [connections]);
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

  // contentHeight = windowHeight - (10% margin * 2 top & bot) - (title)
  const contentHeight = windowHeight - 60;

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
    <Box
      id="splicing-container"
      p={5}
      sx={{
        maxHeight: `${contentHeight}px`,
        overflowY: portUpdateLoading ? "hidden" : "auto",
        position: "relative",
      }}
    >
      {showThroughConnection ? (
        <CableThroughConnect fromData={left} toData={right} />
      ) : null}
      <Stack spacing={15} direction="row" overflow="auto">
        {renderSplicingElement(left, "left")}
        {renderSplicingElement(middle, "middle")}
        {renderSplicingElement(right, "right")}
      </Stack>
      {portUpdateLoading ? (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : null}
    </Box>
  );
};

export default SplicingContainer;
