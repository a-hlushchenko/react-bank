import React, { useContext } from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import Grid from "../../component/grid";
import Field from "../../component/field";
import FieldAmount from "../../component/field-amount";
import Alert from "../../component/alert";
import DashboardPage from "../../component/dashboard-page";

import { useNavigate } from "react-router-dom";

import { DASHBOARD_DATA_ACTION_TYPE } from "../../App";

import {
  Form,
  REG_EXP_AMOUNT,
  REG_EXP_EMAIL,
  ALERT_STATUS,
  FIELD_ERROR,
} from "../../utils/form";

import { AuthContext, DashboardContext } from "../../App";

const SendPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const dashboard = useContext(DashboardContext);

  const navigate = useNavigate();

  const amountChange = (target: HTMLInputElement) => {
    const value = target.value;
    if (value !== "" && !REG_EXP_AMOUNT.test(value)) {
      target.value = value.slice(0, -1);
    }
  };

  class SendForm extends Form {
    FIELD_NAME = {
      AMOUNT: "amount",
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

      if (name === this.FIELD_NAME.AMOUNT) {
        if (!REG_EXP_AMOUNT.test(String(value))) {
          return FIELD_ERROR.AMOUNT;
        }
      }

      if (name === this.FIELD_NAME.EMAIL) {
        if (!REG_EXP_EMAIL.test(String(value))) {
          console.log("error");
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
          const res = await fetch("http://localhost:4000/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: this.convertData(),
          });

          const data = await res.json();

          if (res.ok) {
            this.setAlert(ALERT_STATUS.SUCCESS, data.message);

            dashboard?.dispatch({
              type: DASHBOARD_DATA_ACTION_TYPE.UPDATE,
              payload: data.user,
            });
            setTimeout(() => navigate("/balance"), 2000);
          } else {
            this.setAlert(ALERT_STATUS.ERROR, data.message);
          }
        } catch (error) {
          this.setAlert(ALERT_STATUS.ERROR, "Send failed, please try again!");
        }
      }
    };

    convertData = () => {
      return JSON.stringify({
        [this.FIELD_NAME.AMOUNT]: this.value[this.FIELD_NAME.AMOUNT],
        [this.FIELD_NAME.EMAIL]: this.value[this.FIELD_NAME.EMAIL],
        senderEmail: auth?.state.user.email,
      });
    };
  }

  const send = new SendForm();
  return (
    <DashboardPage title="Receive">
      <Grid big>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="email"
          onInput={(e) => send.change(e.target.name, e.target.value)}
        />
        <FieldAmount
          label="Sum"
          name="amount"
          onInput={(e) => {
            send.change(e.target.name, e.target.value);
            amountChange(e.target);
          }}
        />
      </Grid>
      <Button
        text="Send"
        onClick={() => {
          send.submit();
        }}
        disabled
      />
      <Alert />
    </DashboardPage>
  );
};

export default SendPage;
