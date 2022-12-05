import get from "lodash/get";

export const handlePreventDefault = (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
};

export const getFormattedAddressFromGoogleAddress = (data) => {
  const address = get(data, "results.0.formatted_address", "");
  const firstAddress = get(data, "results.0.address_components", []);
  let city = "";
  let state = "";
  let country = "";
  let pincode = "";
  let name = "";
  let area = "";
  for (let i = 0; i < firstAddress.length; i++) {
    for (let j = 0; j < firstAddress[i].types.length; j++) {
      switch (firstAddress[i].types[j]) {
        case "premise":
          name = firstAddress[i].long_name;
          break;
        case "sublocality_level_1":
          area = firstAddress[i].long_name;
          break;
        case "locality":
          city = firstAddress[i].long_name;
          break;
        case "administrative_area_level_1":
          state = firstAddress[i].long_name;
          break;
        case "country":
          country = firstAddress[i].long_name;
          break;
        case "postal_code":
          pincode = firstAddress[i].long_name;
          break;
      }
    }
  }
  return { name, area, city, state, country, pincode, address };
};
