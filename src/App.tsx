import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./route/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditAvatar from "./pages/EditAvatar";
import Create from "./pages/Create";
import EditPost from "./pages/EditPost";
import Play from "./pages/Play";
import Results from "./pages/Results";

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/Login",
        element: <Login />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/edit-avatar",
            element: <EditAvatar/>,
          },
          {
            path: "/create",
            element: <Create />,
          },
          {
            path: "/edit-post",
            element: <EditPost />,
          },
          {
            path: "/play",
            element: <Play />,
          },
          {
            path: "/play/results",
            element: <Results />,
          }
        ],
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
