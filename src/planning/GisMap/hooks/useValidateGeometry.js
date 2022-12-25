import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import has from "lodash/has";

import { validateElementGeometry } from "planning/data/layer.services";
import { addNotification } from "redux/reducers/notification.reducer";
import { coordsToLatLongMap } from "utils/map.utils";

const useValidateGeometry = () => {
  const dispatch = useDispatch();
  const [errPolygons, setErrPolygons] = useState([]);

  const { mutate: validateElement, isLoading: isValidationLoading } =
    useMutation(validateElementGeometry, {
      // reset errors on mutate
      onMutate: () => setErrPolygons([]),
      onError: (err) => {
        if (err.response.status === 400) {
          const errData = get(err, "response.data", {});
          // is intersection error
          if (has(errData, "intersects")) {
            if (!!errData.intersects?.length) {
              // get and show error polygon
              let errPolyCoords = [];
              for (
                let int_ind = 0;
                int_ind < errData.intersects.length;
                int_ind++
              ) {
                const currIntersectCoords = errData.intersects[int_ind];

                const errCoordinates = coordsToLatLongMap(
                  currIntersectCoords[0]
                );
                errPolyCoords.push(errCoordinates);
              }
              setErrPolygons(errPolyCoords);
            }
            dispatch(
              addNotification({
                type: "error",
                title: "Input error",
                text: "New geometry has incorrect intersection with adjacent geometries. Please correct the red area show on map.",
              })
            );
          } else if (!!errData.contains?.length) {
            dispatch(
              addNotification({
                type: "error",
                title: "Input error",
                text: get(errData, "contains.0"),
              })
            );
          }
        } else {
          // can be 500 error
          dispatch(
            addNotification({
              type: "error",
              title: "Operation Failed",
              text: "Something went wrong at our side. Please try again after refreshing the page.",
            })
          );
        }
      },
    });

  return {
    validateElementMutation: validateElement,
    errPolygons,
    isValidationLoading,
  };
};

export default useValidateGeometry;
