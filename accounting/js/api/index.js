import DB from "./db.js";
import Api from "./api.js";

const db = new DB("kitchen", { key: "c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a" });

export default new Api((router) => {
  router
    .get("/users", ({ query }) => {
      return "users list, query: " + JSON.stringify(query);
    })
    .get("/users/:userId", ({ params: { userId } }) => {
      return "user data by id: " + userId;
    })
    .put("/users", ({ request: { body } }) => {
      return "user created, data: " + JSON.stringify(body);
    })
    .patch("/users/:userId", ({ params: { userId }, request: { body } }) => {
      return "user updated, id: " + userId + " data: " + JSON.stringify(body);
    })
    .delete("/users/:userId", ({ params: { userId } }) => {
      return "user deleted, id: " + userId;
    });
});
