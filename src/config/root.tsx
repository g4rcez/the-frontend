import { Router } from "~/config/create-routes";
import React from "react";
import { Layout } from "~/components/layout";

const NotFound = () => <div>Not Found</div>;

export const router = Router.create(
  Layout,
  NotFound,
  [
    {
      path: "/",
      name: "root",
      controller: () => import("../App") as any,
    },
  ],
  {}
);

export type LoaderProps = {};
