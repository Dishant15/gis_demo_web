import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

import { removeNotification } from "redux/reducers/notification.reducer";

import "./notification.scss";
import { Slide } from "@mui/material";

export const NOTIFICATION_TYPE = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
};

const NotificationList = () => {
  const notifications = useSelector(
    (store) => store.notifications.notifications
  );
  const dispatch = useDispatch();

  return (
    <div id="notification">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {notifications.map((notification) => {
          return (
            <NotificationDetail
              key={notification.text + notification.type}
              type={notification.type}
              title={notification.title}
              text={notification.text}
              timeout={notification.timeout}
              dispatch={dispatch}
            />
          );
        })}
      </Stack>
    </div>
  );
};

class NotificationDetail extends React.Component {
  constructor(props) {
    super(props);

    const timeout = props.timeout ? props.timeout : 5000;
    this.state = {
      timeout,
    };
  }

  componentDidMount() {
    // remove notification automatically after 5 secs (default)
    const _this = this;
    this.timerFunc = setTimeout(() => {
      // console.log(_(this.props)
      _this.removeNotification();
    }, this.state.timeout);
  }

  /*
	If Timeout is cleared than it causes problems for multiple noti.
	First removed noti clears the last created noti's timeout so the
	last one is never removed automatically
	*/
  // componentWillUnmount(){
  // 	clearTimeout(this.timerFunc);
  // }

  removeNotification = () => {
    clearTimeout(this.timerFunc);
    this.props.dispatch(removeNotification(this.props.title));
  };

  render() {
    const { type, title, text } = this.props;
    return (
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Alert key={title} severity={type} onClose={this.removeNotification}>
          <AlertTitle>{title}</AlertTitle>
          {text}
        </Alert>
      </Slide>
    );
  }
}

export default NotificationList;
