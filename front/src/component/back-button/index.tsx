import "./index.css";

const BackButton: React.FC<{}> = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="back-button click"
    ></button>
  );
};

export default BackButton;
