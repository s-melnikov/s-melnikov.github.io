import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const RouterContext = createContext();

const getPath = () => window.location.hash.slice(1) || "/";

const Component = ({ children }) => {
  const [path, setPath] = useState(getPath());

  const handleHashChange = useCallback(() => {
    setPath(getPath());
  }, []);

  const contextValue = useMemo(() => ({ path }), [path]);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [handleHashChange]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
};

export default Component;
