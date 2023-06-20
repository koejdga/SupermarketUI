import { AxiosError } from "axios";
import UserService, { User } from "../services/UserService";
import "./LoginForm.css";
import { useState } from "react";
import AlertComponent from "./AlertComponent";

interface Props {
  handleLogIn: (idEmployee: string, user: User) => void;
}

const LoginForm = ({ handleLogIn }: Props) => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const logIn = async () => {
    if (!username) {
      showErrorFunction("Нікнейм не може бути пустим");
    } else if (!password) {
      showErrorFunction("Пароль не може бути пустим");
    } else {
      let user = { username: username, password: password };
      const userService = new UserService(user);

      try {
        const response = await userService.logIn();
        handleLogIn(response, user);
      } catch (error) {
        if ((error as AxiosError).message === "Network Error") {
          console.log("Network Error");
          showErrorFunction("Сервер не підключений");
        } else {
          showErrorFunction("Неправильний нікнейм або пароль");
        }
      }
    }
  };

  const showErrorFunction = (errorMessage?: string) => {
    if (errorMessage) {
      setErrorMessage(errorMessage);
    }
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  return (
    <div className="login-form">
      <h2>Супермаркет «ZLAGODA»</h2>
      <form>
        <label>Ім'я користувач/ки:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <br />
        <label>Пароль:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <br />
        <button type="button" className="submit-button" onClick={logIn}>
          Увійти
        </button>
      </form>
      {showError && <AlertComponent errorMessage={errorMessage} />}
    </div>
  );
};

export default LoginForm;
