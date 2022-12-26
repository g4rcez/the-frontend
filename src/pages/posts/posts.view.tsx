import { Router } from "~/lib/create-routes";
import { Form, json } from "react-router-dom";
import { fetcher } from "~/config/client";
import { Post, PostsResponse } from "~/pages/posts/types";

const PostsView: Router.Component = () => {
  const data = Router.useLoader<PostsResponse>();

  return (
    <div className="p-4">
      <header>
        <h2>Posts</h2>
      </header>
      <Form method="get" className="my-4">
        <input name="title" className="bg-black text-white p-2 border rounded-lg" />
      </Form>
      <section>
        <p>Total of posts: {data.items.length}</p>
        <ul>
          {data.items.map((post) => (
            <li key={`${post.id}-posts`}>{post.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

PostsView.loader = async ({ request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? "";
  const qs = title === "" ? "" : `?title=${title}`;
  return json<PostsResponse>({ items: await fetcher<Post[]>(`http://localhost:5000/posts${qs}`) });
};

export default PostsView;
