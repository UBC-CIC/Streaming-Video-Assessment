import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onLoginClick = () => {
    // TODO: Add login logic here
    console.log(email, password);
    navigate("/home");
  };

  const onCreateAccountClick = () => {
    navigate("/create-account");
  };

  const onForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="bg-white flex flex-col justify-center items-center">
      <div className="flex w-[350px] max-w-full flex-col items-stretch mt-72 mb-44 max-md:my-10">
        <div className="justify-center text-indigo-500 text-center text-6xl font-black tracking-[2.56px] max-md:text-4xl">
          DROPZONE
        </div>
        <input 
            className="input-field max-md:mr-2 max-md:pr-5" 
            name="email" 
            placeholder="Email" 
            onInput={e => setEmail(e.target.value)}
        />
        <input
            className="input-field max-md:mr-2 max-md:pr-5" 
            name="password"
            placeholder="Password"
            type="password"
            onInput={e => setPassword(e.target.value)}
        />
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button className="login-button max-md:px-5" onClick={onLoginClick}>
            LOGIN
          </button>
          <button className="create-account-button" onClick={onCreateAccountClick}>
            CREATE ACCOUNT
          </button>
        </div>
        <button className="forgot-password-button" onClick={onForgotPasswordClick}>
          FORGET PASSWORD
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
