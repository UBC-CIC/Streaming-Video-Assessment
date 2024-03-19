import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Login.css";
import { handleSignIn, handleSignOut, checkUserSignInStatus, getJwtTokens } from "../helpers/authenticationHandler";
import {testAuth } from "../helpers/authApi.js"

function LoginView() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state &&location.state.email ? location.state.email : "");
  const [password, setPassword] = useState(location.state&& location.state.password ? location.state.password : "");
  const navigate = useNavigate();

  const onLoginClick = async () => {
    console.log("signing out");
    await handleSignOut();
    console.log("signing in");
    if (await checkUserSignInStatus()) {
      // navigate("/home");
      return;
    }
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
      alert("Invalid email or password");
      return;
    }
    if(nextStep.signInStep == "DONE"){
      const {accessToken, idToken} = await getJwtTokens();
      console.log("idToken: ", idToken);
      console.log("accessToken: ", accessToken);
      const res = await testAuth(idToken);
      console.log("res: ", res);
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
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-[350px] max-w-full flex-col items-stretch mt-72 mb-44 max-md:my-10">
        <div className="justify-center text-indigo-500 text-center text-6xl font-black tracking-[2.56px] max-md:text-4xl">
          DROPZONE
        </div>
        <input
          className="input-field max-md:mr-2 max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          className="input-field max-md:mr-2 max-md:pr-5"
          name="password"
          placeholder="Password"
          type="password"
          onInput={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button className="login-button max-md:px-5" onClick={onLoginClick}>
            LOGIN
          </button>
          <button
            className="create-account-button"
            onClick={onCreateAccountClick}
          >
            CREATE ACCOUNT
          </button>
        </div>
        <button
          className="forgot-password-button"
          onClick={onForgotPasswordClick}
        >
          FORGET PASSWORD
        </button>
      </div>
    </div>
  );
}

export default LoginView;
