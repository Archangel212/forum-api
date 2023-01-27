/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableHelper = {
  async addThread({
    id = 'thread-123', title = 'sample-thread', body = 'just a thread', date = new Date(), owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner],
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
      text: 'SELECT comments.* FROM comments INNER JOIN threads ON comments.thread_id = threads.id WHERE threads.id = $1',
      values: [threadId],
    });

    return result.rows;
  },


  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableHelper;
