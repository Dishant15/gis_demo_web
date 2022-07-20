import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import {
  cloneDeep,
  filter,
  isEqual,
  isNull,
  map,
  pick,
  size,
  get,
  orderBy,
  countBy,
} from "lodash";
import JSZip from "jszip";

import {
  Box,
  Divider,
  Stack,
  Typography,
  Chip,
  Popover,
  Dialog,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GetAppIcon from "@mui/icons-material/GetApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackupIcon from "@mui/icons-material/Backup";

import WorkOrderLoading from "ticket/components/WorkOrderLoading";
import WorkOrderMap from "ticket/components/WorkOrderMap";
import WorkOrderItem from "ticket/components/WorkOrderItem";
import StatusChangeForm from "ticket/components/StatusChangeForm";
import SurveyEditForm from "ticket/components/SurveyEditForm";
import UnitEditForm from "ticket/components/UnitEditForm";

import {
  exportTicket,
  fetchTicketWorkorders,
  importTicket,
  updateUnitWorkOrder,
  updateWorkOrder,
} from "ticket/data/services";
import { coordsToLatLongMap, latLongMapToCoords } from "utils/map.utils";
import { workOrderStatusTypes } from "utils/constant";
import { addNotification } from "redux/reducers/notification.reducer";
import { getTicketListPage } from "utils/url.constants";

import "../styles/ticket_survey_list.scss";
import FilePickerDialog from "components/common/FilePickerDialog";

const WorkOrderPage = () => {
  /**
   * Parent:
   *    App
   */

  // query and mutations
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, data, refetch } = useQuery(
    ["ticketWorkOrderList", ticketId],
    fetchTicketWorkorders,
    { initialData: {} }
  );

  const { mutate: editSurveyMutation, isLoading: editSurveyLoading } =
    useMutation(
      (mutationData) => {
        // mutationData : { workOrderId, {...data to edit} }
        updateWorkOrder(mutationData);
      },
      {
        onSuccess: () => {
          dispatch(
            addNotification({
              type: "success",
              title: "Survey update",
              text: "Survey coordinates updated successfully",
            })
          );
          refetch();
        },
      }
    );

  const { mutate: editUnitMutation, isLoading: editUnitLoading } = useMutation(
    updateUnitWorkOrder,
    {
      onSuccess: () => {
        dispatch(
          addNotification({
            type: "success",
            title: "Unit update",
            text: "Unit updated successfully",
          })
        );
        refetch();
      },
    }
  );

  const { mutate: exportTicketMutation, isLoading: loadingExportTicket } =
    useMutation(exportTicket, {
      onSuccess: (res) => {
        const fileBlob = new Blob([res], {
          type: "application/zip",
        });
        const url = window.URL.createObjectURL(fileBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${data.name}.zip`);
        // have to add element to doc for firefox
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    });

  const { mutate: importTicketMutation, isLoading: loadingImportTicket } =
    useMutation(importTicket, {
      onError: (err) => {
        console.log("🚀 ~ file: WorkOrderPage ~ err", err);
        dispatch(
          addNotification({
            type: "error",
            title: "Upload shapefile",
            text: "Failed to upload shapefile.",
          })
        );
      },
      onSuccess: (res) => {
        console.log("🚀 ~ file: WorkOrderPage ~ res", res);
        handleFilePickerCancel();
        dispatch(
          addNotification({
            type: "success",
            title: "Upload shapefile",
            text: "Shapefile uploaded successfully",
          })
        );
        refetch();
      },
    });
  // data Transformation stage
  const ticketData = useMemo(() => {
    let ticket = cloneDeep(data);
    if (!size(ticket)) return {};
    // work order here is Survey workorder
    let { area_pocket, work_orders } = ticket;

    ticket.survey_count = size(work_orders);
    // convert area coordinate data
    area_pocket.coordinates = coordsToLatLongMap(area_pocket.coordinates);
    area_pocket.center = coordsToLatLongMap([area_pocket.center])[0];
    // get counts
    ticket.countByStatus = countBy(work_orders, "status");

    // convert work_orders coordinate, tags data
    for (let s_ind = 0; s_ind < work_orders.length; s_ind++) {
      const survey = work_orders[s_ind];
      const { units } = survey;
      // convert work_orders.units coordinate, tags data
      survey.coordinates = coordsToLatLongMap(survey.coordinates);
      survey.center = coordsToLatLongMap([survey.center])[0];
      // survey.tags = survey.tags.toString().split(",");
      for (let u_ind = 0; u_ind < units.length; u_ind++) {
        const unit = units[u_ind];
        // convert work_orders.units coordinate, tags data
        unit.coordinates = coordsToLatLongMap([unit.coordinates])[0];
        // unit.tags = unit.tags.toString().split(",");
      }
    }

    return ticket;
  }, [data]);

  const { area_pocket, work_orders = [], countByStatus = {} } = ticketData;

  // set states
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [surveyMapEdit, setSurveyMapEdit] = useState(null);
  const [unitMapEdit, setUnitMapEdit] = useState(null);
  const [unitFormEdit, setUnitFormEdit] = useState(false);
  const [surveyDetailsEdit, setSurveyDetailsEdit] = useState(false);
  const [surveyStatusEdit, setSurveyStatusEdit] = useState(null); // set clicked anchor
  const [surveyData, setSurveyData] = useState({});
  // importData = ticket id
  const [importData, setImportData] = useState(null);

  const [expanded, setExpanded] = useState(new Set([]));
  const [mapCenter, setMapCenter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    if (!mapCenter) {
      if (!!area_pocket?.center) {
        setMapCenter(area_pocket.center);
      }
    }
  }, [area_pocket, mapCenter]);

  // file import logic
  const handleFilePickerCancel = useCallback(() => {
    setImportData(null);
  }, [setImportData]);

  const handleFileUpload = useCallback(
    (files) => {
      console.log(
        "🚀 ~ file: WorkOrderPage.js ~ line 187 ~ handleFileUpload ~ files",
        files
      );
      const zip = new JSZip();
      const zipFolder = zip.folder(ticketData.name);
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        zipFolder.file(file.name, file);
      }

      zip.generateAsync({ type: "blob" }).then(function (blob) {
        console.log(
          "🚀 ~ file: WorkOrderPage.js ~ line 202 ~ .then ~ blob",
          blob
        );
        // saveAs(blob, "hello.zip");
        const fileObj = new File([blob], ticketData.name + ".zip", {
          type: blob.type,
        });
        const data = new FormData();
        console.log(
          "🚀 ~ file: WorkOrderPage.js ~ line 218 ~ fileObj",
          fileObj
        );
        data.append("file", blob, ticketData.name + ".zip");
        importTicketMutation({ ticketId: ticketData.id, data });
      });
    },
    [ticketData]
  );

  const handleZipFileUpload = useCallback(
    (files) => {
      console.log(
        "🚀 ~ file: WorkOrderPage.js ~ line 187 ~ handleFileUpload ~ files",
        files
      );
      const data = new FormData();
      data.append("file", files[0], ticketData.name + ".zip");
      importTicketMutation({ ticketId: ticketData.id, data });
    },
    [ticketData]
  );

  // filter work orders according to statusFilter
  const filteredWorkOrders = isNull(statusFilter)
    ? [...work_orders]
    : filter(work_orders, ["status", statusFilter]);

  // Survey filter logic
  const handleFilterClick = useCallback(
    (newStatus) => () => {
      setStatusFilter((currStatus) =>
        currStatus === newStatus ? null : newStatus
      );
    },
    []
  );

  const handleSurveySelect = useCallback(
    (surveyId, center) => () => {
      if (surveyId === selectedSurveyId) {
        setSelectedSurveyId(null);
      } else {
        setSelectedSurveyId(surveyId);
        if (!!center) {
          setMapCenter(center);
        }
      }
    },
    [selectedSurveyId]
  );

  // unit edit logic
  const handleUnitDetailsEdit = useCallback(
    (data, parentId, selectedSurveyTags) => () => {
      let formData = pick(data, [
        "id",
        "name",
        "category",
        "tags",
        "floors",
        "house_per_floor",
        "total_home_pass",
      ]);
      formData.parentId = parentId;
      formData.selectedSurveyTags = selectedSurveyTags;
      setSurveyData(formData);
      setUnitFormEdit(true);
    },
    [setSurveyData, setUnitFormEdit]
  );

  const handleUnitDetailsCancel = useCallback(() => {
    setUnitFormEdit(false);
    setSurveyData({});
  }, [setUnitFormEdit, setSurveyData]);

  const handleUnitDetailSubmit = useCallback((data, isDirty) => {
    if (isDirty) {
      editUnitMutation(
        { ...data, tags: map(data.tags, "value").join(",") },
        { onSuccess: handleUnitDetailsCancel }
      );
    } else {
      handleUnitDetailsCancel();
    }
  }, []);

  // survey details edit logic

  const handleSurveyDetailsEdit = useCallback(
    (data) => () => {
      setSurveyDetailsEdit(true);
      setSurveyData(
        pick(data, [
          "id",
          "name",
          "address",
          "area",
          "city",
          "state",
          "pincode",
          "tags",
          "broadband_availability",
          "cable_tv_availability",
          "over_head_cable",
          "cabling_required",
          "poll_cabling_possible",
          "locality_status",
        ])
      );
    },
    [setSurveyDetailsEdit, setSurveyData]
  );

  const handleSurveyDetailsCancel = useCallback(() => {
    setSurveyDetailsEdit(false);
    setSurveyData({});
  }, [setSurveyDetailsEdit, setSurveyData]);

  const handleDetailsEditSubmit = useCallback(
    (data, isDirty) => {
      if (isDirty) {
        editSurveyMutation(
          {
            workOrderId: data.id,
            data: {
              ...data,
              tags: map(data.tags, "value").join(","),
              cable_tv_availability: map(
                data.cable_tv_availability,
                "value"
              ).join(","),
              broadband_availability: map(
                data.broadband_availability,
                "value"
              ).join(","),
            },
          },
          {
            onSuccess: handleSurveyDetailsCancel,
          }
        );
      } else {
        handleSurveyDetailsCancel();
      }
    },
    [handleSurveyDetailsCancel]
  );

  // survey status edit logic

  const handleSurveyStatusEdit = useCallback(
    (event, data) => {
      setSurveyStatusEdit(event.target);
      setSurveyData(pick(data, ["id", "status", "remark"]));
    },
    [setSurveyStatusEdit, setSurveyData]
  );

  const handleSurveyStatusCancel = useCallback(() => {
    setSurveyStatusEdit(null);
    setSurveyData({});
  }, [setSurveyStatusEdit, setSurveyData]);

  const handleStatusEditSubmit = useCallback(
    (data) => {
      if (isEqual(data, surveyData)) {
        handleSurveyStatusCancel();
      } else {
        editSurveyMutation(
          {
            workOrderId: data.id,
            data: { status: data.status, remark: data.remark },
          },
          {
            onSuccess: handleSurveyStatusCancel,
          }
        );
      }
    },
    [surveyData, handleSurveyStatusCancel]
  );

  // survey polygon edit logic

  const handleSurveyMapEdit = useCallback(
    (survey) => () => {
      setSurveyMapEdit(survey);
      setMapCenter(survey.center);
    },
    [setSurveyMapEdit]
  );

  const handleEditCancel = useCallback(() => {
    setSurveyMapEdit(null);
  }, [setSurveyMapEdit]);

  const handleEditSubmit = useCallback(
    (data) => {
      editSurveyMutation({
        workOrderId: data.id,
        data: { coordinates: latLongMapToCoords(data.coordinates) },
      });
      setSurveyMapEdit(null);
    },
    [setSurveyMapEdit]
  );

  // unit marker edit logic
  const handleUnitMapEdit = useCallback(
    (unit) => () => {
      setUnitMapEdit(unit);
    },
    [setUnitMapEdit]
  );

  const handleUnitMapEditCancel = useCallback(() => {
    setUnitMapEdit(null);
  }, [setUnitMapEdit]);

  const handleUnitMapEditSubmit = useCallback(
    (data) => {
      editUnitMutation(data, { onSuccess: handleUnitMapEditCancel });
    },
    [setUnitMapEdit]
  );

  const handleExpandClick = useCallback(
    (surveyId) => () => {
      setExpanded((surveyIdSet) => {
        let newSet = new Set(surveyIdSet);
        if (newSet.has(surveyId)) {
          newSet.delete(surveyId);
        } else {
          newSet.add(surveyId);
        }
        return newSet;
      });
    },
    []
  );

  const showStatusPopover = !isNull(surveyStatusEdit);
  const hasWorkorders = size(work_orders);
  const hasFilteredWorkOrders = size(filteredWorkOrders);
  const showFilePicker = !isNull(importData);

  if (isLoading) {
    return <WorkOrderLoading />;
  }

  return (
    <Box id="dash-task-list">
      <Stack direction="row" justifyContent="space-between">
        <Button
          color="secondary"
          component={Link}
          to={getTicketListPage()}
          startIcon={<ArrowBackIcon />}
          loading={loadingExportTicket}
        >
          Go Back
        </Button>
        <Typography className="dtl-title" variant="h5" color="primary.dark">
          Workorders : {ticketData.name}
        </Typography>
        <Stack direction="row" alignItems="center">
          <LoadingButton
            color="secondary"
            startIcon={<BackupIcon />}
            // loading={loadingExportTicket}
            onClick={() => setImportData(ticketData.id)}
            sx={{ ml: 1 }}
          >
            Upload
          </LoadingButton>
          <LoadingButton
            color="secondary"
            startIcon={<GetAppIcon />}
            loading={loadingExportTicket}
            onClick={() => exportTicketMutation(ticketData.id)}
            sx={{ ml: 1 }}
          >
            Export .shp
          </LoadingButton>
        </Stack>
      </Stack>

      <Divider flexItem />

      <Stack
        className="dtl-content-wrapper"
        spacing={2}
        direction="row"
        height="100%"
        width="100%"
        sx={{
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 2, overflow: "auto" }} my={2}>
          <Stack spacing={2}>
            {!hasWorkorders ? (
              <Typography
                color="text.secondary"
                variant="h6"
                textAlign="center"
              >
                No workorders submitted yet
              </Typography>
            ) : null}
            {hasWorkorders ? (
              <Stack spacing={1} direction="row" alignItems="center">
                <Typography variant="body1">Filter :</Typography>
                {map(workOrderStatusTypes, (wStatus) => {
                  const selected = statusFilter === wStatus.value;
                  const chipLabel = `${wStatus.label} (${get(
                    countByStatus,
                    wStatus.value,
                    0
                  )})`;
                  return (
                    <Chip
                      color={selected ? wStatus.color : undefined}
                      key={wStatus.value}
                      label={chipLabel}
                      onClick={handleFilterClick(wStatus.value)}
                    />
                  );
                })}
              </Stack>
            ) : null}
            {hasFilteredWorkOrders ? (
              orderBy(filteredWorkOrders, ["id"], ["desc"]).map(
                (surveyWorkorder) => {
                  return (
                    <WorkOrderItem
                      key={surveyWorkorder.id}
                      surveyWorkorder={surveyWorkorder}
                      expanded={expanded}
                      handleExpandClick={handleExpandClick}
                      selectedSurveyId={selectedSurveyId}
                      handleSurveySelect={handleSurveySelect}
                      handleSurveyMapEdit={handleSurveyMapEdit}
                      handleUnitMapEdit={handleUnitMapEdit}
                      handleSurveyStatusEdit={handleSurveyStatusEdit}
                      handleSurveyDetailsEdit={handleSurveyDetailsEdit}
                      handleUnitDetailsEdit={handleUnitDetailsEdit}
                    />
                  );
                }
              )
            ) : hasWorkorders ? (
              <Typography color="text.secondary" textAlign="center" py={8}>
                {get(workOrderStatusTypes, [statusFilter, "label"], "Filtered")}{" "}
                workorders not found
              </Typography>
            ) : null}
          </Stack>
        </Box>
        <Box sx={{ flex: 4 }} py={2}>
          <WorkOrderMap
            areaPocket={area_pocket}
            surveyList={work_orders}
            surveyMapEdit={surveyMapEdit}
            editSurveyLoading={editSurveyLoading}
            onEditCancel={handleEditCancel}
            onEditComplete={handleEditSubmit}
            highlightSurvey={selectedSurveyId}
            onSurveySelect={handleSurveySelect}
            unitMapEdit={unitMapEdit}
            editUnitLoading={editUnitLoading}
            onUnitEditCancel={handleUnitMapEditCancel}
            onUnitEditComplete={handleUnitMapEditSubmit}
            center={mapCenter}
          />
        </Box>
        <Popover
          open={showStatusPopover}
          anchorEl={surveyStatusEdit}
          onClose={handleSurveyStatusCancel}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {showStatusPopover ? (
            <StatusChangeForm
              data={surveyData}
              editSurveyLoading={editSurveyLoading}
              onEditComplete={handleStatusEditSubmit}
              handleSurveyStatusCancel={handleSurveyStatusCancel}
            />
          ) : null}
        </Popover>
        <Dialog onClose={handleSurveyDetailsCancel} open={surveyDetailsEdit}>
          {surveyDetailsEdit ? (
            <SurveyEditForm
              formData={surveyData}
              editSurveyLoading={editSurveyLoading}
              onEditComplete={handleDetailsEditSubmit}
              handleSurveyDetailsCancel={handleSurveyDetailsCancel}
            />
          ) : null}
        </Dialog>
        <Dialog onClose={handleUnitDetailsCancel} open={unitFormEdit}>
          {unitFormEdit ? (
            <UnitEditForm
              formData={surveyData}
              editUnitLoading={editUnitLoading}
              onEditComplete={handleUnitDetailSubmit}
              handleUnitDetailsCancel={handleUnitDetailsCancel}
            />
          ) : null}
        </Dialog>
        <Dialog
          onClose={handleFilePickerCancel}
          open={showFilePicker}
          scroll="paper" // used to scroll content into dialog
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          maxWidth="sm"
        >
          {showFilePicker ? (
            <FilePickerDialog
              onSubmit={handleZipFileUpload}
              onClose={handleFilePickerCancel}
            />
          ) : null}
        </Dialog>
      </Stack>
    </Box>
  );
};

export default WorkOrderPage;
