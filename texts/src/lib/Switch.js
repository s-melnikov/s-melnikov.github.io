import { useContext } from "react";

import { RouterContext } from "./Router";

const Switch = ({ children }) => {
  const { path: currentPath } = useContext(RouterContext);

  return children.find(({ props: { path } }) => currentPath.includes(path)) || null;
};

export default Switch;
