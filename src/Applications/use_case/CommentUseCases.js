
const Comment = require('../../Domains/comments/entities/Comment');
class CommentUseCases {
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addCommentToThread(useCasePayload) {
    const comment = new Comment(useCasePayload);
    const {owner, threadId} = comment;

    await this._threadRepository.verifyThreadId(threadId);
    return await this._commentRepository.addCommentToThread(comment);
  }

  async softDeleteComment(useCasePayload) {
    this._validateSoftDeleteCommentPayload(useCasePayload);
    const {username, userId, threadId, commentId} = useCasePayload;

    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentId(commentId);
    await this._commentRepository.verifyCommentResourceAccess(commentId, userId);
    // await verifyUserAuthorizationUseCase.verifyCommentResourceAccess({
    //   commentId,
    //   userId,
    // });
    await this._commentRepository.softDeleteComment(commentId);
  }

  _validateSoftDeleteCommentPayload(payload) {
    const {commentId} = payload;
    if (!commentId) {
      throw new Error('COMMENT_USECASES.NOT_CONTAIN_NEEDED_PAYLOAD');
    }

    if (typeof commentId != 'string') {
      throw new Error('COMMENT_USECASES.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentUseCases;
