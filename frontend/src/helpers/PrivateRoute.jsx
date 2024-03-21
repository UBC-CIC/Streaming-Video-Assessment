import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getJwtTokens, isUserSignedIn } from "./authenticationHandler";
import { setAuthHeader } from "./authApi";

const PrivateRoute = ({ children, props, ...rest }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    (async () => {
      const signedIn = await isUserSignedIn();
      setIsLoggedIn(signedIn);

      if (signedIn) {
        const tokens = await getJwtTokens();
        setAuthHeader(tokens.idToken);
      }
      setIsReady(true);
    })();
  }, []);
  if (!isReady) {
    return <div></div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
