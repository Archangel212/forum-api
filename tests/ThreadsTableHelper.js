/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ThreadsTableHelper = {
  async addThread({
    id = 'thread-123', title = 'sample-thread', body = 'just a thread', dateCreated = new Date(), owner = 'user-123', commentId = 'comment-123',
  }) {
    // await UsersTableTestHelper.addUser({id: owner});

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, dateCreated, owner, commentId],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsInAThread(threadId) {
    const result = await pool.query({
      text: 'SELECT comments.* FROM comments INNER JOIN threads ON comments.id = threads.comment_id WHERE threads.id = $1',
      values: [threadId],
    });

    return result.rows;
  },


  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableHelper;
