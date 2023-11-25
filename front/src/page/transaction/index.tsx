import React, { useContext, useEffect, useState } from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import Grid from "../../component/grid";
import Box from "../../component/box";
import Divider from "../../component/divider";
import Alert from "../../component/alert";
import TransactionInfoField from "../../component/transaction-info-field";
import DashboardPage from "../../component/dashboard-page";
import { TRANSACTION_TYPE } from "../../utils/transaction-type";

import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../App";

const TransactionPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const email = auth?.state.user.email;
  const { transactionId } = useParams();

  const navigate = useNavigate();

  const [amount, setAmount] = useState<number | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const [type, setType] = useState<string | undefined>();
  const [company, setCompany] = useState<string | undefined>();
  const [transactionEmail, setTransactionEmail] = useState<
    string | undefined
  >();

  const [intAmount, decAmount] = String(amount).split(".");

  if (type) {
    switch (type) {
      case TRANSACTION_TYPE.PLUS:
        setType("Receive");
        break;
      case TRANSACTION_TYPE.MINUS:
        setType("Send");
        break;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/transaction/${transactionId}?email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAmount(data.transaction.amount);
          setDate(data.transaction.date);
          setType(data.transaction.type);

          if (data.transaction.companyName) {
            setCompany(data.transaction.companyName);
          }

          if (data.transaction.transactionEmail) {
            setTransactionEmail(data.transaction.transactionEmail);
          }
        } else {
          // Вивести текст помилки, отриманий від сервера
          const errorText = await response.text();
          navigate("/balance");
          console.error("Server error:", errorText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardPage title="Transaction">
      <div className="transaction-info">
        <span className={`balance__amount ${type}`}>
          {type === "Receive" ? "+" : "-"}${intAmount}
          <span>
            .{decAmount ? Math.floor(Number(decAmount) * 100) / 100 : "00"}
          </span>
        </span>
        <Box>
          <Grid middle>
            <TransactionInfoField name="Date" value={date || ""} />
            <Divider />
            {company && (
              <>
                <TransactionInfoField name="Company" value={company} />
                <Divider />
              </>
            )}
            {transactionEmail && (
              <>
                <TransactionInfoField name="Address" value={transactionEmail} />
                <Divider />
              </>
            )}
            <TransactionInfoField name="Type" value={type || ""} />
          </Grid>
        </Box>
      </div>
    </DashboardPage>
  );
};

export default TransactionPage;
