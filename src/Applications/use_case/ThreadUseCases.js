const Thread = require('../../Domains/threads/entities/Thread');

class ThreadUseCases {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async addThread(useCasePayload) {
    const thread = new Thread(useCasePayload);
    return await this._threadRepository.addThread(thread);
  }

  async getThreadDetails(useCasePayload) {
    this._validateGetThreadDetailsPayload(useCasePayload);
    const {threadId} = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._threadRepository.getThreadComments(threadId);

    const threadDetails = {
      ...thread,
      comments: threadComments.map((comment)=>{
        if (comment.is_deleted) {
          comment.content = '**komentar telah dihapus**';
        }
        delete comment.is_deleted;
        return comment;
      }),
    };

    return threadDetails;
  }

  _validateGetThreadDetailsPayload(payload) {
    const {threadId} = payload;
    if (!threadId) {
      throw new Error('THREAD_USECASES.NOT_CONTAIN_NEEDED_PAYLOAD');
    }

    if (typeof threadId != 'string') {
      throw new Error('THREAD_USECASES.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}


module.exports = ThreadUseCases;
