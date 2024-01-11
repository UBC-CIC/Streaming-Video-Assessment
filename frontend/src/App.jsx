import './App.css'
import {createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import PrivateRoute from './helpers/PrivateRoute'
import LoginView from './pages/LoginView'
import CreateAccountView from './pages/CreateAccountView'
import ForgetPasswordView from './pages/ForgetPasswordView';
import FolderView, { loader as FolderViewLoader } from './pages/FolderView'
import SubmitView, { loader as SubmitViewLoader } from './pages/SubmitView'
import ErrorPage from './pages/ErrorPage'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: PrivateRoute(<FolderView home={true} />),
  },
  {
    path: "/folder/:folderId",
    element: PrivateRoute(<FolderView />),
    loader: FolderViewLoader,
  },
  {
    path: "/submit/:assessmentId",
    element: <SubmitView />,
    loader: SubmitViewLoader,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/create-account",
    element: <CreateAccountView />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPasswordView />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
