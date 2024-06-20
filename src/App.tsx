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
import SearchUserPage from "./pages/SearchUserPage";
import Leaderboard from "./pages/Leaderboard";
import VerifyPage from "./pages/VerifyPage";
import Navbar from "./components/Navbar";

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
        path: "/play",
        element: <Play />,
      },
      {
        path: "/play/results",
        element: <Results />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search/flashcards",
        element: <SearchFlashcardSets />,
      },

      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/profile",
            element: (
              <>
                <Navbar />
                <Profile />
              </>
            ),
          },
          {
            path: "/create",
            element: (
              <>
                <Navbar />
                <Create />
              </>
            ),
          },
          {
            path: "/edit-post",
            element: (
              <>
                <Navbar />
                <EditPost />
              </>
            ),
          },
          {
            path: "/view-post",
            element: (
              <>
                <Navbar />
                <EditPost />
              </>
            ),
          },
          {
            path: "/edit-profile",
            element: (
              <>
                <Navbar />
                <EditProfile />
              </>
            ),
          },
          {
            path: "/followers",
            element: (
              <>
                <Navbar />
                <Follow />
              </>
            ),
          },
          {
            path: "/following",
            element: (
              <>
                <Navbar />
                <Follow />
              </>
            ),
          },
          {
            path: "/search/people",
            element: (
              <>
                <Navbar />
                <SearchUserPage />
              </>
            ),
          },
          {
            path: "/leaderboard",
            element: (
              <>
                <Navbar />
                <Leaderboard />
              </>
            ),
          },
          {
            path: "/verify",
            element: (
              <>
                <Navbar />
                <VerifyPage />
              </>
            ),
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
        ],
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
