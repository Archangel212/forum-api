
class ThreadUseCases {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async addThread(useCasePayload) {
    const {title, body, owner} = useCasePayload;
    return await this._threadRepository.addThread({title, body, owner});
  }

  async getThreadDetails(useCasePayload) {
    const {threadId} = useCasePayload;
    const threadDetails = await this._threadRepository.getThreadDetails(threadId);
    return threadDetails;
  }
}

module.exports = ThreadUseCases;
