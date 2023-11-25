import "./index.css";

const Field: React.FC<{
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  onInput?: (e?: any) => void;
}> = ({ label, name, type, placeholder, onInput }) => {
  return (
    <div className="field validation">
      {label && (
        <label className="field__label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className="field__input"
        type={type}
        name={name}
        placeholder={placeholder || ""}
        onInput={onInput}
      />
      <span className="field__error" data-name={name}>
        Помилка
      </span>
    </div>
  );
};

export default Field;
