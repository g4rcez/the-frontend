import { Link } from "react-router-dom";
import { app } from "~/config/root";
import { signal } from "@preact/signals-react";
import { Select } from "~/components/select/select";

const count = signal(0);

const Btn = () => {
  return <button onClick={() => (count.value += 1)}>{count as any}</button>;
};

const options = [
  "Alfalfa Sprouts",
  "Apple",
  "Apricot",
  "Artichoke",
  "Asian Pear",
  "Asparagus",
  "Atemoya",
  "Avocado",
  "Bamboo Shoots",
  "Banana",
  "Bean Sprouts",
  "Beans",
].map((value) => ({ value }));

export default function RootView() {
  return (
    <div className="flex gap-x-8">
      <Select placeholder="Select a fruit" options={options} />
      <button onClick={() => (count.value += 1)}>{count as any}</button>
      <Btn />
      <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts")}>
        Posts
      </Link>
      <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts/:id", { id: "1" })}>
        Post 1
      </Link>
    </div>
  );
}
