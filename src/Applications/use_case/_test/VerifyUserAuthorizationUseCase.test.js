const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const VerifyUserAuthorizationUseCase = require('../VerifyUserAuthorizationUseCase');

describe('VerifyUserAuthorizationUseCase', ()=>{
  describe('verifyThreadResourceAccess', ()=>{
    it('should throw an error if the usecase does not contain needed payload', async ()=>{
      const useCasePayload = {
        username: 'dicoding',
      };

      const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({});

      await expect(verifyUserAuthorizationUseCase.verifyThreadResourceAccess(useCasePayload))
          .rejects
          .toThrowError('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw an error if the payload data type is not valid', ()=>{
      const useCasePayload = {username: 123, id: 456};

      const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({
        userRepository: {},
        commentRepository: {},
        threadRepository: {},
      });

      expect(verifyUserAuthorizationUseCase.verifyThreadResourceAccess(useCasePayload)).rejects.toThrowError('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    describe('should orchestrating the verification of thread resource action correctly', ()=>{
      it('should not call verifyThreadId if the threadId is not specified in the useCasePayload', async ()=>{
        const useCasePayload = {username: 'dicoding', id: 'user-123'};

        const mockedUserRepository = new UserRepository();
        const mockedThreadRepository = new ThreadRepository();

        mockedUserRepository.verifyUserJwtPayload = jest.fn().mockResolvedValue();

        const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({
          userRepository: mockedUserRepository,
          commentRepository: {},
          threadRepository: mockedThreadRepository,
        });

        await verifyUserAuthorizationUseCase.verifyThreadResourceAccess(useCasePayload);

        expect(mockedUserRepository.verifyUserJwtPayload).toBeCalledWith(useCasePayload.username, useCasePayload.id);
      });

      it('should call verifyThreadId if the threadId is specified in the useCasePayload', async ()=>{
        const useCasePayload = {
          username: 'ujang',
          id: 'user-456',
          threadId: 'thread-123',
        };

        const mockedUserRepository = new UserRepository();
        const mockedThreadRepository = new ThreadRepository();

        mockedUserRepository.verifyUserJwtPayload = jest.fn().mockResolvedValue();
        mockedThreadRepository.verifyThreadId = jest.fn().mockResolvedValue();

        const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({
          userRepository: mockedUserRepository,
          commentRepository: {},
          threadRepository: mockedThreadRepository,
        });

        await verifyUserAuthorizationUseCase.verifyThreadResourceAccess(useCasePayload);

        expect(mockedThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
        expect(mockedUserRepository.verifyUserJwtPayload).toBeCalledWith(useCasePayload.username, useCasePayload.id);
      });
    });
  });

  describe('verifyCommentResourceAccess', ()=>{
    it('should throw an error if the usecase does not contain needed payload', async ()=>{
      const useCasePayload = {
        commentId: 'comment-123',
      };

      const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({});

      await expect(verifyUserAuthorizationUseCase.verifyCommentResourceAccess(useCasePayload))
          .rejects
          .toThrowError('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw an error if the payload data type is not valid', ()=>{
      const useCasePayload = {commentId: 123, userId: 456};

      const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({
        userRepository: {},
        commentRepository: {},
        threadRepository: {},
      });

      expect(verifyUserAuthorizationUseCase.verifyCommentResourceAccess(useCasePayload)).rejects.toThrowError('VERIFY_USER_AUTHORIZATION_USECASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the verification of comment resource action correctly', async ()=>{
      const useCasePayload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      const mockedCommentRepository = new CommentRepository();

      mockedCommentRepository.verifyCommentId = jest.fn().mockResolvedValue();
      mockedCommentRepository.verifyCommentResourceAccess = jest.fn().mockResolvedValue();

      const verifyUserAuthorizationUseCase = new VerifyUserAuthorizationUseCase({
        userRepository: {},
        commentRepository: mockedCommentRepository,
        threadRepository: {},
      });

      await verifyUserAuthorizationUseCase.verifyCommentResourceAccess(useCasePayload);

      expect(mockedCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId);
      expect(mockedCommentRepository.verifyCommentResourceAccess).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    });
  });
});
