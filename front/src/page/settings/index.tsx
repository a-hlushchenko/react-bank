import React, { useContext } from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import Grid from "../../component/grid";
import Divider from "../../component/divider";
import Field from "../../component/field";
import Alert from "../../component/alert";
import FieldPassword from "../../component/field-password";
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

const SettingsPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.dispatch({ type: AUTH_DATA_ACTION_TYPE.LOGOUT });
    navigate("/");
  };

  class ChangeEmail extends Form {
    FIELD_NAME = {
      NEWEMAIL: "newemail",
      PASSWORD: "password",
    };

    validate: (name: string, value: string) => FIELD_ERROR | null = (
      name: string,
      value: string
    ) => {
      if (value?.length < 1) {
        return FIELD_ERROR.EMPTY;
      }

      if (value?.length > 40) {
        return FIELD_ERROR.BIG;
      }

      if (name === this.FIELD_NAME.NEWEMAIL) {
        if (!REG_EXP_EMAIL.test(String(value))) {
          return FIELD_ERROR.EMAIL;
        }
      }

      return null;
    };

    submit = async () => {
      if (this.disabled) {
        this.validateAll();
        this.firstValidate = true;
      } else {
        this.setAlert(ALERT_STATUS.PROGRESS, "Loading...");

        try {
          const res = await fetch(
            "http://localhost:4000/settings-change-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: this.convertData(),
            }
          );

          const data = await res.json();

          if (res.ok) {
            auth?.dispatch({
              type: AUTH_DATA_ACTION_TYPE.LOGIN,
              payload: data.session,
            });

            this.setAlert(ALERT_STATUS.SUCCESS, data.message);
          } else {
            this.setAlert(ALERT_STATUS.ERROR, data.message);
          }
        } catch (error) {
          this.setAlert(
            ALERT_STATUS.ERROR,
            "Change email failed, please try again!"
          );
        }
      }
    };

    convertData = () => {
      return JSON.stringify({
        email: auth?.state.user.email,
        [this.FIELD_NAME.NEWEMAIL]: this.value[this.FIELD_NAME.NEWEMAIL],
        [this.FIELD_NAME.PASSWORD]: this.value[this.FIELD_NAME.PASSWORD],
      });
    };
  }

  class ChangePassword extends Form {
    FIELD_NAME = {
      OLDPASSWORD: "oldpassword",
      NEWPASSWORD: "newpassword",
    };

    validate: (name: string, value: string) => FIELD_ERROR | null = (
      name: string,
      value: string
    ) => {
      if (value?.length < 1) {
        return FIELD_ERROR.EMPTY;
      }

      if (value?.length > 40) {
        return FIELD_ERROR.BIG;
      }

      if (
        name === this.FIELD_NAME.OLDPASSWORD ||
        name === this.FIELD_NAME.NEWPASSWORD
      ) {
        if (!REG_EXP_PASSWORD.test(String(value))) {
          return FIELD_ERROR.PASSWORD;
        }
      }

      return null;
    };

    submit = async () => {
      if (this.disabled) {
        this.validateAll();
        this.firstValidate = true;
      } else {
        this.setAlert(ALERT_STATUS.PROGRESS, "Loading...");

        try {
          const res = await fetch(
            "http://localhost:4000/settings-change-password",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: this.convertData(),
            }
          );

          const data = await res.json();

          if (res.ok) {
            auth?.dispatch({
              type: AUTH_DATA_ACTION_TYPE.LOGIN,
              payload: data.session,
            });

            this.setAlert(ALERT_STATUS.SUCCESS, data.message);
          } else {
            this.setAlert(ALERT_STATUS.ERROR, data.message);
          }
        } catch (error) {
          this.setAlert(
            ALERT_STATUS.ERROR,
            "Change email failed, please try again!"
          );
        }
      }
    };

    convertData = () => {
      return JSON.stringify({
        email: auth?.state.user.email,
        [this.FIELD_NAME.OLDPASSWORD]: this.value[this.FIELD_NAME.OLDPASSWORD],
        [this.FIELD_NAME.NEWPASSWORD]: this.value[this.FIELD_NAME.NEWPASSWORD],
      });
    };
  }

  const changeEmail = new ChangeEmail();
  const changePassword = new ChangePassword();

  return (
    <DashboardPage title="Settings">
      <Grid big>
        <Grid>
          <strong className="settings-title">Change email</strong>
          <Field
            label="Email"
            name="newemail"
            type="email"
            placeholder="email"
            onInput={(e) => changeEmail.change(e.target.name, e.target.value)}
          />
          <FieldPassword
            label="Old Password"
            name="password"
            type="password"
            placeholder="password"
            onInput={(e) => changeEmail.change(e.target.name, e.target.value)}
          />
          <Button
            text="Save Email"
            onClick={() => changeEmail.submit()}
            disabled
            transparent
            mini
          />
        </Grid>
        <Divider />
        <Grid>
          <strong className="settings-title">Change password</strong>

          <FieldPassword
            label="Old Password"
            name="oldpassword"
            type="password"
            placeholder="password"
            onInput={(e) =>
              changePassword.change(e.target.name, e.target.value)
            }
          />
          <FieldPassword
            label="New password"
            name="newpassword"
            type="password"
            placeholder="password"
            onInput={(e) =>
              changePassword.change(e.target.name, e.target.value)
            }
          />
          <Button
            text="Save Password"
            onClick={() => changePassword.submit()}
            disabled
            transparent
            mini
          />
        </Grid>
        <Divider />
        <Button
          text="Log out"
          onClick={handleLogout}
          disabled
          transparent
          mini
          color="red"
        />
      </Grid>
      <Alert />
    </DashboardPage>
  );
};

export default SettingsPage;
