import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { isNull } from "lodash";

import Geocode from "react-geocode";

import ActionBar from "./ActionBar";
import TicketSideBar from "./TicketContent";
import GisMap from "./GisMap";

import { setTicketId } from "./data/planningGis.reducer";
import { getPlanningTicketId } from "./data/planningGis.selectors";

import "./styles/planning-page.scss";

const PlanningPage = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const ticketId = useSelector(getPlanningTicketId);

  useEffect(() => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API_KEY);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const queryTicketId = query.get("ticketId");

    // remove this null set if want only redux based utility
    if (isNaN(String(queryTicketId))) {
      dispatch(setTicketId(null));
    } else {
      dispatch(setTicketId(Number(queryTicketId)));
    }
  }, [search]);

  return (
    <div id="planning-page" className="page-wrapper">
      <div className="pl-sidebar-wrapper">
        <div className="pl-sidebar">
          <ActionBar />
        </div>

        <div className="pl-content">
          <div className="pl-map-container">
            {!isNull(ticketId) ? <TicketSideBar ticketId={ticketId} /> : null}
            <GisMap ticketId={ticketId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
