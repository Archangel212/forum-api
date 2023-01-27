
const Comment = require('../../Domains/comments/entities/Comment');
class CommentUseCases {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async addCommentToThread(useCasePayload, verifyUserAuthorizationUseCase) {
    const comment = new Comment(useCasePayload);
    const {owner, threadId} = comment;

    await verifyUserAuthorizationUseCase.verifyThreadResourceAccess({username: useCasePayload.ownerUsername, id: owner, threadId});
    return await this._commentRepository.addCommentToThread(comment);
  }

  async softDeleteComment(useCasePayload, verifyUserAuthorizationUseCase) {
    this._validateSoftDeleteCommentPayload(useCasePayload);
    const {username, userId, threadId, commentId} = useCasePayload;

    await verifyUserAuthorizationUseCase.verifyThreadResourceAccess({username, id: userId, threadId});
    await verifyUserAuthorizationUseCase.verifyCommentResourceAccess({
      commentId,
      userId,
    });
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
