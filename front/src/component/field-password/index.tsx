import "./index.css";

const FieldPassword: React.FC<{
  label: string;
  name: string;
  type: string;
  placeholder: string;
  onInput: (e?: any) => void;
}> = ({ label, name, type, placeholder, onInput }) => {
  const handleShow = (e: React.MouseEvent<HTMLSpanElement>) => {
    const button = e.currentTarget;
    button.classList.toggle("input__show--open");

    const input: Element | null = button.previousElementSibling;

    if (input) {
      if (input.getAttribute("type") === "password") {
        input.setAttribute("type", "text");
      } else {
        input.setAttribute("type", "password");
      }
    }
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <div className="field__wrapper validation">
        <input
          className="field__input field__password"
          type={type}
          name={name}
          placeholder={placeholder}
          onInput={onInput}
        />
        <span onClick={handleShow} className="input__show"></span>
        <span className="field__error" data-name={name}>
          Помилка
        </span>
      </div>
    </div>
  );
};

export default FieldPassword;
