
class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThread(request, h) {
    const {title,body} = request.payload;
  }
}

module.exports = ThreadsHandler;
