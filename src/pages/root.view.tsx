import { Router } from "~/lib/create-routes";
import { Form, json, useLoaderData, useLocation } from "react-router-dom";
import { Country } from "~/domain/country";
import { fetcher } from "~/config/client";
import { InputState } from "~/components/state";
import { router } from "~/config/root";
import { Is } from "~/lib/is";

type State = { items: Country[] };

const RootView: Router.Component = () => {
  const data = useLoaderData() as State;
  const href = useLocation();

  return (
    <div className="App">
      size: {data.items.length}
      <Form method="post" className="my-8 grid grid-cols-5 gap-8 w-full container" name="form" id="form" defaultValue={JSON.stringify(data)}>
        <input type="number" className="bg-black text-white border p-2 rounded" defaultValue={1} name="number" />
        <input type="number" className="bg-black text-white border p-2 rounded" defaultValue={2} name="number" />
        <input className="bg-black text-white border p-2 rounded" defaultValue={href.pathname} name="path" />
        <input className="bg-black text-white border p-2 rounded" defaultValue={`${Math.random().toString(36).substring(2, 8)}`} name="name" />
        <InputState state={data} name="state" form="form" />
        <button type="submit" className="px-4 py-2 bg-blue-600 rounded-lg">
          Submit
        </button>
      </Form>
      {data.items.map((x) => (
        <div className="my-2" key={x.name.official}>
          <h2 className="text-2xl font-bold">{x.name.official}</h2>
          <p>{JSON.stringify(x.currencies, null, 4)}</p>
        </div>
      ))}
    </div>
  );
};

RootView.loader = async ({ request, params }) => {
  const url = new URL(request.url);
  const search = Object.fromEntries([...url.searchParams.entries()]);
  if (Is.empty(search)) {
    return json({ items: [] });
  }
  console.log(search);
  const items = await fetcher<Country[]>("https://restcountries.com/v3.1/all");
  const int = Math.ceil(Math.random() * 50);
  return json({ items: items.slice(0, int).sort((a, b) => a.name.official.localeCompare(b.name.official)) });
};

RootView.action = async ({ request }) => {
  const form = await request.formData();
  const data = Object.assign({ countries: JSON.parse(form.get("state")?.toString() ?? "") }, Object.fromEntries(form));
  return router.redirect("/", {
    qs: { index: data.index.toString() },
  });
};

export default RootView;
