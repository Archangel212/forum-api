
class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThread = this.postThread.bind(this);
    this.addCommentToThread = this.addCommentToThread.bind(this);
    this.getThreadDetails = this.getThreadDetails.bind(this);
    this.deleteCommentInAThread = this.deleteCommentInAThread.bind(this);
  }

  async postThread(request, h) {
    await this._container.resolve('VerifyUserAuthorizationUseCase')
        .verifyThreadResourceAccess({...request.auth.credentials});

    const addedThread = await this._container.resolve('ThreadUseCases').addThread({...request.payload, owner: request.auth.credentials.id});
    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async addCommentToThread(request, h) {
    await this._container.resolve('VerifyUserAuthorizationUseCase').verifyThreadResourceAccess({...request.auth.credentials, threadId: request.params.threadId});

    const addedComment = await this._container.resolve('CommentUseCases').addCommentToThread({
      content: request.payload.content,
      date: new Date(),
      owner: request.auth.credentials.id,
      isDeleted: false,
      threadId: request.params.threadId,
    });

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(201);
  }

  async getThreadDetails(request, h) {
    const threadDetails = await this._container.resolve('ThreadUseCases').getThreadDetails(request.params);
    return {
      status: 'success',
      data: {
        thread: threadDetails,
      },
    };
  }

  async deleteCommentInAThread(request, h) {
    await this._container.resolve('VerifyUserAuthorizationUseCase').verifyThreadResourceAccess({...request.auth.credentials, threadId: request.params.threadId});
    await this._container.resolve('VerifyUserAuthorizationUseCase').verifyCommentResourceAccess({
      commentId: request.params.commentId,
      userId: request.auth.credentials.id,
    });
    await this._container.resolve('CommentUseCases').softDeleteComment(request.params);
    return {
      status: 'success',
      message: 'komentar berhasil di hapus',
    };
  }
}

module.exports = ThreadsHandler;
