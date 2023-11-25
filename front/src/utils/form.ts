export const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);

export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

export const REG_EXP_NAME = new RegExp(/^[a-zA-Z]{3,12}$/);

export const REG_EXP_AMOUNT = new RegExp(/^\d{0,4}(\.\d{0,2})?$/);

export enum FIELD_ERROR {
  EMPTY = "field can't be empty",
  EMAIL = "Enter a valid email",
  PASSWORD = "Minimum 8 characters, 1 number and a capital letter",
  BIG = "Too many characters",
  FIRSTNAME = "Enter your firstname",
  LASTNAME = "Enter your lastname",
  AMOUNT = "Enter the correct amount",
}

export enum ALERT_STATUS {
  PROGRESS,
  SUCCESS,
  ERROR,
  DISABLED,
}

export class Form {
  public FIELD_NAME: { [key: string]: string } = {};

  value: { [key: string]: string } = {};
  error: { [key: string]: FIELD_ERROR } = {};

  disabled = true;

  firstValidate = false;

  public validate: (name: string, value: string) => FIELD_ERROR | null = () => {
    return null;
  };
  public submit: (companyName?: string) => void = () => {};
  public convertData: (companyName?: string) => string = () => "";

  public change = (name: string, value: string) => {
    this.value[name] = value;
    const error = this.validate(name, value);
    if (error) {
      if (this.firstValidate) {
        this.setError(name, error);
      }
      this.error[name] = error;
    } else {
      this.setError(name, null);
      delete this.error[name];
    }

    this.checkDisabled();
  };

  public setError = (name: string, error: string | null) => {
    const input = document.querySelector(`.field__input[name=${name}]`);
    const field =
      name === "password"
        ? input?.parentElement?.parentElement
        : input?.parentElement;
    const span = field?.querySelector(`.field__error`);

    if (span) {
      span.innerHTML = error || "";
    }

    if (field) {
      field.classList.toggle("validation--active", Boolean(error));
    }
  };

  public checkDisabled = () => {
    let disabled = false;

    Object.values(this.FIELD_NAME).forEach((name) => {
      if (this.error[name] || this.value[name] === undefined) {
        disabled = true;
      }
    });

    const btn = document.querySelector(".button");

    btn?.classList.toggle("button--disabled", Boolean(disabled));

    if (disabled === false) {
      this.setAlert(ALERT_STATUS.DISABLED);
    }

    this.disabled = disabled;
  };

  public validateAll = () => {
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name]);

      if (error) {
        this.setError(name, error);
        this.setAlert(ALERT_STATUS.ERROR, "Error, please enter all fields!");
      }
    });
  };

  public setAlert = (status: ALERT_STATUS, text?: string) => {
    const alert: HTMLElement | null = document.querySelector(".alert");

    if (alert) {
      alert.classList.remove(
        "alert--progress",
        "alert--success",
        "alert--error",
        "alert--disabled"
      );

      switch (status) {
        case ALERT_STATUS.PROGRESS:
          alert.classList.add("alert--progress");
          break;
        case ALERT_STATUS.SUCCESS:
          alert.classList.add("alert--success");
          break;
        case ALERT_STATUS.ERROR:
          alert.classList.add("alert--error");
          break;
        default:
          alert.classList.add("alert--disabled");
      }

      if (text) {
        alert.innerText = text;
      }
    }
  };
}
