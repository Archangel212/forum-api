const CommentsTableHelper = require('../../../../tests/CommentsTableHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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

  describe('addCommentToThread method', ()=>{
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

    it('should return appropriate comment attributes', async ()=>{
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
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepositoryPostgres.addCommentToThread(comment);

      expect(addedComment).toStrictEqual(expectedAddedComment);
    });
  });

  describe('softDeleteComment method', ()=>{
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

  describe('verifyCommentId', ()=>{
    it('should throw NotFoundError when comment id is not found', async ()=>{
      const commentId = 'xxx';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      await expect(commentRepositoryPostgres.verifyCommentId(commentId)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment id is found', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      await CommentsTableHelper.addComment({id: 'comment-123'});

      const commentId = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');

      await expect(commentRepositoryPostgres.verifyCommentId(commentId)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentResourceAccess method', () => {
    it('should throw AuthorizationError when userId is not an owner of the comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');
      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'});
      await UsersTableTestHelper.addUser({id: 'user-456', username: 'ujang'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      await CommentsTableHelper.addComment({id: 'comment-123'});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentResourceAccess('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when userId is an owner of the comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, '');
      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'});
      await UsersTableTestHelper.addUser({id: 'user-456', username: 'ujang'});
      await ThreadsTableHelper.addThread({id: 'thread-123'});
      await CommentsTableHelper.addComment({id: 'comment-123'});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentResourceAccess('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
