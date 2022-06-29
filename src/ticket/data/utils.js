export const generateTicketUid = (region, t_type) => {
  let resStr = "";
  // add region
  const reg = !!region ? region : "REG";
  resStr += reg;
  // add type
  resStr += "_";
  const tt = !!t_type ? t_type : "TT";
  resStr += tt;
  resStr += "_";
  return resStr;
};
