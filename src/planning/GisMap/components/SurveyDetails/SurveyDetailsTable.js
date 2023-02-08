import React, { Fragment, useCallback } from "react";
import { get } from "lodash";

import { Box, Button } from "@mui/material";
import { CONFIG } from "./configuration";

import "./survey-table.scss";

const SurveyDetailsTable = ({ surveyData }) => {
  const handleGeneratePdf = useCallback(async () => {}, []);

  return (
    <Box p={2} className="survey-table-wrapper">
      <Button onClick={handleGeneratePdf}>Download</Button>
      <table className="survey-table">
        <tbody>
          {CONFIG.map((conf, index) => {
            return (
              <Fragment key={index}>
                <tr>
                  <td colSpan={4} className="section-title">
                    {conf.section}
                  </td>
                </tr>
                {conf.fields.map((fieldChunk, ind) => {
                  return (
                    <tr key={ind}>
                      {fieldChunk.map((fieldConf, fInd) => {
                        const {
                          type,
                          colSpan,
                          label,
                          field,
                          options = [],
                        } = fieldConf;
                        const value = get(surveyData, field, "");
                        if (colSpan) {
                          return <td colSpan={colSpan} />;
                        }
                        return (
                          <Fragment key={fInd}>
                            <td>{label}</td>
                            {type === "radio" ? (
                              <td>
                                {options.map((op) => {
                                  return (
                                    <>
                                      <input
                                        type="radio"
                                        readOnly
                                        checked={op.value === value}
                                      ></input>
                                      {op.label}
                                    </>
                                  );
                                })}
                              </td>
                            ) : (
                              <td>{value}</td>
                            )}
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
  );
};

const styles = {
  wrapper: {},
};

export default SurveyDetailsTable;
