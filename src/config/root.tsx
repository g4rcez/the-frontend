import { Router } from "~/lib/create-routes";
import React from "react";
import { Layout } from "~/components/layout";
import { client } from "~/config/client";
import { Narrow } from "ts-toolbelt/out/Function/Narrow";

const NotFoundRoute = () => <h2 className="text-6xl font-extrabold">Not Found</h2>;

export const router = Router.create(
  [
    { path: "/", name: "root", controller: () => import("../pages/root.view") },
    { path: "/posts", name: "posts", controller: () => import("../pages/posts/posts.view") },
    { path: "/posts/new", name: "posts", controller: () => import("../pages/posts/new-post.view") },
    { path: "/posts/:id", name: "posts", controller: () => import("../pages/posts/new-post.view") },
  ],
  {},
  Layout,
  NotFoundRoute
);
