const CommentsTableHelper = require('../../../../tests/CommentsTableHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
        comments: [],
      };
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(thread);

      const threads = await ThreadsTableHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('addCommentToThread function', ()=>{
    it('should throw an error if the thread does not exist', async ()=>{
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.addCommentToThread(threadId, commentId)).rejects.toThrowError(InvariantError);
    });

    it('should add a comment to the appropriate thread', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await CommentsTableHelper.addComment({id: 'comment-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      const expectedAddedComment = await CommentsTableHelper.findCommentById('comment-123');

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await threadRepositoryPostgres.addCommentToThread('thread-123', 'comment-123');

      const comments = await ThreadsTableHelper.findCommentsInAThread('thread-123');

      console.log('comments', comments);
      expect(expectedAddedComment).toEqual(comments[0]);
    });
  });

  describe('getThreadDetails function', ()=>{
    it('should return thread details correctly', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await CommentsTableHelper.addComment({id: 'comment-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      const fakeIdGenerator = () => '123';

      await UsersTableTestHelper.addUser({id: 'user-456', username: 'ujang'});
      await CommentsTableHelper.addComment({id: 'comment-456', content: 'another comment', isDeleted: true});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.getThreadDetails('thread-123');
    });
  });
});
