import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./route/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import EditPost from "./pages/EditPost";
import Play from "./pages/Play";
import Results from "./pages/Results";
import EditProfile from "./pages/EditProfile";
import SearchFlashcardSets from "./pages/SearchFlashcardSets";
import Notifications from "./pages/Notifications";
import Follow from "./pages/Follow";

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
          },
          {
            path: "/edit-profile",
            element: <EditProfile />,
          },
          {
            path: "/search/flashcards",
            element: <SearchFlashcardSets />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/followers",
            element: <Follow />,
          },
          {
            path: "/following",
            element: <Follow />,
          },
        ],
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
