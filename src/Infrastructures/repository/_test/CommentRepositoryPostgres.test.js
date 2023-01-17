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

  // describe('addComment function', () => {
  //   it('should add comment into comments table', async ()=>{
  //     await UsersTableTestHelper.addUser({id: 'user-123'});
  //     const expectedAddedComment = {
  //       id: 'comment-123',
  //       content: 'sample-comment',
  //       date: new Date(),
  //       owner: 'user-123',
  //       isDeleted: false,
  //     };
  //     const fakeIdGenerator = () => '123';

  //     const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
  //     await commentRepositoryPostgres.addComment(expectedAddedComment);

  //     const comment = await CommentsTableHelper.findCommentById('comment-123');
  //     delete Object.assign(comment, {isDeleted: comment.is_deleted}).is_deleted;

  //     expect(comment).toEqual(expectedAddedComment);
  //   });

  //   it('it should throw an error if the owner of the comment does not exist', async ()=>{
  //     const comment = {
  //       content: 'sample-comment',
  //       date: new Date().toISOString(),
  //       owner: 'user-123',
  //       isDeleted: false,
  //     };
  //     const fakeIdGenerator = () => '123';

  //     const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

  //     await expect(commentRepositoryPostgres.addComment(comment)).rejects.toThrowError(InvariantError);
  //   });
  // });

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
  // describe('getCommentById function', ()=>{
  //   it('should return an object containing comments table fields and their respective values ', async ()=>{
  //     // const date = new Date().toISOString();
  //     const date = '2023-01-16T08:15:26.732Z';
  //     const expectedAddedComment = {
  //       id: 'comment-123',
  //       content: 'sample comment',
  //       date,
  //       owner: 'user-123',
  //       is_deleted: false,
  //     };
  //     await UsersTableTestHelper.addUser({id: 'user-123'});
  //     console.log(expectedAddedComment.date === date, date);
  //     await CommentsTableHelper.addComment({id: 'comment-123', content: 'sample comment', date});
  //     await ThreadsTableHelper.addThread({id: 'thread-123'});
  //     const fakeIdGenerator = () => '123';
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

  //     const addedComment = await threadRepositoryPostgres.addCommentToThread('thread-123', 'comment-123');

  //     expect(addedComment).toMatchObject(expectedAddedComment);
  //   });
  // });
  //

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
