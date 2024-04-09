import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  handleSignIn,
  handleSignOut,
  checkUserSignInStatus,
  getJwtTokens,
  isUserSignedIn,
} from "../helpers/authenticationHandler";
import { testAuth } from "../helpers/authApi.js";
import { useToast } from "../components/Toast/ToastService";

function LoginView() {
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state && location.state.email ? location.state.email : "",
  );
  const [password, setPassword] = useState(
    location.state && location.state.password ? location.state.password : "",
  );

  const [isTryingLogin, setIsTryingLogin] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      // If a user is already logged in, redirect to home
      if (await isUserSignedIn()) {
        navigate("/home");
      }
    })();
  });

  const onLoginClick = async () => {
    // console.log("signing in");
    if (await isUserSignedIn()) {
      return navigate("/home");
    }
    try {
      setIsTryingLogin(true);
      const { isSignedIn, nextStep } = await handleSignIn({email, password,});
      if (nextStep.signInStep == "CONFIRM_SIGN_UP") {
        navigate("/confirm-sign-up", { state: { email: email } });
      }
      if (nextStep.signInStep == "CREATE_ACCOUNT") {
        toast.error(
          "There is no user associated with that email. Please create an account.",
        );
        setIsTryingLogin(false);
        return;
      } else if (!isSignedIn) {
        toast.error("Invalid email or password");
        setIsTryingLogin(false);
        return;
      }
      if (nextStep.signInStep == "DONE") {
        const { idToken: idToken } = await getJwtTokens();
        try {
          const res = await testAuth(idToken);
          navigate("/home");
        } catch (err) {
          console.log(err);
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.log(err);
    }
    setIsTryingLogin(false);
  };
  const onCreateAccountClick = () => {
    handleSignOut();
    navigate("/create-account", {
      state: { email: email, password: password },
    });
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
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="whitespace-nowrap w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
            name="email"
            placeholder="Email"
            onInput={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            className="whitespace-nowrap w-full justify-center pl-[17px] pr-[60px] py-[21px] border-2 border-solid border-black align-items: start font: 400 15px Roboto, sans-serif mt-9 max-md:pr-5"
            name="password"
            placeholder="Password"
            type="password"
            onInput={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
            <button
              className="disabled:bg-indigo-200 text-white tracking-[0.52px] whitespace-nowrap bg-indigo-500 w-6/12 justify-center px-[46px] py-[22px] rounded-md max-md:px-5 text-sm font-bold"
              onClick={onLoginClick}
              disabled={isTryingLogin}
            >
              {isTryingLogin ? <span className="loading loading-spinner loading-sm"></span>: "Sign In"}
            </button>
            <button
              className="text-black tracking-[0.52px] whitespace-nowrap bg-[#c9c9c9] text-center justify-center px-5 py-2.5 rounded-md border-2 border-solid border-[#c9c9c9] text-sm font-bold"
              onClick={onCreateAccountClick}
            >
              Create Account
            </button>
          </div>
          <button
            className="text-black text-center tracking-[0.52px] bg-[#c9c9c9] justify-center mt-[10%] mx-[20%] p-5 rounded-md border-2 border-solid border-[#c9c9c9] text-sm font-bold"
            onClick={onForgotPasswordClick}
          >
            Forgot Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginView;
