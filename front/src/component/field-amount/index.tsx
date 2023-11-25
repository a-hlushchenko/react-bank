import "./index.css";

const FieldAmount: React.FC<{
  name: string;
  label?: string;
  onInput?: (e?: any) => void;
}> = ({ name, label, onInput }) => {
  return (
    <div className="field validation">
      {label && (
        <label className="field__label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="field__input">
        <span>$</span>
        <input type="number" name={name} onInput={onInput} />
      </div>

      <span className="field__error" data-name={name}>
        Помилка
      </span>
    </div>
  );
};

export default FieldAmount;
