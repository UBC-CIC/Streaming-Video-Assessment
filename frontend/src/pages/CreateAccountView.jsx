import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Login.css";
import { handleSignUp } from "../helpers/authenticationHandler";

function CreateAccountView() {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(location.state.email ? location.state.email : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const onCreateAccountClick = async () => {
    // TODO: do smth associate name with aurora
    const { isSignUpComplete, userId, nextStep } = await handleSignUp({ email, password: password });


    if (nextStep.signUpStep == "CONFIRM_SIGN_UP") {
      navigate('/confirm-sign-up', { state: { email: email } })
    }
    if (isSignUpComplete) {
      navigate("/home");
    }

  };

  const onBackToLoginClick = () => {
    navigate("/login", { state: { email: email, password: password } });
  };

  const passwordsMatch = password === confirmPassword;
  const passwordRules = password.length > 5;
  const passwordExists = password.length > 0;

  return (
    <div className="flex flex-col justify-center items-center max-md:px-5"
    style={{
      height: "90vh",
      // marginTop: "10%"
    }}>
      <div className="flex w-[344px] max-w-full flex-col items-stretch mt-52 mb-36 max-md:my-10">
        <div className="justify-center text-center text-indigo-500 text-2xl font-black tracking-wider self-stretch">
          CREATE ACCOUNT
        </div>
        <input
          className="input-field mt-9 max-md:pr-5"
          name="name"
          placeholder="Name"
          onInput={(e) => setName(e.target.value)}
        />
        <input
          className="input-field mt-9 max-md:pr-5"
          name="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          className="input-field mt-9 max-md:pr-5"
          style={{border:"2px solid #000", padding: "17.5px 60px 17.5px 17px"}}
          name="password"
          placeholder="Password"
          type="password"
          onInput={(e) => setPassword(e.target.value)}
        />
        <input
          className="input-field mt-9 max-md:pr-5"
          style={{border:"2px solid #000", padding: "17.5px 60px 17.5px 17px"}}
          name="confirm-password"
          placeholder="Confirm Password"
          type="password"
          onInput={(e) => setConfirmPassword(e.target.value)}
        />
        {passwordRules == false && passwordExists && 
        <div className="justify-center text-center text-red-500 tracking-wider self-stretch"
        style={{padding: "20px 0px 0px 0px"}}>Password must be 6 characters or longer</div>}
        <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
          <button className={passwordsMatch && passwordRules ? "create-button" : "create-button-disabled"} onClick={onCreateAccountClick} disabled={!passwordsMatch}>
            CREATE ACCOUNT
          </button>
          <button className="back-to-login-button" onClick={onBackToLoginClick}>
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountView;
