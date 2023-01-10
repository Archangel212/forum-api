
class AddThreadUseCase {
  constructor({userRepository, authenticationRepository, threadRepository}) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {

  }
}

module.exports = AddThreadUseCase;
