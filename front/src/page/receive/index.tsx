import React, { useContext } from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import Grid from "../../component/grid";
import Divider from "../../component/divider";
import Field from "../../component/field";
import Alert from "../../component/alert";
import FieldAmount from "../../component/field-amount";
import DashboardPage from "../../component/dashboard-page";

import { useNavigate } from "react-router-dom";

import { saveSession, getTokenSession, getSession } from "../../utils/session";

import { DASHBOARD_DATA_ACTION_TYPE } from "../../App";

import {
  Form,
  REG_EXP_AMOUNT,
  ALERT_STATUS,
  FIELD_ERROR,
} from "../../utils/form";

import { AuthContext, DashboardContext } from "../../App";

const ReceivePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const dashboard = useContext(DashboardContext);

  const navigate = useNavigate();

  const amountChange = (target: HTMLInputElement) => {
    const value = target.value;
    if (value !== "" && !REG_EXP_AMOUNT.test(value)) {
      target.value = value.slice(0, -1);
    }
  };

  class ReceiveForm extends Form {
    FIELD_NAME = {
      AMOUNT: "amount",
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

      return null;
    };

    submit = async (companyName?: string) => {
      if (this.disabled) {
        this.validateAll();
        this.firstValidate = true;
      } else {
        this.setAlert(ALERT_STATUS.PROGRESS, "Loading...");

        try {
          const res = await fetch("http://localhost:4000/receive", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: this.convertData(companyName),
          });

          const data = await res.json();

          if (res.ok) {
            dashboard?.dispatch({
              type: DASHBOARD_DATA_ACTION_TYPE.UPDATE,
              payload: data.user,
            });
            navigate("/balance");
          } else {
            this.setAlert(ALERT_STATUS.ERROR, data.message);
          }
        } catch (error) {
          this.setAlert(
            ALERT_STATUS.ERROR,
            "Receive failed, please try again!"
          );
        }
      }
    };

    convertData = (companyName?: string) => {
      return JSON.stringify({
        [this.FIELD_NAME.AMOUNT]: this.value[this.FIELD_NAME.AMOUNT],
        companyName: companyName,
        email: auth?.state.user.email,
      });
    };
  }

  const receive = new ReceiveForm();

  return (
    <DashboardPage title="Receive">
      <Grid big>
        <Grid>
          <strong className="receive__title">Receive amount</strong>
          <FieldAmount
            name="amount"
            onInput={(e) => {
              receive.change(e.target.name, e.target.value);
              amountChange(e.target);
            }}
          />
        </Grid>
        <Divider />
        <Grid>
          <strong className="receive__title">Payment system</strong>
          <button
            className="payment-system click"
            onClick={() => receive.submit("Stripe")}
          >
            <div className="payment-system__left">
              <span className="transaction__icon stripe"></span>
              <span className="payment-system__title">Stripe</span>
            </div>
            <div className="payment-system__right">
              <img src="/img/payment-icon1.svg" alt="mastercard" />
              <img src="/img/payment-icon2.svg" alt="tron" />
              <img src="/img/payment-icon3.svg" alt="bch" />
              <img src="/img/payment-icon4.svg" alt="tron" />
              <img src="/img/payment-icon5.svg" alt="eth" />
              <img src="/img/payment-icon6.svg" alt="binance" />
            </div>
          </button>
          <button
            className="payment-system click"
            onClick={() => receive.submit("Coinbase")}
          >
            <div className="payment-system__left">
              <span className="transaction__icon coinbase"></span>
              <span className="payment-system__title">Coinbase</span>
            </div>
            <div className="payment-system__right">
              <img src="/img/payment-icon2.svg" alt="tron" />
              <img src="/img/payment-icon1.svg" alt="mastercard" />
              <img src="/img/payment-icon4.svg" alt="tron" />
              <img src="/img/payment-icon3.svg" alt="bch" />
              <img src="/img/payment-icon6.svg" alt="binance" />
              <img src="/img/payment-icon5.svg" alt="eth" />
            </div>
          </button>
        </Grid>
        <Alert />
      </Grid>
    </DashboardPage>
  );
};

export default ReceivePage;
