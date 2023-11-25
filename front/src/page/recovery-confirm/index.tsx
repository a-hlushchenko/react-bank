import React, { useContext } from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import BackButton from "../../component/back-button";
import Page from "../../component/auth-page";
import Heading from "../../component/heading";
import Grid from "../../component/grid";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import AnotherAction from "../../component/another-action";
import Alert from "../../component/alert";
import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
  ALERT_STATUS,
  FIELD_ERROR,
} from "../../utils/form";
import { saveSession, getTokenSession, getSession } from "../../utils/session";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { AUTH_DATA_ACTION_TYPE } from "../../App";

const RecoveryConfirmPage: React.FC = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  class RecoveryConfirmForm extends Form {
    FIELD_NAME = {
      CODE: "code",
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

      if (name === this.FIELD_NAME.PASSWORD) {
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
          const res = await fetch("http://localhost:4000/recovery-confirm", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: this.convertData(),
          });

          const data = await res.json();

          if (res.ok) {
            auth?.dispatch({
              type: AUTH_DATA_ACTION_TYPE.LOGIN,
              payload: data.session,
            });
            navigate("/balance");
          } else {
            this.setAlert(ALERT_STATUS.ERROR, data.message);
          }
        } catch (error) {
          this.setAlert(
            ALERT_STATUS.ERROR,
            "Confirmation failed, please try again!"
          );
        }
      }
    };

    convertData = () => {
      return JSON.stringify({
        [this.FIELD_NAME.CODE]: this.value[this.FIELD_NAME.CODE],
        [this.FIELD_NAME.PASSWORD]: this.value[this.FIELD_NAME.PASSWORD],
        token: getTokenSession(),
      });
    };
  }

  const recoveryConfirm = new RecoveryConfirmForm();
  return (
    <Page>
      <BackButton />
      <Heading
        title="Recover password"
        subtitle="Write the code you received"
      />
      <Grid big>
        <Field
          label="Code"
          name="code"
          type="number"
          placeholder="code"
          onInput={(e) => recoveryConfirm.change(e.target.name, e.target.value)}
        />
        <FieldPassword
          label="New password"
          name="password"
          type="password"
          placeholder="password"
          onInput={(e) => recoveryConfirm.change(e.target.name, e.target.value)}
        />
        <Button
          disabled
          text="Restore password"
          onClick={() => {
            recoveryConfirm.submit();
          }}
        />
        <Alert />
      </Grid>
    </Page>
  );
};

export default RecoveryConfirmPage;
