const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const NewlyAddedThread = require("../../Domains/threads/entities/NewlyAddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new NewlyAddedThread(result.rows[0]);
  }

  async getThreadById(threadId) {
    const threadQuery = await this._pool.query({
      text: `SELECT threads.id, title, body, users.username, date 
      FROM threads
      INNER JOIN users ON threads.owner = users.id
      WHERE threads.id = $1`,
      values: [threadId],
    });

    if (!threadQuery.rowCount) {
      throw new NotFoundError("trit tidak ditemukan");
    }

    return threadQuery.rows[0];
  }

  async verifyThreadExist(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
