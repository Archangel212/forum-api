
class CommentUseCases {
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }

  async addCommentToThread(useCasePayload) {
    return await this._commentRepository.addCommentToThread(useCasePayload);
  }

  async softDeleteComment(useCasePayload) {
    const {commentId} = useCasePayload;
    await this._commentRepository.softDeleteComment(commentId);
  }
}

module.exports = CommentUseCases;
