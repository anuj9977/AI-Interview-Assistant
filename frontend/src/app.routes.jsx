import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/interview.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        index: true,
        element: <Protected><Home /></Protected>
      },
      {
        path: "interview/:interviewId",
        element: <Protected><Interview /></Protected>
      }
    ]
  }
]);
