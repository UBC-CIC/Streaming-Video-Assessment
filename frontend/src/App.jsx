import './App.css'
import {createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute'
import LoginPage from './pages/Login'
import CreateAccountPage from './pages/CreateAccount'
import ForgotPasswordPage from './pages/ForgetPassword';
import HomePage from './pages/Home'
import ErrorPage from './pages/Error'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: PrivateRoute(HomePage),
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/create-account",
    element: <CreateAccountPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
