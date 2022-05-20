import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { getIsUserLoggedIn } from "../redux/selectors/auth.selectors";
import { getLoginPath } from "../utils/url.constants";

const Redirect = ({ to, state = null }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { state });
  });
  return null;
};

const RequireAuth = ({ children }) => {
  let isUserLoggedIn = useSelector(getIsUserLoggedIn);
  let location = useLocation();

  if (!isUserLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Redirect to={getLoginPath("login")} state={{ from: location }} />;
  }

  return children;
};

export { Redirect, RequireAuth };
