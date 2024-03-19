import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    <div className="flex flex-col justify-center items-center max-md:px-5 h-dvh">
      <div className="flex w-[344px] max-w-full flex-col items-stretch mt-52 mb-36 max-md:my-10">
        <div className="justify-center text-center text-indigo-500 text-2xl font-black tracking-wider self-stretch">
          CONFIRM ACCOUNT
        </div>
        We have sent an email to {email} with a confirmation code. Please enter the code to confirm your account. Make sure to check your spam folder.
        <input
          className="whitespace-nowrap w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
        />
        <input
          className="whitespace-nowrap w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
          name="confirmationCode"
          placeholder="Confirmation Code"
          onInput={(e) => setConfirmationCode(e.target.value)}
        />
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button className="text-white text-center tracking-[0.52px] whitespace-nowrap bg-[#6a7dc2] justify-center px-[40px] py-[27px] rounded-md border-2 border-solid border-[#6a7dc2] text-sm font-bold" onClick={onConfirmSignUpClick}>
            CONFIRM
          </button>
          <button className="text-black tracking-[0.52px] whitespace-nowrap bg-[#c9c9c9] w-6/12 justify-center self-center px-5 py-[27px] rounded-md border-2 border-solid border-[#c9c9c9] text-sm font-bold" onClick={onBackToLoginClick}>
            BACK TO LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUpView;