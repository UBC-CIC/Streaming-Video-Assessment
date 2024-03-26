import ToastContext from "./ToastService";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const error = (message) => {
    const id = Date.now();

    const component = (
      <div role="alert" className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
        <div className="flex items-center">
          <button className="btn btn-sm" onClick={() => close(id)}>
            <IoMdClose />
          </button>
        </div>
      </div>
    );

    open(id, component);
  };

  const success = (message) => {
    const id = Date.now();

    const component = (
      <div role="alert" className="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
        <button
          className="btn btn-sm bg-transparent border-0"
          onClick={() => close(id)}
        >
          <IoMdClose size={16} />
        </button>
      </div>
    );

    open(id, component);
  };

  const open = (id, component, timeout = 5000) => {
    setToasts((toasts) => [...toasts, { id, component }]);

    setTimeout(() => close(id), timeout);
  };

  const close = (id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ error, success, open, close }}>
      {children}
      <div className="space-y-2 absolute bottom-4 right-4">
        {toasts.map(({ id, component }) => (
          <div key={id} className="relative">
            {component}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
