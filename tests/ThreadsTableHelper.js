/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableHelper = {
  // async addUser({
  //   id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  // }) {
  //   const query = {
  //     text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
  //     values: [id, username, password, fullname],
  //   };

  //   await pool.query(query);
  // },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableHelper;
