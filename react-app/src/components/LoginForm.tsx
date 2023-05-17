import "./LoginForm.css";
import getData from "../App";

const LoginForm = () => {
  return (
    <div className="login-form">
      <h2>Супермаркет «ZLAGODA»</h2>
      <form>
        <label htmlFor="username">Ім'я користувач/ки:</label>
        <input type="text" id="username" name="username" />
        <br />
        <label htmlFor="password">Пароль:</label>
        <input type="password" id="password" name="password" />
        <br />
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginForm;
