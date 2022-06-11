export const getHomePath = () => "/";
export const getLoginPath = () => "/login";

export const getGeoSurveyPath = () => "/geo/survey";

export const getRegionPage = () => "/regions";

export const getUserListPage = () => "/users/list";
export const getAddUserPage = () => "/users/add";

export const getTicketListPage = () => "/ticket/list";
export const getAddTicketPage = () => "/ticket/add";
export const getEditTicketPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/edit`;
export const getTicketWorkorderPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/workorders`;

/* External server apis **/

export const apiPostLogin = () => "/api/token/";
// area pocket apis
export const apiGetAreaPocketList = () => "/api/geo/survey/area-pocket/list/";
export const apiPostAreaPocketAdd = () => "/api/geo/survey/area-pocket/add/";
export const apiPutAreaPocketEdit = (areaPocketId) =>
  `/api/geo/survey/area-pocket/${areaPocketId}/edit/`;

// region apis
export const apiGetRegionList = () => "/api/region/list/";
export const apiPostRegionAdd = () => "/api/region/add/";
export const apiPutRegionEdit = (regionId) => `/api/region/${regionId}/edit/`;
export const apiRegionDelete = (regionId) => `/api/region/${regionId}/delete/`;

export const apiGetUserList = () => "/api/user/list/";
export const apiAddUser = () => "/api/user/add/";
export const apiUpdateUserRegion = (userId) =>
  `/api/user/${userId}/update/regions/`;

export const apiGetApplicationsList = () => "/api/applications/";

export const apiGetTicketList = () => "/api/ticket/list/";
export const apiPostTicketAdd = () => "/api/ticket/add/";
export const apiPostTicketEdit = (ticketId) => `/api/ticket/${ticketId}/edit/`;
export const apiPostTicketEditArea = (ticketId) =>
  `/api/ticket/${ticketId}/edit/area/`;
export const apiGetTicketDetails = (ticketId) =>
  `/api/ticket/${ticketId}/details/`;
export const apiGetTicketWorkorders = (ticketId) =>
  `/api/ticket/${ticketId}/workorders/`;
