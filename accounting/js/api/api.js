const METHODS = ["GET","POST","PUT","PATCH","DELETE"];

class Router {
  constructor() {
    this.routes = {};

    METHODS.forEach((method) => {
      this.routes[method] = [];
      this[method.toLowerCase()] = (path, cb) => {
        this.addRoute(method, path, cb);
        return this;
      }
    });
  }
  addRoute(method, path, cb) {
    this.routes[method].push({
      path: new RegExp(path), 
      cb
    });
  }
};

export default class Api {
  constructor(getRoutes) {
    this.routes = {};

    METHODS.forEach((method) => {
      this[method.toLowerCase()] = (path, payload) => {
        return this.resolve(method, path, payload);
      }
    });

    this.router = new Router();

    getRoutes(this.router);
  }
  resolve(method, path, payload) {
    return null;
  }
};
