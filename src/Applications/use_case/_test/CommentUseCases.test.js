const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCases = require('../CommentUseCases');

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
      const mockedThreadRepository = new ThreadRepository();

      const commentUseCases = new CommentUseCases({commentRepository: mockedCommentRepository, threadRepository: mockedThreadRepository});
      mockedCommentRepository.addCommentToThread = jest.fn().mockResolvedValue(expectedAddedComment);
      mockedThreadRepository.verifyThreadId = jest.fn().mockResolvedValue();

      const addedComment = await commentUseCases.addCommentToThread(useCasePayload);

      expect(addedComment).toStrictEqual(expectedAddedComment);
      expect(mockedThreadRepository.verifyThreadId).toBeCalledWith('thread-123');
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
      const mockedThreadRepository = new ThreadRepository();

      mockedThreadRepository.verifyThreadId = jest.fn().mockResolvedValue();
      mockedCommentRepository.verifyCommentId = jest.fn().mockResolvedValue();
      mockedCommentRepository.verifyCommentResourceAccess = jest.fn().mockResolvedValue();

      const commentUseCases = new CommentUseCases({commentRepository: mockedCommentRepository, threadRepository: mockedThreadRepository});
      mockedCommentRepository.softDeleteComment = jest.fn().mockResolvedValue();

      await commentUseCases.softDeleteComment(useCasePayload);

      expect(mockedThreadRepository.verifyThreadId).toBeCalledWith('thread-123');
      expect(mockedCommentRepository.verifyCommentId).toBeCalledWith('comment-123');
      expect(mockedCommentRepository.verifyCommentResourceAccess).toBeCalledWith('comment-123', 'user-123');
      expect(mockedCommentRepository.softDeleteComment).toBeCalledWith(useCasePayload.commentId);
    });
  });
});
