import { Router } from "./create-routes";
import App from "../App";
import React from "react";

export const router = Router.create([
  { path: "/", name: "root", element: <App name="root" /> },
  { path: "/path", name: "path", element: <App name="path" /> },
  { path: "/users/:id", name: "users", element: <App name="users" /> },
]);
