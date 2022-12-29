import { Link } from "react-router-dom";
import { app } from "~/config/root";

export default function RootView() {
  return (
    <div className="flex gap-x-8">
      <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts")}>
        Posts
      </Link>
      <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts/:id", { id: "1" })}>
        Post 1
      </Link>
    </div>
  );
}
