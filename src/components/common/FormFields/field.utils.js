import { format } from "date-fns";
import isDate from "lodash/isDate";

export const getDateValue = (formDate) => {
  let value = null;
  if (formDate) {
    if (isDate(formDate)) {
      value = format(formDate, "dd/MM/YYY");
    } else {
      value = format(new Date(formDate), "dd/MM/YYY");
    }
  }
  return value;
};
