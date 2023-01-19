const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCases = require('../CommentUseCases');

describe('CommentUseCases', ()=>{
  describe('addCommentToThread use case', ()=>{
    it('should orchestrating adding comment to thread action correctly', async ()=>{
      const useCasePayload = {
        content: 'just a comment',
        date: new Date(),
        owner: 'user-123',
        isDeleted: false,
        threadId: 'thread-123',
      };

      const expectedAddedComment = {
        id: 'comment-123',
        content: 'just a comment',
        owner: 'user-123',
      };

      const mockedCommentRepository = new CommentRepository();
      const commentUseCases = new CommentUseCases({commentRepository: mockedCommentRepository});
      mockedCommentRepository.addCommentToThread = jest.fn().mockResolvedValue(expectedAddedComment);

      const addedComment = await commentUseCases.addCommentToThread(useCasePayload);

      expect(addedComment).toStrictEqual(expectedAddedComment);
      expect(mockedCommentRepository.addCommentToThread).toBeCalledWith(useCasePayload);
    });
  });

  describe('softDeleteComment use case', ()=>{
    it('should orchestrating soft deletion action correctly', async ()=>{
      const useCasePayload = {
        commentId: 'comment-123',
      };

      const mockedCommentRepository = new CommentRepository();
      const commentUseCases = new CommentUseCases({commentRepository: mockedCommentRepository});
      mockedCommentRepository.softDeleteComment = jest.fn().mockResolvedValue();

      await commentUseCases.softDeleteComment(useCasePayload);

      expect(mockedCommentRepository.softDeleteComment).toBeCalledWith(useCasePayload.commentId);
    });
  });
});
