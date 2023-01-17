const InvariantError = require('../../Commons/exceptions/InvariantError');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const {title, body, owner, comments} = thread;
    const date = new Date();
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new Thread({...result.rows[0], body, comments});
  }

  async addCommentToThread(threadId, commentId) {
    const updateResult = await this._pool.query({
      text: 'UPDATE threads SET comment_id = $1 WHERE id = $2',
      values: [commentId, threadId],
    });

    if (!updateResult.rowCount) {
      throw new InvariantError('komentar gagal ditambahkan ke dalam thread');
    }
  }

  async getThreadDetails(threadId) {
    const threadResult = await this._pool.query({
      text: `SELECT t.id, t.title, t.body, t.date_created AS date, u.username 
            FROM threads t
            INNER JOIN users u ON t.owner = u.id 
            WHERE t.id = $1`,
      values: [threadId],
    });

    if (!threadResult.rowCount) {
      throw new InvariantError('thread tidak ditemukan');
    }

    const threadCommentsResult = await this._pool.query({
      text: `SELECT c.id, u.username, c.date, c.content FROM threads t
            INNER JOIN comments c ON t.comment_id = c.id
            INNER JOIN users u ON c.owner = u.id
            WHERE t.id = $1
            `,
      values: [threadId],
    });
    console.log('getThreadDetails threadResult', threadResult.rows);
    console.log('getThreadDetails threadCommentsResult', threadCommentsResult.rows);
  }
}

module.exports = ThreadRepositoryPostgres;
