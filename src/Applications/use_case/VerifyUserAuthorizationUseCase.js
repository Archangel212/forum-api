
class VerifyUserAuthorizationUseCase {
  constructor({userRepository, commentRepository, threadRepository}) {
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async verifyThreadResourceAccess(useCasePayload) {
    this._verifyThreadResourcePayload(useCasePayload);
    const {username, id, threadId} = useCasePayload;

    // if it was addThread use case then ignore verifyThreadId function calling
    threadId && await this._threadRepository.verifyThreadId(threadId);
    await this._userRepository.verifyUserJwtPayload(username, id);
  }

  async verifyCommentResourceAccess(useCasePayload) {
    this._verifyCommentResourcePayload(useCasePayload);
    const {commentId, userId} = useCasePayload;

    await this._commentRepository.verifyCommentId(commentId);
    await this._commentRepository.verifyCommentResourceAccess(commentId, userId);
  }

  _verifyThreadResourcePayload(useCasePayload) {
    const {username, id} = useCasePayload;
    if (!username || !id) {
      throw new Error('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof id !== 'string') {
      throw new Error('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyCommentResourcePayload(useCasePayload) {
    const {commentId, userId} = useCasePayload;

    if (!commentId || !userId) {
      throw new Error('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = VerifyUserAuthorizationUseCase;
