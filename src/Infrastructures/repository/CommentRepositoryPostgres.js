const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentToThread({content, date, owner, isDeleted, threadId}) {
    const id = `comment-${this._idGenerator()}`;
    const result = await this._pool.query({
      text: 'INSERT INTO comments(id, content, date, owner, is_deleted, thread_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, isDeleted, threadId],
    });

    if (!result.rowCount) {
      throw new InvariantError('komentar gagal ditambahkan ke dalam thread');
    }
    return {...result.rows[0]};
  }

  async softDeleteComment(commentId) {
    const result = await this._pool.query({
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new InvariantError('komentar gagal dihapuskan dari dalam thread');
    }
  }

  async verifyCommentId(commentId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentResourceAccess(commentId, userId) {
    const result = await this._pool.query({
      text: 'SELECT id, owner FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    });

    if (!result.rowCount) {
      throw new AuthorizationError('user tidak terotorisasi');
    }
  }
}

module.exports = CommentRepositoryPostgres;
