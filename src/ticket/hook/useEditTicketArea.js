import { useMutation } from "react-query";
import { editTicketArea } from "ticket/data/services";

const useEditTicketArea = (props = {}) => {
  const { onSuccess, onError } = props;
  const { mutate: editTicketAreaMutation, isLoading: isTicketAreaEditing } =
    useMutation(editTicketArea, {
      onSuccess,
      onError,
    });
  return { editTicketAreaMutation, isTicketAreaEditing };
};

export default useEditTicketArea;
