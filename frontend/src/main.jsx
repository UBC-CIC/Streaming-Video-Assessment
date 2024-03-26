import { Amplify } from "aws-amplify";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import amplifyconfig from "./amplifyconfiguration.json";
import "./index.css";
import ToastProvider from "./components/Toast/ToastProvider.jsx";

Amplify.configure(amplifyconfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
