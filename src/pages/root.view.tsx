import { Link } from "react-router-dom";
import { app } from "~/config/root";
import { Select } from "~/components/select/select";
import { createColumns, Table } from "~/components/table";
import { createSignal, useSignal } from "~/lib/create-signal";

const Btn = () => {
  const [c, setC] = useSignal(0);
  return <button onClick={() => setC((c) => c + 1)}>{c}</button>;
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

const [count, setCount] = createSignal(0);

type State = {
  id: string;
  amount: number;
  date: Date;
};

const cols = createColumns<State>((add) => {
  add("id", "ID", { Render: (props) => props.value, width: "50px", className: "bg-white text-black" });
  add("amount", "Amount");
  add("date", "Date", { Render: (props) => props.value.toISOString() });
});

const rows = Array.from({ length: 5000 }).map(
  (_, i): State => ({
    date: new Date(),
    id: (i + 1).toString().padStart(4, "0"),
    amount: Math.ceil(Math.random() * (i + 1) * 100),
  })
);

export default function RootView() {
  return (
    <div className="w-full">
      <div className="flex gap-x-8">
        <Select placeholder="Select a fruit" options={options} />
        <button onClick={() => setCount((c) => c + 1)}>{count}</button>
        <Btn />
        <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts")}>
          Posts
        </Link>
        <Link className="hover:text-blue-400 transition-colors duration-300 active:text-blue-400 underline" to={app.link("/posts/:id", { id: "1" })}>
          Post 1
        </Link>
      </div>
      <Table rows={rows} cols={cols} id="table" />
    </div>
  );
}
