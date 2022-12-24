import { Router } from "~/config/create-routes";
import React from "react";
import { Layout } from "~/components/layout";

const NotFound = () => <h2 className="text-6xl font-extrabold">Not Found</h2>;

export const router = Router.create(
  Layout,
  NotFound,
  [
    { path: "/", name: "root", controller: () => import("../pages/root.view") },
    { path: "/users/:id", name: "profile", controller: () => import("../pages/root.view") },
    { path: "/users/address/:id", name: "address", controller: () => import("../pages/root.view") },
  ],
  {}
);
