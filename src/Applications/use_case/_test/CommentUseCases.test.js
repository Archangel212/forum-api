const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCases = require('../CommentUseCases');
const VerifyUserAuthorizationUseCase = require('../VerifyUserAuthorizationUseCase');

describe('CommentUseCases', ()=>{
  describe('addCommentToThread use case', ()=>{
    it('should orchestrating adding comment to thread action correctly', async ()=>{
      const date = new Date();
      const useCasePayload = {
        content: 'just a comment',
        date,
        ownerUsername: 'dicoding',
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

      const mockedVerifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({});
      mockedVerifyUserAuthorizationUseCase.verifyThreadResourceAccess = jest.fn().mockResolvedValue();

      const commentUseCases = new CommentUseCases({commentRepository: mockedCommentRepository});
      mockedCommentRepository.addCommentToThread = jest.fn().mockResolvedValue(expectedAddedComment);

      const addedComment = await commentUseCases.addCommentToThread(useCasePayload, mockedVerifyUserAuthorizationUseCase);

      expect(addedComment).toStrictEqual(expectedAddedComment);
      expect(mockedVerifyUserAuthorizationUseCase.verifyThreadResourceAccess).toBeCalledWith({username: useCasePayload.ownerUsername, id: useCasePayload.owner, threadId: useCasePayload.threadId});
      expect(mockedCommentRepository.addCommentToThread).toBeCalledWith({
        content: 'just a comment',
        date,
        owner: 'user-123',
        isDeleted: false,
        threadId: 'thread-123',
      });
    });
  });

  describe('softDeleteComment use case', ()=>{
    it('should throw an error if the usecase does not contain needed payload', async ()=>{
      const useCasePayload = {};

      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.softDeleteComment(useCasePayload))
          .rejects
          .toThrowError('COMMENT_USECASES.NOT_CONTAIN_NEEDED_PAYLOAD');
    });

    it('should throw an error if the payload data type is not valid', async ()=>{
      const useCasePayload = {
        commentId: 123,
      };

      const commentUseCases = new CommentUseCases({});

      await expect(commentUseCases.softDeleteComment(useCasePayload))
          .rejects
          .toThrowError('COMMENT_USECASES.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating soft deletion action correctly', async ()=>{
      const useCasePayload = {
        username: 'dicoding',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const mockedCommentRepository = new CommentRepository();

      const mockedVerifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({});
      mockedVerifyUserAuthorizationUseCase.verifyThreadResourceAccess = jest.fn().mockResolvedValue();
      mockedVerifyUserAuthorizationUseCase.verifyCommentResourceAccess = jest.fn().mockResolvedValue();

      const commentUseCases = new CommentUseCases({commentRepository: mockedCommentRepository});
      mockedCommentRepository.softDeleteComment = jest.fn().mockResolvedValue();

      await commentUseCases.softDeleteComment(useCasePayload, mockedVerifyUserAuthorizationUseCase);

      expect(mockedVerifyUserAuthorizationUseCase.verifyThreadResourceAccess).toBeCalledWith({
        username: useCasePayload.username, id: useCasePayload.userId, threadId: useCasePayload.threadId});
      expect(mockedVerifyUserAuthorizationUseCase.verifyCommentResourceAccess).toBeCalledWith({
        commentId: useCasePayload.commentId,
        userId: useCasePayload.userId,
      });
      expect(mockedCommentRepository.softDeleteComment).toBeCalledWith(useCasePayload.commentId);
    });
  });
});
