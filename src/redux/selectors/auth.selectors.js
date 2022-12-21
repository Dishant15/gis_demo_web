import { createSelector } from "@reduxjs/toolkit";
import get from "lodash/get";

export const getIsUserLoggedIn = (store) => !!store.auth.token;

export const getLoggedUserDetails = (store) => store.auth.user;
export const getLoggedUserLoginTime = (store) => store.auth.loginSince;

export const getIsAdminUser = (store) => store.auth.isAdmin;

export const getIsSuperAdminUser = (store) =>
  !!get(store, "auth.user.is_superuser");

export const getUserPermissions = (store) => store.auth.permissions;

export const checkUserPermission = (perm) =>
  createSelector(
    getUserPermissions,
    getIsSuperAdminUser,
    (permissions, isSuperuser) => get(permissions, perm, false) || isSuperuser
  );

// create user permission obj from current logged in user
export const createDefaultPermissions = createSelector(
  getUserPermissions,
  (permissions) => {
    let perm = {};
    for (const key in permissions) {
      if (Object.hasOwnProperty.call(permissions, key)) {
        if (key === "id") continue;
        perm[key] = false;
      }
    }
    return perm;
  }
);
