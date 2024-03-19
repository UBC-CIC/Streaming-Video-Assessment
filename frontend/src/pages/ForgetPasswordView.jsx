import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col justify-center items-center max-md:px-5 h-dvh">
      <div className="flex w-[346px] max-w-full flex-col items-stretch mt-72 mb-52 max-md:my-10">
        <div className="justify-center text-indigo-500 text-center text-4xl font-black tracking-widest">
          PASSWORD RESET
        </div>
        <input
          className="whitespace-nowra w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
        />
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button
            className="text-white text-center tracking-[0.52px] whitespace-nowrap bg-[#6a7dc2] self-center justify-center px-[13px] py-[27px] rounded-md border-2 border-solid border-[#6a7dc2] text-sm font-bold max-md:mt-10"
            onClick={onResetPasswordClick}>
            RESET PASSWORD
          </button>
          <button
            className="text-black tracking-[0.52px] whitespace-nowrap bg-[#c9c9c9] w-6/12 justify-center self-center px-5 py-[27px] rounded-md border-2 border-solid border-[#c9c9c9] text-sm font-bold max-md:mt-10"
            onClick={onBackToLoginClick}>
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordView;
