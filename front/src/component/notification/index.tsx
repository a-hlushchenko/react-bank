import "./index.css";
import { NOTIFICATION_TYPE } from "../../utils/notification-type";

import Box from "../box";

const Notification: React.FC<{
  type: string;
  message: string;
  date: string;
}> = ({ type, message, date }) => {
  return (
    <Box>
      <div className="notification">
        <span className={`notification__icon ${type}`}></span>
        <div className="notification__content">
          <strong className="notification__title">{message}</strong>
          <div className="notification__info">
            <span>{date}</span>
            <img src="img/point.svg" alt="·" />
            <span>{type}</span>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Notification;
