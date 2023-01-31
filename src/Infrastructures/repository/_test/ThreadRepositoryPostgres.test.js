const CommentsTableHelper = require('../../../../tests/CommentsTableHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
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

    it('should return appropriate thread attributes', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      const thread = {
        title: 'sample-thread',
        body: 'just a sample',
        owner: 'user-123',
      };
      const expectedThread = {
        id: 'thread-123',
        title: 'sample-thread',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      expect(addedThread).toStrictEqual(expectedThread);
    });
  });

  describe('getThreadById function', ()=>{
    it('should throw an error if threadId is invalid', async ()=>{
      const threadId = 'xxx';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById(threadId)).rejects.toThrow(InvariantError);
    });

    it('should return thread correctly', async ()=>{
      const threadDate = new Date();

      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123', title: 'thread title', body: 'thread body', date: threadDate});
      const fakeIdGenerator = () => '123';

      const expectedThread = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        date: threadDate,
        username: 'dicoding',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread).toStrictEqual(expectedThread);
    });
  });

  describe('getThreadComments function', ()=>{
    it('should return empty array if thread doenst have any comments', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});

      const expectedThreadComments = [];

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadComments = await threadRepositoryPostgres.getThreadComments('thread-123');

      expect(threadComments).toBeInstanceOf(Array);
      expect(threadComments).toStrictEqual(expectedThreadComments);
    });

    it('should return thread comments correctly', async ()=>{
      const dicodingCommentDate = new Date();
      const ujangCommentDate = new Date();

      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      await CommentsTableHelper.addComment({id: 'comment-123', content: 'just a dicoding comment', date: dicodingCommentDate});
      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({id: 'user-456', username: 'ujang'});
      await CommentsTableHelper.addComment({id: 'comment-456', content: 'just a ujang comment', date: ujangCommentDate, isDeleted: true, owner: 'user-456'});

      const expectedThreadComments = [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: dicodingCommentDate,
          content: 'just a dicoding comment',
          is_deleted: false,
        },
        {
          id: 'comment-456',
          username: 'ujang',
          date: ujangCommentDate,
          content: 'just a ujang comment',
          is_deleted: true,
        },
      ];

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadComments = await threadRepositoryPostgres.getThreadComments('thread-123');

      expect(threadComments).toBeInstanceOf(Array);
      expect(threadComments).toStrictEqual(expectedThreadComments);
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
