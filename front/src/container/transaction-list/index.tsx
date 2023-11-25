import "./index.css";

import React, { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext, DashboardContext } from "../../App";
import { TRANSACTION_TYPE } from "../../utils/transaction-type";
import { useNavigate } from "react-router-dom";

const TransactionList: React.FC<{}> = () => {
  const auth = useContext(AuthContext);
  const dashboard = useContext(DashboardContext);
  const transactionList = dashboard?.state?.user?.transactions;

  const navigate = useNavigate();

  const handleTransactionClick = (id: number) => {
    navigate(`/transaction/${id}`);
  };

  return (
    <div className="transaction-list">
      {transactionList?.length > 0 ? (
        transactionList.reverse().map((transaction: { [key: string]: any }) => {
          let type;
          let name;

          switch (transaction.type) {
            case TRANSACTION_TYPE.PLUS:
              type = { name: "Receipt", operator: "+" };
              name =
                transaction.companyName ||
                `${transaction.firstname} ${transaction.lastname[0]}.`;
              break;
            case TRANSACTION_TYPE.MINUS:
              type = { name: "Sending", operator: "-" };
              name = `${transaction.firstname} ${transaction.lastname[0]}.`;
          }

          const [intAmount, decAmount] = String(transaction.amount).split(".");

          return (
            <Fragment key={transaction.id}>
              <button
                className="transaction"
                onClick={() => handleTransactionClick(transaction.id)}
              >
                <span
                  className={`transaction__icon ${transaction.companyName}`}
                ></span>
                <div className="transaction__content">
                  <div className="transaction__info">
                    <strong className="transaction__name">{name}</strong>
                    <div className="transaction__info-bottom">
                      <span className="transaction__date">
                        {transaction.date}
                      </span>
                      <img src="img/point.svg" alt="·" />
                      <span className="transaction__type">{type?.name}</span>
                    </div>
                  </div>
                  <span className={`transaction__amount ${type?.name}`}>
                    {type?.operator}${intAmount}.
                    <span>
                      {decAmount
                        ? Math.floor(Number(decAmount) * 100) / 100
                        : "00"}
                    </span>
                  </span>
                </div>
              </button>
            </Fragment>
          );
        })
      ) : (
        <div className="transaction__list--empty">
          There are no transactions
        </div>
      )}
    </div>
  );
};

export default TransactionList;
