const CommentsTableHelper = require('../../../../tests/CommentsTableHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread into a threads table', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      const thread = {
        title: 'sample-thread',
        body: 'just a sample',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(thread);

      const threads = await ThreadsTableHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById function', ()=>{
    it('should return thread correctly', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(threadDetails).toHaveProperty('ids');
      expect(threadDetails).toHaveProperty('title');
      expect(threadDetails).toHaveProperty('body');
      expect(threadDetails).toHaveProperty('date');
      expect(threadDetails).toHaveProperty('username');
      expect(threadDetails).toHaveProperty('comments');
      expect(threadDetails.comments).toBeInstanceOf(Array);
    });
  });
  describe('getThreadDetails function', ()=>{
    it('should return thread details correctly', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      await CommentsTableHelper.addComment({id: 'comment-123'});
      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({id: 'user-456', username: 'ujang'});
      await CommentsTableHelper.addComment({id: 'comment-456', content: 'another comment', isDeleted: true, owner: 'user-456'});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadDetails = await threadRepositoryPostgres.getThreadDetails('thread-123');

      expect(threadDetails).toHaveProperty('id');
      expect(threadDetails).toHaveProperty('title');
      expect(threadDetails).toHaveProperty('body');
      expect(threadDetails).toHaveProperty('date');
      expect(threadDetails).toHaveProperty('username');
      expect(threadDetails).toHaveProperty('comments');
      expect(threadDetails.comments).toBeInstanceOf(Array);
    });
  });

  describe('verifyThreadId function', ()=>{
    it('should throw an error if thread id is not found', async ()=>{
      const threadId = 'xxx';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadId(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw an error if thread id is found', async ()=>{
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: threadId});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadId(threadId)).resolves.not.toThrow(NotFoundError);
    });
  });
});
