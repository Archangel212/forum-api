const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository', ()=>{
  it('should throw an error for invoking unimplemented method', async ()=>{
    const threadRepository = new ThreadRepository();

    await expect(()=> threadRepository.addThread('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(()=> threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(()=> threadRepository.getThreadComments('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(()=> threadRepository.verifyThreadId('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
