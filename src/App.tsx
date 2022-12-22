import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { router } from "./router/routes";

type Props = {
  name: string;
};

function App(props: Props) {
  const [count, setCount] = useState(0);
  const params = router.useRouteParams("/users/:id");
  console.log(params);

  return (
    <div className="App">
      <h1>Vite + React + {props.name}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
