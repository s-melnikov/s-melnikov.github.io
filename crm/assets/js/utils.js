define("utils", ["libs/database"], (database) => {
  const db = database("simplecrm");

  const getCurrentPath = () => location.hash.replace(/^#!|\/$/g, "") || "/";

  if (!localStorage.simplecrm) {
    fetch("assets/json/dump.json").then(resp => resp.text()).then(text => {
      if (db.restore(text)) {
        location.reload();
      }
    });
  }

  return {
    getCurrentPath,
    db
  };
});