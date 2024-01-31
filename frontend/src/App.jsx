import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./helpers/PrivateRoute";
import LoginView from "./pages/LoginView";
import CreateAccountView from "./pages/CreateAccountView";
import ForgetPasswordView from "./pages/ForgetPasswordView";
import FolderView from "./pages/FolderView";
import SubmitView, { loader as SubmitViewLoader } from "./pages/SubmitView";
import ViewAllSubmissions from "./pages/ViewAllSubmissions";
import CreateAndEditSubmission from "./pages/CreateAndEditSubmission";
import ErrorPage from "./pages/ErrorPage";
import ViewSubmission from "./pages/ViewSubmission";

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
    loader: FolderView.loader,
  },
  {
    path: "/submission",
    element: PrivateRoute(<CreateAndEditSubmission />),
  },
  {
    path: "/submission/:submissionId/edit",
    element: PrivateRoute(<CreateAndEditSubmission edit={true} />),
  },
  {
    path: "/submission/:submissionId",
    element: PrivateRoute(<ViewAllSubmissions />),
    loader: ViewAllSubmissions.loader,
  },
  {
    path: "/submission/:submissionId/view",
    element: PrivateRoute(<ViewSubmission />),
  },
  {
    path: "/submit/:submissionId",
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

export default App;
