import React from "react";
import ReactDOM from "react-dom/client";
import "~/index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "~/config/root";

requestIdleCallback(() => {
  React.startTransition(() => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router.config} />
        </React.Suspense>
      </React.StrictMode>
    );
  });
});
