import './App.css'
import {createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute'
import LoginPage from './pages/Login'
import CreateAccountPage from './pages/CreateAccount'
import ForgotPasswordPage from './pages/ForgetPassword';
import FolderView, { loader as FolderViewLoader } from './pages/FolderView'
import ErrorPage from './pages/Error'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
    errorElement: <ErrorPage />
  },
  {
    path: "/home",
    element: PrivateRoute(HomePage),
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
