import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";

import {
  Box,
  Divider,
  Stack,
  Container,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";

import { size, get, isNull } from "lodash";

import PermissionNotFound from "components/common/PermissionNotFound";
import RegionDummyLoader from "region/components/RegionDummyLoader";
import UserManagementPermissionForm from "gis_user/components/UserManagementPermissionForm";

import {
  getIsAdminUser,
  getIsSuperAdminUser,
} from "redux/selectors/auth.selectors";
import { fetchUserRoles } from "gis_user/data/services";

/**
 * Parent
 *    App
 */
const UserManagementPageWrapper = (props) => {
  const isSuperUser = useSelector(getIsSuperAdminUser);
  const isAdminUser = useSelector(getIsAdminUser);

  if (isSuperUser || isAdminUser) {
    return <UserManagementPage />;
  } else {
    return (
      <Container>
        <Paper
          sx={{
            mt: 3,
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PermissionNotFound />
        </Paper>
      </Container>
    );
  }
};

/**
 * fetch user roles list
 * handle role selection from list and show permission form
 */
const UserManagementPage = () => {
  const [selectedConfig, setSelectedConfig] = useState(null); // null, {}, {...role details}
  const { isLoading, data = [] } = useQuery("userRoles", fetchUserRoles);

  const handleRoleSelect = useCallback(
    (config) => () => {
      setSelectedConfig(config);
    },
    []
  );

  if (isLoading) {
    return <RegionDummyLoader />;
  }

  return (
    <div id="region-page" className="page-wrapper planning-config-page">
      <div className="reg-content-wrapper">
        <div className="reg-pocket-list">
          <div className="reg-list-wrapper">
            <Stack direction="row">
              <Box
                color="primary.dark"
                flex={1}
                className="reg-list-header-pill"
              >
                Select User Role
              </Box>
              <Button
                color="success"
                startIcon={<AddIcon />}
                onClick={handleRoleSelect({})}
              >
                New Role
              </Button>
            </Stack>
            <Divider flexItem orientation="horizontal" />

            {size(data) ? (
              data.map((config) => {
                const { id, name } = config;
                const isActive = id === selectedConfig?.id;

                return (
                  <Box className="reg-list-pill planning-pill" key={id}>
                    <Stack
                      direction="row"
                      width="100%"
                      spacing={2}
                      px={1}
                      py={1.5}
                      justifyContent="space-between"
                      className="clickable"
                      onClick={handleRoleSelect(config)}
                    >
                      <span>{name}</span>
                      {isActive ? <ArrowForwardIosIcon /> : null}
                    </Stack>
                    <Divider flexItem />
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="subtitle1"
                gutterBottom
                textAlign="center"
                paddingY={4}
              >
                No user roles added yet!
              </Typography>
            )}
          </div>
        </div>
        <div className="reg-content">
          <Container
            sx={{
              paddingTop: 3,
              paddingBottom: 3,
              height: "100%",
            }}
          >
            <Paper
              sx={{
                height: "100%",
                overflow: "auto",
              }}
            >
              {isNull(selectedConfig) ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Typography variant="h5">
                    Please select role or add new role
                  </Typography>
                </Box>
              ) : (
                <UserManagementPermissionForm
                  data={selectedConfig}
                  handleRoleSelect={handleRoleSelect}
                  key={get(selectedConfig, "id", null)}
                />
              )}
            </Paper>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPageWrapper;
