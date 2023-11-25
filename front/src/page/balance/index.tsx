import React, { useContext, useState, useEffect } from "react";

import "../../normalize.css";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import {
  AUTH_DATA_ACTION_TYPE,
  AuthContext,
  DASHBOARD_DATA_ACTION_TYPE,
  DashboardContext,
} from "../../App";
import TransactionList from "../../container/transaction-list";

const BalancePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const dashboard = useContext(DashboardContext);
  const balance = dashboard?.state?.user?.balance || 0;
  const email = auth?.state.user.email;
  const [intBalance, decBalance] = String(balance).split(".");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetch(`http://localhost:4000/balance?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            auth?.dispatch({ type: AUTH_DATA_ACTION_TYPE.LOGOUT });
            navigate("/");
          }
        })
        .then((data) => {
          dashboard?.dispatch({
            type: DASHBOARD_DATA_ACTION_TYPE.UPDATE,
            payload: data.user,
          });
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }, [email]);

  return (
    <div className="page balance">
      <header className="balance__header">
        <div className="balance__top">
          <Link to="/settings" className="click balance__settings"></Link>
          <h1 className="balance__title">Main wallet</h1>
          <Link
            to="/notifications"
            className="click balance__notifications"
          ></Link>
        </div>
        <span className="balance__amount">
          $ {intBalance}.
          <span>
            {decBalance ? Math.floor(Number(decBalance) * 100) / 100 : "00"}
          </span>
        </span>
      </header>

      <div className="balance__action-list">
        <Link to="/receive" className="balance__action">
          <span className="balance__action-img balance__receive-img"></span>
          <span className="balance__action-name">Receive</span>
        </Link>
        <Link to="/send" className="balance__action">
          <span className="balance__action-img balance__send-img"></span>
          <span className="balance__action-name">Send</span>
        </Link>
      </div>

      <TransactionList />
    </div>
  );
};

export default BalancePage;
