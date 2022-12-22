import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router/create-routes";

const router = Router.create([
  { path: "/", name: "root", element: <App name="root" /> },
  { path: "/path", name: "path", element: <App name="path" /> },
  { path: "/users/:id", name: "users", element: <App name="users" /> },
]);

router.link({ path: "/users/:id", params: { id: "dsadas" } });
router.link({ path: "/path" });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router.config} />
  </React.StrictMode>
);
