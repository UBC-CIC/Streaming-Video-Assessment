import { Navigate } from "react-router-dom";

function PrivateRoute(Component) {
  // TODO: check if user is authenticated using AWS amplify and incognito
  const auth = true;
  return auth ? Component : <Navigate to="/login" />;
}

export default PrivateRoute;
