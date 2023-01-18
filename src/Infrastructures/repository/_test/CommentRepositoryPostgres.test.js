const CommentsTableHelper = require('../../../../tests/CommentsTableHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentToThread function', ()=>{
    it('should throw an error if the thread does not exist', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      const comment = {
        content: 'sample comment',
        date: new Date(),
        owner: 'user-123',
        isDeleted: false,
        threadId: 'thread-xxx',
      };
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepositoryPostgres.addCommentToThread(comment)).rejects.toThrowError(InvariantError);
    });

    it('should add a comment to the appropriate thread', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      const date = new Date();
      const comment = {
        content: 'sample comment',
        date,
        owner: 'user-123',
        isDeleted: false,
        threadId: 'thread-123',
      };

      const expectedAddedComment = {
        id: 'comment-123',
        content: 'sample comment',
        date,
        owner: 'user-123',
        is_deleted: false,
        thread_id: 'thread-123',
      };
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addCommentToThread(comment);

      const addedComment = await CommentsTableHelper.findCommentById('comment-123');

      expect(addedComment).toEqual(expectedAddedComment);
    });
  });

  it('should soft delete comment correctly', async ()=>{
    await UsersTableTestHelper.addUser({id: 'user-123'});
    await ThreadsTableHelper.addThread({id: 'thread-123'});
    await CommentsTableHelper.addComment({id: 'comment-123'});

    const fakeIdGenerator = () => '123';
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

    await commentRepositoryPostgres.softDeleteComment('comment-123');

    const comments = await ThreadsTableHelper.findCommentsInAThread('thread-123');

    expect(comments[0].is_deleted).toEqual(true);
  });
});
