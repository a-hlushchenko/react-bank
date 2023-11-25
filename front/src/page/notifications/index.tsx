import React from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import Grid from "../../component/grid";
import Divider from "../../component/divider";
import Field from "../../component/field";
import Alert from "../../component/alert";
import FieldPassword from "../../component/field-password";
import NotificationList from "../../container/notification-list";
import DashboardPage from "../../component/dashboard-page";

import { useNavigate } from "react-router-dom";

import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
  REG_EXP_NAME,
  ALERT_STATUS,
  FIELD_ERROR,
} from "../../utils/form";

import {
  AUTH_DATA_ACTION_TYPE,
  AuthContext,
  DASHBOARD_DATA_ACTION_TYPE,
  DashboardContext,
} from "../../App";

const NotificationsPage: React.FC = () => {
  return (
    <DashboardPage title="Notifications">
      <NotificationList />
    </DashboardPage>
  );
};

export default NotificationsPage;
