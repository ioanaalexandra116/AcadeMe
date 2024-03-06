import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import PrivateRoute from "./route/PrivateRoute";
import Test from "./pages/Test";
import Login from "./pages/Login";

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
            element: <Test />,
            // element: <h1>Unicode Character</h1>
            //     <body>
            //         <div>
            //             {/* <h1>AcadeMe</h1>
            // <h1>Unicode Character</h1>
            // <h3>(U+1F436)</h3>
            // <h3>Dog Face</h3>
            // <h3>&#128054;</h3> */}
            //             <Register />
            //         </div>
            //     </body>
          },
        ],
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
