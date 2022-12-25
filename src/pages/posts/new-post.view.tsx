import { Router } from "~/config/create-routes";
import { Form, json, useRouteError } from "react-router-dom";
import { fetcher } from "~/config/client";
import { Post } from "~/pages/posts/types";
import { Is } from "~/lib/is";
import { ErrorComponent, NotFoundError, RouteError } from "~/lib/route-errors";
import { router } from "~/config/root";
import { formDataToJson } from "~/lib/form";

const PostsView: Router.Component<{}, "/posts/:id"> = () => {
  const data = Router.useLoader<Post>();

  return (
    <div className="p-4">
      <header>
        <h2 className="text-4xl font-extrabold capitalize">{data.title}</h2>
      </header>
      <Form method="post" className="my-4 gap-8 grid grid-cols-4 items-center">
        <input name="id" defaultValue={data.id} className="hidden" />
        <input name="title" placeholder="Title" defaultValue={data.title} className="bg-black text-white p-2 border rounded-lg" />
        <input name="author" placeholder="Author" defaultValue={data.author} className="bg-black text-white p-2 border rounded-lg" />
        <button className="w-fit bg-blue-700 rounded font-medium px-4 py-2 min-w-[10rem]" type="submit">
          Save
        </button>
      </Form>
    </div>
  );
};

PostsView.loader = async ({ request, params }) => {
  const result = await fetcher<Post>(`http://localhost:5000/posts/${params.id}`);
  if (Is.empty(result)) {
    throw new NotFoundError(request, params.id ?? "");
  }
  return json<Post>(result);
};

PostsView.action = router.actions({
  post: async ({ request, params }) => {
    try {
      const id = params.id;
      const json = await formDataToJson<Post>(request);
      await fetcher<Post>(`http://localhost:5000/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "put",
        body: JSON.stringify(json),
      });
      return router.redirect("/posts/:id", { params: { id } });
    } catch (e) {
      console.error(e);
    }
  },
});

const Errors = {
  NotFound: (props: { error: NotFoundError }) => (
    <section className="flex w-full items-center justify-center">
      <p>Not found {props.error.resource} :/</p>
    </section>
  ),
};

PostsView.error = () => {
  const error = useRouteError() as RouteError;
  if (Is.keyof(error.name, Errors)) {
    const Component = Errors[error.name] as ErrorComponent;
    return <Component error={error} />;
  }
  return (
    <div>
      <h2>An Error ocurr</h2>
    </div>
  );
};

export default PostsView;