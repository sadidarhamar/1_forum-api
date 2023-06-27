const NewlyAddedComment = require('../../Domains/comments/entities/NewlyAddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return new NewlyAddedComment({ ...result.rows[0] });
  }

  async getCommentById(commentId) {
    const query = await this._pool.query({
      text: `SELECT comments.id, thread_id, content, users.username, date 
      FROM comments
      INNER JOIN users ON comments.owner = users.id
      WHERE comments.id = $1
      ORDER BY date ASC`,
      values: [commentId],
    });

    if (!query.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return query.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = await this._pool.query({
      text: `SELECT comments.id, content, users.username, date, is_delete 
      FROM comments
      INNER JOIN users ON comments.owner = users.id
      WHERE thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    });

    return query.rows;
  }

  async deleteComment({ threadId, commentId }) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id=$1 AND thread_id=$2',
      values: [commentId, threadId],
    };

    await this._pool.query(query);
  }

  async verifyCommentExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    return result.rows;
  }

  async verifyCommentOwner({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner= $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError(`komentar ini tidak bisa diubah`);
    }

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
