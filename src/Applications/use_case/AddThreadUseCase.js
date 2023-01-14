
class AddThreadUseCase {
  constructor({userRepository, threadRepository}) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {title, body} = useCasePayload;

    await this._threadRepository.addThread({id, title, body, owner, comments});
  }
}

module.exports = AddThreadUseCase;
