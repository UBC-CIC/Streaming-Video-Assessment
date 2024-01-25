import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPasswordClick = () => {
    console.log(email);
    // TODO: show banner/dialog and go back to login page
    navigate("/login");
  };

  const onBackToLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center max-md:px-5">
      <div className="flex w-[346px] max-w-full flex-col items-stretch mt-72 mb-52 max-md:my-10">
        <div className="justify-center text-indigo-500 text-center text-4xl font-black tracking-widest">
          PASSWORD RESET
        </div>
        <input
          className="input-field max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
        />
        <button
          className="forgot-button max-md:mt-10"
          onClick={onResetPasswordClick}
        >
          RESET PASSWORD
        </button>
        <button
          className="back-to-login-button mt-14 max-md:mt-10"
          onClick={onBackToLoginClick}
        >
          BACK TO LOGIN
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordView;
