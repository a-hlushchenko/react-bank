import { Navigate, useNavigate } from "react-router-dom";
import "./index.css";

const AnotherAction: React.FC<{
  text: string;
  button: string;
  onClick: () => any;
}> = ({ text, button, onClick }) => {
  const navigate = useNavigate();

  return (
    <div className="another-action">
      {text}
      <span onClick={onClick} className="click another-action__button">
        {button}
      </span>
    </div>
  );
};

export default AnotherAction;
