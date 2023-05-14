import "./LoginForm.css";

const LoginForm = () => {
  return (
    <div className="login-form">
      <h2>Login Form</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoginForm;
