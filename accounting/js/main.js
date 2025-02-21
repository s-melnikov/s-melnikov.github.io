import api from "./api/index.js";

console.log(await api.get("/users?limit=100&offset=50"));
console.log(await api.get("/users/123123123"));
console.log(await api.put("/users", { firstName: "John", lastName: "Doe" }));
console.log(await api.patch("/users/123123123", { lastName: "McNamara" }));
console.log(await api.delete("/users/123123123"));
