import React from "react";
import { addNewTicket } from "ticket/data/services";
import { Box, Button } from "@mui/material";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { getTicketListPage } from "utils/url.constants";

const TicketMap = ({ formData }) => {
  const navigate = useNavigate();

  const { mutate, isLoading: isTicketAdding } = useMutation(addNewTicket, {
    onSuccess: (res) => {
      console.log("🚀 ~ file: TicketMap.js ~ line 7 ~ TicketMap ~ res", res);
      navigate(getTicketListPage());
    },
    onError: (err) => {
      console.log("🚀 ~ file: TicketMap.js ~ line 10 ~ TicketMap ~ err", err);
    },
  });

  const handleSubmit = () => {
    mutate({
      ...formData,
      coordinates: [],
    });
  };

  return (
    <Box width="100%" height="100%">
      <Button onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default TicketMap;
