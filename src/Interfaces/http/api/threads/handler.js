
class ThreadsHandler {
  constructor(container) {
    this._container = container;
  }

  async postThread(request, h) {
    await this._container.UserAuthorizationUseCase.execute(request.auth.credentials);
    await this._container.ThreadUseCases.addThread(request.payload);
  }
}

module.exports = ThreadsHandler;
