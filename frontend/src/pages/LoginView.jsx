import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleSignIn, handleSignOut, checkUserSignInStatus } from "../helpers/authenticationHandler";

function LoginView() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state &&location.state.email ? location.state.email : "");
  const [password, setPassword] = useState(location.state&& location.state.password ? location.state.password : "");
  const navigate = useNavigate();
  const [authenticating, isAuthenticating] = useState(false);

  const onLoginClick = async () => {
    // TODO: Add login logic here
    isAuthenticating(true);
    console.log("signing in");
    if (await checkUserSignInStatus()) {
      navigate("/home");
      return;
    }
    // console.log(email, password);
    const { isSignedIn, nextStep } = await handleSignIn({
      email: email, password: password
    });
    if (nextStep.signInStep == "CONFIRM_SIGN_UP") {
      navigate("/confirm-sign-up", {state:{email: email}});
    }
    if(nextStep.signInStep == "CREATE_ACCOUNT"){
      alert("There is no user associated with that email. Please create an account.");
      return;
    }
    else if (!isSignedIn) {
      isAuthenticating(false);
      alert("Invalid email or password");
      return;
    }
    if(nextStep.signInStep == "DONE"){
      navigate("/home");
    } else{
      alert("Invalid email or password");
    }

  };
  const onCreateAccountClick = () => {
    handleSignOut();
    navigate("/create-account", {state:{email:email, password:password}});
  };

  const onForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <div className="flex w-[350px] max-w-full flex-col items-stretch mt-25 max-md:my-10">
        <div className="justify-center text-indigo-500 text-center text-6xl font-black tracking-[2.56px] max-md:text-4xl">
          DROPZONE
        </div>
        <input
          className="whitespace-nowra w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          className="whitespace-nowra w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
          
          name="password"
          placeholder="Password"
          type="password"
          onInput={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button className="text-white tracking-[0.52px] whitespace-nowrap bg-[#6a7dc2] w-6/12 justify-center px-[46px] py-[22px] rounded-md border-2 border-solid border-[#6a7dc2] max-md:px-5 text-sm font-bold" onClick={onLoginClick}>
            LOGIN
          </button>
          <button
            className="text-black tracking-[0.52px] whitespace-nowrap bg-[#c9c9c9] text-center justify-center px-5 py-2.5 rounded-md border-2 border-solid border-[#c9c9c9] text-sm font-bold"
            onClick={onCreateAccountClick}>
            CREATE ACCOUNT
          </button>
        </div>
        <button
          className="text-black text-center tracking-[0.52px] bg-[#c9c9c9] justify-center mt-[10%] mx-[20%] p-5 rounded-md border-2 border-solid border-[#c9c9c9] text-sm font-bold"
          onClick={onForgotPasswordClick}>
          FORGET PASSWORD
        </button>
      </div>
    </div>
  );
}

export default LoginView;
