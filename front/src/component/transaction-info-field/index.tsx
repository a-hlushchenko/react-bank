import "./index.css";

const TransactionInfoField: React.FC<{ name: string; value: string }> = ({
  name,
  value,
}) => {
  return (
    <div className="transaction-info-field">
      <span>{name}</span>
      <span>{value}</span>
    </div>
  );
};

export default TransactionInfoField;
