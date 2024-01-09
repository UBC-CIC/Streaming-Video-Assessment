import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

function CreateAccountPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onCreateAccountClick = () => {
        // TODO: add account creation handling here
        console.log(name, email, password);
        navigate("/home");
    };

    const onBackToLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="bg-white flex flex-col justify-center items-center max-md:px-5">
            <div className="flex w-[344px] max-w-full flex-col items-stretch mt-52 mb-36 max-md:my-10">
                <div className="justify-center text-indigo-500 text-2xl font-black tracking-wider self-stretch">
                    CREATE ACCOUNT
                </div>
                <input 
                    className="input-field mt-9 max-md:pr-5"
                    name="name" 
                    placeholder="Name"
                    onInput={e => setName(e.target.value)}
                />
                <input 
                    className="input-field mt-9 max-md:pr-5"
                    name="email" 
                    placeholder="Email"
                    onInput={e => setEmail(e.target.value)}
                />
                <input 
                    className="input-field mt-9 max-md:pr-5"
                    name="password" 
                    placeholder="Password"
                    type="password"
                    onInput={e => setPassword(e.target.value)}
                />
                <input 
                    className="input-field mt-9 max-md:pr-5"
                    name="confirm-password" 
                    placeholder="Confirm Password" 
                    type="password"
                    onInput={e => {
                        //TODO: Add confirm password logic here
                    }}
                />
                <div className="flex items-stretch justify-between gap-5 mt-12 max-md:mt-10">
                    <button className="create-button" onClick={onCreateAccountClick}>
                        CREATE ACCOUNT
                    </button>
                    <button className="back-to-login-button" onClick={onBackToLoginClick}>
                        BACK TO LOGIN
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPage;
