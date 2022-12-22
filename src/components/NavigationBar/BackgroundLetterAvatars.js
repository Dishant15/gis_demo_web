import React from "react";
import Avatar from "@mui/material/Avatar";
import get from "lodash/get";

const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const stringAvatar = (name) => {
  const namelist = name.split(" ");
  const name1 = get(namelist, [0, 0], "G");
  const name2 = get(namelist, [1, 0], "T");
  return {
    sx: {
      height: "34px",
      width: "34px",
      fontSize: "1rem",
    },
    children: `${name1}${name2}`,
  };
};

const BackgroundLetterAvatars = ({ name }) => {
  return <Avatar {...stringAvatar(name || "GpsTek")} />;
};

export default BackgroundLetterAvatars;
