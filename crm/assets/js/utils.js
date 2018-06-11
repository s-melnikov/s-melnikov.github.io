define("utils", ["libs/database"], (database) => {
  const db = database("simplecrm");

  const getCurrentPath = () => location.hash.replace(/^#!|\/$/g, "") || "/";

  window.mock = () => {
    const rand = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
    const randArrVal = array => array[rand(0, array.length - 1)];
    const statuses = ["new", "assigned", "converted", "in_process", "recycled", "closed"];
    const leadsRef = db.collection("leads");
    db.drop();
    fetch("assets/json/leads.json").then(resp => resp.json()).then(items => {
      let leads = db.collection("leads");
      items = items.map(item => {
        item.status = randArrVal(statuses);
        return item;
      });
      leads.pushMany(items, () => {
        console.log("Leads ready")
      });
    });
  }

  return {
    getCurrentPath,
    db
  };
});