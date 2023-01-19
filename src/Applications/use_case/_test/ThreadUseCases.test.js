const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCases = require('../ThreadUseCases');

describe('ThreadUsecases', ()=>{
  describe('addThread usecase', ()=>{
    it('should orchestrating the adding thread action correctly', async ()=>{
      const useCasePayload = {
        title: 'simple thread',
        body: 'just a thread',
        owner: 'user-123',
      };
      const expectedAddedThred = new Thread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const mockedThreadRepository = new ThreadRepository();
      const mockedThreadUseCase = new ThreadUseCases({
        threadRepository: mockedThreadRepository,
      });

      mockedThreadRepository.addThread = jest.fn().mockResolvedValue(expectedAddedThred);
      const addedThread = await mockedThreadUseCase.addThread(useCasePayload);

      expect(addedThread).toStrictEqual(expectedAddedThred);
      expect(mockedThreadRepository.addThread).toBeCalledWith(useCasePayload);
    });
  });

  describe('getThreadDetails usecase', ()=>{
    it('should orchestrating the getting thread details action correctly', async ()=>{
      const useCasePayload = {
        threadId: 'thread-123',
      };
      const expectedThreadDetails = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: new Date(),
        username: 'user-123',
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
            content: 'just a ujang comment',
          },
        ],
      };

      const mockedThreadRepository = new ThreadRepository();
      const mockedThreadUseCase = new ThreadUseCases({
        threadRepository: mockedThreadRepository,
      });

      mockedThreadRepository.getThreadDetails = jest.fn().mockResolvedValue(expectedThreadDetails);
      const threadDetails = await mockedThreadUseCase.getThreadDetails(useCasePayload);

      expect(threadDetails).toStrictEqual(expectedThreadDetails);
      expect(mockedThreadRepository.getThreadDetails).toBeCalledWith(useCasePayload.threadId);
    });
  });
});
