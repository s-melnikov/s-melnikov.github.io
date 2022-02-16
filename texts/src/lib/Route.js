import { useContext } from "react";

import { RouterContext } from "./Router";

const Route = ({ path, exact, component: Component }) => {
  const { path: currentPath } = useContext(RouterContext);

  const hasMatch = exact ? (path === currentPath) : currentPath.includes(path);

  return hasMatch && (<Component />);
};

export default Route;
