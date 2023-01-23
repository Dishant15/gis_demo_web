// styles to re use
export const elementBorders = "1px solid black";

export const elementLabelCenter = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "5px",
  borderRadius: "5px",
};

export const connectionDotStyles = (isInput) => {
  const connectionDotMargin = isInput
    ? { marginRight: "-5px" }
    : { marginLeft: "-5px" };

  return {
    ...connectionDotMargin,
    zIndex: 10,
    cursor: "pointer",
  };
};

export const portBoxShadow =
  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px";
