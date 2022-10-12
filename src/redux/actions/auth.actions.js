import { queryClient } from "App/App";
import { logout } from "redux/reducers/auth.reducer";

export const handleLogoutUser = (dispatch) => {
  queryClient.clear();
  dispatch(logout());
};
