const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCases = require('../ThreadUseCases');

describe('ThreadUsecases', ()=>{
  describe('addThread usecase', ()=>{
    it('should orchestrating the adding thread action correctly', async ()=>{
      const useCasePayload = {
        title: 'simple thread',
        body: 'just a thread',
        ownerUsername: 'dicoding',
        owner: 'user-123',
      };
      const expectedAddedThread = {
        id: 'thread-123',
        title: 'simple thread',
        owner: 'user-123',
      };

      const mockedThreadRepository = new ThreadRepository();
      const mockedThreadUseCase = new ThreadUseCases({
        threadRepository: mockedThreadRepository,
      });

      mockedThreadRepository.addThread = jest.fn().mockResolvedValue(expectedAddedThread);
      const addedThread = await mockedThreadUseCase.addThread(useCasePayload);

      expect(addedThread).toStrictEqual(expectedAddedThread);
      expect(mockedThreadRepository.addThread).toBeCalledWith({
        title: 'simple thread',
        body: 'just a thread',
        owner: 'user-123',

      });
    });
  });

  describe('getThreadDetails usecase', ()=>{
    it('should throw an error if the usecase does not contain needed payload', async ()=>{
      const useCasePayload = {};

      const threadUseCase = new ThreadUseCases({});

      await expect(threadUseCase.getThreadDetails(useCasePayload))
          .rejects
          .toThrowError('THREAD_USECASES.NOT_CONTAIN_NEEDED_PAYLOAD');
    });

    it('should throw an error if the payload data type is not valid', async ()=>{
      const useCasePayload = {
        threadId: 123,
      };

      const threadUseCase = new ThreadUseCases({});

      await expect(threadUseCase.getThreadDetails(useCasePayload))
          .rejects
          .toThrowError('THREAD_USECASES.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the getting thread details action correctly', async ()=>{
      const useCasePayload = {
        threadId: 'thread-123',
      };
      const thread = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: new Date(),
        username: 'dicoding',
      };
      const threadComments = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: new Date(),
          content: 'just a dicoding comment',
        },
        {
          id: 'comment-456',
          username: 'ujang',
          date: new Date(),
          content: '**komentar telah dihapus**',
        },
      ];

      const expectedThreadDetails = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: new Date(),
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: new Date(),
            content: 'just a dicoding comment',
          },
          {
            id: 'comment-456',
            username: 'ujang',
            date: new Date(),
            content: '**komentar telah dihapus**',
          },
        ],
      };

      const mockedThreadRepository = new ThreadRepository();
      const mockedThreadUseCase = new ThreadUseCases({
        threadRepository: mockedThreadRepository,
      });

      mockedThreadRepository.getThreadById = jest.fn().mockResolvedValue(thread);
      mockedThreadRepository.getThreadComments = jest.fn().mockResolvedValue(threadComments);
      const threadDetails = await mockedThreadUseCase.getThreadDetails(useCasePayload);

      expect(threadDetails).toStrictEqual(expectedThreadDetails);
      expect(mockedThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
      expect(mockedThreadRepository.getThreadComments).toBeCalledWith(useCasePayload.threadId);
    });
  });
});
