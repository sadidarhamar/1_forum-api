/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'komentar',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, thread_id, owner',
      values: [id, threadId, content, owner],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
