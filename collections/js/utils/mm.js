const { define, require } = (() => {
  const functions = {};
  const modules = {};
  const lock = {};
  const define = (name, callback) => {
    functions[name] = callback;
  }
  const require = name => {
    if (modules[name]) return modules[name];
    if (lock[name]) throw `Recursive requirement: "${name}"`;
    if (!functions[name]) throw `Unknown module: "${name}"`;
    lock[name] = true;
    try {
      modules[name] = functions[name](require);
    } catch(e) {
      console.error(e);
      throw `Error evalutate: "${name}"`;
    }
    delete lock[name];
    return modules[name];
  }
  return { define, require }
}) ();
