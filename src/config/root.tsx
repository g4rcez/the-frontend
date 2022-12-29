import { App } from "~/lib/configure-app";
import React from "react";
import { Layout } from "~/components/layout";

const NotFoundRoute = () => <h2 className="text-6xl font-extrabold">Not Found</h2>;

export const app = App.create(
  [
    { path: "/", name: "root", controller: () => import("../pages/root.view") },
    { path: "/posts", name: "posts", controller: () => import("../pages/posts/posts.view") },
    { path: "/posts/new", name: "postsNew", controller: () => import("../pages/posts/new-post.view") },
    { path: "/posts/:id", name: "postsEdit", controller: () => import("../pages/posts/new-post.view") },
  ],
  {},
  Layout,
  NotFoundRoute
);
