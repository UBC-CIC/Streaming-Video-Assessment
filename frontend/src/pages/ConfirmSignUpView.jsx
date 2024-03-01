import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Login.css";
import { handleConfirmSignUp } from "../helpers/authenticationHandler";

function ConfirmSignUpView() {
  const location = useLocation();
  const email = location.state.email;
  const [confirmationCode, setConfirmationCode] = useState("");
  const navigate = useNavigate();

  const onConfirmSignUpClick = async () => {
    const { isSignUpComplete, nextStep } = await handleConfirmSignUp({ email, confirmationCode });
    console.log(nextStep);

    if (isSignUpComplete) {
      navigate("/home");
    }
  }
  const onBackToLoginClick = () => {
    navigate("/login", { state: { email: email } });
  };
  return (
    <div className="flex flex-col justify-center items-center max-md:px-5">
      <div className="flex w-[344px] max-w-full flex-col items-stretch mt-52 mb-36 max-md:my-10">
        <div className="justify-center text-center text-indigo-500 text-2xl font-black tracking-wider self-stretch">
          CONFIRM ACCOUNT
        </div>
        We have sent an email to {email} with a confirmation code. Please enter the code to confirm your account. Make sure to check your spam folder.
        <input
          className="input-field mt-9 max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-field mt-9 max-md:pr-5"
          name="confirmationCode"
          placeholder="Confirmation Code"
          onInput={(e) => setConfirmationCode(e.target.value)}
        />
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button className="create-button" onClick={onConfirmSignUpClick}>
            CONFIRM
          </button>
          <button className="back-to-login-button" onClick={onBackToLoginClick}>
            BACK TO LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUpView;