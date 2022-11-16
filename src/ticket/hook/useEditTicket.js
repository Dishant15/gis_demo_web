import { useMutation } from "react-query";
import { editTicket } from "ticket/data/services";

const useEditTicket = (props = {}) => {
  const { onSuccess, onError } = props;
  const { mutate: editTicketMutation, isLoading: isTicketEditing } =
    useMutation(editTicket, {
      onSuccess,
      onError,
    });
  return { editTicketMutation, isTicketEditing };
};

export default useEditTicket;
