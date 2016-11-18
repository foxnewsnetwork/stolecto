export class Server {
  map(routeMap) {
    routeMap(this);
    return this;
  }
  constructor() {
    this.handlers = {};
  }
  shutdown() {
    this.handlers = {};
  }
  register(uri, handler) {
    this.handlers[uri] = handler;
  }
  get(uri) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.handlers[uri]());
      }, 5);
    });
  }
}
