import { LoaderProps } from "~/config/root";
import { Router } from "./config/create-routes";
import { defer, useLoaderData } from "react-router-dom";
import { Country } from "~/domain/country";
import { fetcher } from "~/config/client";

const App: Router.RouteController<{}, LoaderProps> = (props) => {
  const data = (useLoaderData() as Country[]) ?? [];

  return (
    <div className="App">
      {data.map((x) => (
        <div className="my-8">{JSON.stringify(x, null, 2)}</div>
      ))}
    </div>
  );
};

App.loader = async (_) => {
  return defer({ items: fetcher("https://restcountries.com/v3.1/all") });
};

export default App;
