import { createSlice } from "@reduxjs/toolkit";
import unionBy from "lodash/unionBy";
import pullAllBy from "lodash/pullAllBy";
import isArray from "lodash/isArray";

import { logout } from "./auth.reducer";

const initialState = {
  noti_count: 0,
  notifications: [],
};

const notificationReducer = createSlice({
  name: "notification",
  initialState,
  reducers: {
    /**
     * payload shape : {
                        type: 'error',
                        title: 'Server Error',
                        text: 'Something went horribly wrong at our side!'
                        timeout?: 5000
                    }
      payload can be array also  
     */
    addNotification: (state, { payload }) => {
      let noti_payload = payload;
      if (!isArray(noti_payload)) noti_payload = [payload];
      const new_noti_list = unionBy(state.notifications, noti_payload, "title");
      state.notifications = new_noti_list;
      state.noti_count = new_noti_list.length;
    },
    removeNotification: (state, { payload }) => {
      const new_noti_list = pullAllBy(
        state.notifications,
        [{ title: payload }],
        "title"
      );
      state.notifications = new_noti_list;
      state.noti_count = new_noti_list.length;
    },
  },
  extraReducers: {
    [logout]: () => {
      return initialState;
    },
  },
});

export const { addNotification, removeNotification } =
  notificationReducer.actions;
export default notificationReducer.reducer;
