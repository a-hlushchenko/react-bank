import "./index.css";

const Button: React.FC<{
  text: string;
  transparent?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  mini?: boolean;
}> = ({ text, transparent, onClick, disabled, color, mini }) => {
  return (
    <button
      className={`click button${transparent ? " button--transparent" : ""}${
        disabled ? " button--disabled" : ""
      }${mini ? " button--mini" : ""}${color ? ` button--${color}` : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
