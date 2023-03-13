import { App } from "~/lib/configure-app";
import { Form, json } from "react-router-dom";
import { fetcher } from "~/config/client";
import { Post, PostsResponse } from "~/pages/posts/types";
import { Fragment, useEffect } from "react";
import { useFormState } from "~/lib/use-form-state";
import { Urls } from "~/lib/urls";

const PostsView: App.Component = () => {
  const { ref, loading, state } = useFormState<PostsResponse>();

  useEffect(() => {
    if (ref.current === null) return;
    const input = ref.current.querySelector("input");
    if (input) input.focus();
  }, [state]);

  return (
    <Fragment>
      <header>
        <h2>Posts</h2>
      </header>
      <Form ref={ref} method="get" className="my-4">
        <input disabled={loading} autoFocus aria-disabled={loading} name="title" className="bg-black text-white p-2 border rounded-lg" />
      </Form>
      <section>
        <p>Total of posts: {state.items.length}</p>
        <ul>
          {state.items.map((post) => (
            <li key={`${post.id}-posts`}>{post.title}</li>
          ))}
        </ul>
      </section>
    </Fragment>
  );
};

PostsView.loader = async ({ request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || undefined;
  const q = { title };
  const requestUrl = Urls.new("http://localhost:5000/posts", q);
  return json<PostsResponse>({ items: await fetcher<Post[]>(requestUrl) });
};

export default PostsView;
