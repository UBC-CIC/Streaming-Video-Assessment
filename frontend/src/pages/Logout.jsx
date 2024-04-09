import React, { useEffect } from "react";
import { handleSignOut } from "../helpers/authenticationHandler";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("folderViewMode");
    localStorage.removeItem("folderSortType");
    (async () => {
      await handleSignOut();
      navigate("/login");
    })();
  });

  return <div>Logging out...</div>;
};

export default Logout;
