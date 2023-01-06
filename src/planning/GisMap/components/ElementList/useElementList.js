export const useElementListHook = () => {
  const dispatch = useDispatch();

  const { event, data: eventData } = useSelector(getPlanningMapState);
  const { elementList, elementData: parentData } = eventData;

  const handleShowOnMap = useCallback(
    (element) => () => {
      dispatch(onElementListItemClick(element));
    },
    []
  );

  const handleShowDetails = useCallback(
    (element) => () => {
      dispatch(
        openElementDetails({
          layerKey: element.layerKey,
          elementId: element.id,
        })
      );
    },
    []
  );

  const handleAddExistingAssociation = useCallback(
    (elementToAssociate) => () => {
      // show popup are you sure ?
      // get parentData with geometry
      // call validation api with parent geomentry
      // call edit api for element with all the parent child and other data
    }
  );
};
