import React from "react";
import ReactDOM from "react-dom/client";
import "~/index.css";
import { RouterProvider } from "react-router-dom";
import { app } from "~/config/root";

requestIdleCallback(() => {
  React.startTransition(() => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={app.config} />
        </React.Suspense>
      </React.StrictMode>
    );
  });
});
