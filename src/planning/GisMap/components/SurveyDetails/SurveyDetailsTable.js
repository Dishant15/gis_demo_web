import React, { Fragment, useCallback, useRef } from "react";
import { get } from "lodash";

import { Box, Button } from "@mui/material";
import { CONFIG } from "./configuration";

import "./survey-table.scss";
import { useMutation } from "react-query";
import { fetchExportSurveyForm } from "planning/data/ticket.services";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { addNotification } from "redux/reducers/notification.reducer";
import GetAppIcon from "@mui/icons-material/GetApp";
import LoadingButton from "@mui/lab/LoadingButton";

const SurveyDetailsTable = ({ surveyData }) => {
  const tableRef = useRef();

  const dispatch = useDispatch();
  const { mutate: exportMutation, isLoading } = useMutation(
    fetchExportSurveyForm,
    {
      onSuccess: (res) => {
        const report_name =
          "survey-form" +
          "-" +
          format(new Date(), "dd/MM/yyyy") +
          "-" +
          format(new Date(), "hh:mm");

        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${report_name}.pdf`);
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

  const handleGeneratePdf = () => {
    exportMutation(tableRef.current.outerHTML);
  };

  return (
    <Box p={2}>
      <Box>
        <LoadingButton
          color="secondary"
          startIcon={<GetAppIcon />}
          loading={isLoading}
          onClick={handleGeneratePdf}
        >
          Download
        </LoadingButton>
      </Box>
      <Box className="survey-table-wrapper" ref={tableRef}>
        <table className="survey-table">
          <tbody>
            {CONFIG.map((conf, index) => {
              const { section, isLeft } = conf;
              return (
                <Fragment key={index}>
                  <tr>
                    <td
                      colSpan={4}
                      className={`section-title ${isLeft ? "left-t" : ""}`}
                    >
                      {section}
                    </td>
                  </tr>
                  {conf.fields.map((fieldChunk, ind) => {
                    return (
                      <tr key={ind}>
                        {fieldChunk.map((fieldConf, fInd) => {
                          const { colSpan, label, field } = fieldConf;
                          const value = get(surveyData, field, "");
                          if (colSpan) {
                            return <td key={fInd} colSpan={colSpan} />;
                          }
                          return (
                            <Fragment key={fInd}>
                              <td>{label}</td>
                              <td>{value}</td>
                            </Fragment>
                          );
                        })}
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

const styles = {
  wrapper: {},
};

export default SurveyDetailsTable;
