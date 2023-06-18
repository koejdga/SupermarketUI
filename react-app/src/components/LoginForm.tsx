import UserService, { User } from "../services/UserService";
import "./LoginForm.css";
import { useState } from "react";

interface Props {
  handleLogIn: (idEmployee: string, user: User) => void;
}

const LoginForm = ({ handleLogIn }: Props) => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const logIn = async () => {
    if (!username) {
      // alert empty username
    } else if (!password) {
      // alert empty password
    } else {
      console.log(username);
      console.log(password);
      let user = { username: username, password: password };
      const userService = new UserService(user);

      try {
        const response = await userService.logIn();
        console.log(response);
        handleLogIn(response, user);
      } catch (error) {
        console.log("alerttt");
        // alert wrong username or password
      }
    }
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
        <button type="button" onClick={logIn}>
          Увійти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
