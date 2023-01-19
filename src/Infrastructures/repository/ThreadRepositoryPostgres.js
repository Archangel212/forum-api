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
    const {title, body, owner} = thread;
    const date = new Date();
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('gagal menambah thread');
    }


    return new Thread({...result.rows[0], body});
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
      text: `SELECT c.id, u.username, c.date, c.content, c.is_deleted FROM comments c
            INNER JOIN threads t ON c.thread_id = t.id 
            INNER JOIN users u ON c.owner = u.id
            WHERE t.id = $1
            ORDER BY c.date`,
      values: [threadId],
    });

    if (!threadCommentsResult.rowCount) {
      throw new InvariantError('thread comments tidak ditemukan');
    }

    const threadDetails = {
      ...threadResult.rows[0],
      comments: threadCommentsResult.rows.map((val)=>{
        if (val.is_deleted) {
          val.content = '**komentar telah dihapus**';
        }
        delete val.is_deleted;
        return val;
      }),
    };

    console.log('getThreadDetails threadDetails', threadDetails);
    return threadDetails;
  }
}

module.exports = ThreadRepositoryPostgres;
