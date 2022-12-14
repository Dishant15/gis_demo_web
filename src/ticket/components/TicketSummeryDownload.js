import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

import { format } from "date-fns";

import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import LoadingButton from "@mui/lab/LoadingButton";

import { addNotification } from "redux/reducers/notification.reducer";
import { fetchExportTicketSummery } from "ticket/data/services";

const TicketSummeryDownload = () => {
  const dispatch = useDispatch();

  const { mutate: exportMutation, isLoading: loadingExport } = useMutation(
    fetchExportTicketSummery,
    {
      onSuccess: (res) => {
        const report_name =
          "ticket_summery" +
          "_" +
          format(new Date(), "dd/MM/yyyy") +
          "_" +
          format(new Date(), "hh:mm");

        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${report_name}.xlsx`);
        // have to add element to doc for firefox
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      onError: (err) => {
        dispatch(
          addNotification({
            type: "error",
            title: "Error",
            text: err.message,
          })
        );
      },
    }
  );

  return (
    <LoadingButton
      color="secondary"
      startIcon={<DownloadForOfflineIcon />}
      onClick={exportMutation}
      sx={{ ml: 1 }}
      loading={loadingExport}
    >
      Download xlsx
    </LoadingButton>
  );
};

export default TicketSummeryDownload;
