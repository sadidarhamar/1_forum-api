const NewlyAddedReply = require('../../Domains/replies/entities/NewlyAddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const {
      threadId, commentId, content, owner,
    } = newReply;

    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, owner],
    };

    const result = await this._pool.query(query);

    return new NewlyAddedReply({ ...result.rows[0] });
  }

  async getReplyById(replyId) {
    const query = await this._pool.query({
      text: `SELECT replies.id, comment_id, thread_id, content, users.username, date 
      FROM replies
      INNER JOIN users ON replies.owner = users.id
      WHERE replies.id = $1
      ORDER BY date ASC`,
      values: [replyId],
    });

    if (!query.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return query.rows[0];
  }

  async getRepliesByCommentId(commentId) {
    const query = await this._pool.query({
      text: `SELECT replies.id, comment_id, thread_id, content, users.username, date, is_delete
      FROM replies
      INNER JOIN users ON replies.owner = users.id
      WHERE comment_id = $1
      ORDER BY date ASC`,
      values: [commentId],
    });

    return query.rows;
  }

  async deleteReply({ threadId, commentId, replyId }) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id=$1 AND thread_id=$2 AND comment_id=$3',
      values: [replyId, threadId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyReplyExist(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan komentar tidak ditemukan');
    }
  }

  async verifyReplyOwner({ replyId, owner }) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner= $2',
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('balasan komentar ini tidak bisa diubah');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
