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

const SignupConfirmPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const email = auth?.state.user.email;

  const navigate = useNavigate();

  const handleResend = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/resend-code?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
      } else {
        signupConfirm.setAlert(ALERT_STATUS.ERROR, data.message);
      }
    } catch (error) {
      signupConfirm.setAlert(
        ALERT_STATUS.ERROR,
        "Confirmation failed, please try again!"
      );
    }
  };

  class SignupConfirmForm extends Form {
    FIELD_NAME = {
      CODE: "code",
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

      return null;
    };

    submit = async () => {
      if (this.disabled) {
        this.validateAll();
        this.firstValidate = true;
      } else {
        this.setAlert(ALERT_STATUS.PROGRESS, "Loading...");

        try {
          const res = await fetch("http://localhost:4000/signup-confirm", {
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
            saveSession(data.session);
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
        token: getTokenSession(),
      });
    };
  }

  const signupConfirm = new SignupConfirmForm();
  return (
    <Page>
      <BackButton />
      <Heading title="Confirm account" subtitle="Write the code you received" />
      <Grid big>
        <Field
          label="Code"
          name="code"
          type="number"
          placeholder="code"
          onInput={(e) => signupConfirm.change(e.target.name, e.target.value)}
        />
        <AnotherAction
          text="Do not received code?"
          button="send again"
          onClick={handleResend}
        />
        <Button
          disabled
          text="Confirm"
          onClick={() => {
            signupConfirm.submit();
          }}
        />
        <Alert />
      </Grid>
    </Page>
  );
};

export default SignupConfirmPage;
