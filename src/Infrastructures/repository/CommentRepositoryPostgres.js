const InvariantError = require('../../Commons/exceptions/InvariantError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({content, date, owner, isDeleted}) {
    try {
      const id = `comment-${this._idGenerator()}`;
      const result = await this._pool.query({
        text: 'INSERT INTO comments(id, content, date, owner, is_deleted) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
        values: [id, content, date, owner, isDeleted],
      });

      return {...result.rows[0]};
    } catch (e) {
      throw new InvariantError('komentar gagal ditambahkan');
    }
  }

  async getCommentById(commentId) {
    const result = await this._pool.query({
      text: 'SELECT * FROM comments WHERE comments.id = $1',
      values: [commentId],
    });

    if (!result.rowCount) {
      throw new InvariantError('detail komentar gagal diterima');
    }
    return result.rows[0];
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
}

module.exports = CommentRepositoryPostgres;
