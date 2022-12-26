import { Link } from "react-router-dom";
import { app } from "~/config/root";

export default function RootView() {
  return (
    <div className="App">
      <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts")}>
        Posts
      </Link>
    </div>
  );
}
