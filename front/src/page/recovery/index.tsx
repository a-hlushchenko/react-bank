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

const RecoveryPage: React.FC = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  class RecoveryForm extends Form {
    FIELD_NAME = {
      EMAIL: "email",
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

      if (name === this.FIELD_NAME.EMAIL) {
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
          const res = await fetch("http://localhost:4000/recovery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: this.convertData(),
          });

          const data = await res.json();

          if (res.ok) {
            navigate("/recovery-confirm");
          } else {
            this.setAlert(ALERT_STATUS.ERROR, data.message);
          }
        } catch (error) {
          this.setAlert(
            ALERT_STATUS.ERROR,
            "Recovery failed, please try again!"
          );
        }
      }
    };

    convertData = () => {
      return JSON.stringify({
        [this.FIELD_NAME.EMAIL]: this.value[this.FIELD_NAME.EMAIL],
      });
    };
  }

  const recovery = new RecoveryForm();
  return (
    <Page>
      <BackButton />
      <Heading title="Recover password" subtitle="Choose a recovery method" />
      <Grid big>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="email"
          onInput={(e) => recovery.change(e.target.name, e.target.value)}
        />
        <Button
          disabled
          text="Send code"
          onClick={() => {
            recovery.submit();
          }}
        />
        <Alert />
      </Grid>
    </Page>
  );
};

export default RecoveryPage;
