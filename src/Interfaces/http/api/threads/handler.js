
class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThread = this.postThread.bind(this);
    this.addCommentToThread = this.addCommentToThread.bind(this);
    this.getThreadDetails = this.getThreadDetails.bind(this);
    this.deleteCommentInAThread = this.deleteCommentInAThread.bind(this);
  }

  async postThread(request, h) {
    const addedThread = await this._container.resolve('ThreadUseCases').addThread({
      ...request.payload, ownerUsername: request.auth.credentials.username, owner: request.auth.credentials.id});

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async addCommentToThread(request, h) {
    const addedComment = await this._container.resolve('CommentUseCases').addCommentToThread({
      content: request.payload.content,
      date: new Date(),
      ownerUsername: request.auth.credentials.username,
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

  async getThreadDetails(request) {
    const threadDetails = await this._container.resolve('ThreadUseCases').getThreadDetails(request.params);
    return {
      status: 'success',
      data: {
        thread: threadDetails,
      },
    };
  }

  async deleteCommentInAThread(request) {
    const commentUseCases = await this._container.resolve('CommentUseCases');

    await commentUseCases.softDeleteComment({
      username: request.auth.credentials.username,
      userId: request.auth.credentials.id,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
    });

    return {
      status: 'success',
      message: 'komentar berhasil di hapus',
    };
  }
}

module.exports = ThreadsHandler;
