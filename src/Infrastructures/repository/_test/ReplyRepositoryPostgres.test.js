const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const NewlyAddedReply = require('../../../Domains/replies/entities/NewlyAddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'SomeUser',
    });
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return newly added reply correctly', async () => {
      const newReply = new NewReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'balasan',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await replyRepositoryPostgres.addReply(newReply);

      const reply = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return newly added reply correctly', async () => {
      const newReply = new NewReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'balasan',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const newlyAddedReply = await replyRepositoryPostgres.addReply(newReply);

      expect(newlyAddedReply).toStrictEqual(
        new NewlyAddedReply({
          id: 'reply-123',
          content: 'balasan',
          owner: 'user-123',
        })
      );
    });
  });

  describe('getReplyById', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.getReplyById('reply-1234443')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return reply detail correctly', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const reply = await replyRepositoryPostgres.getReplyById('reply-123');

      expect(reply.id).toEqual('reply-123');
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return reply detail correctly', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const reply = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123'
      );

      expect(reply).toHaveLength(1);
    });
  });

  describe('deleteReply function', () => {
    it('should change is_delete to true from database', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        content: 'first reply',
      });

      await replyRepositoryPostgres.verifyReplyOwner({
        replyId: 'reply-123',
        owner: 'user-123',
      });

      await replyRepositoryPostgres.deleteReply({
        replyId: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const reply = await RepliesTableTestHelper.findRepliesById('reply-123');

      expect(reply[0].is_delete).toEqual(true);
    });
  });

  describe('verifyReplyExist function', () => {
    it('should throw NotFoundError when reply is not exist', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyReplyExist('reply-3434')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should resolved when reply is found', async () => {
      const newReply = new NewReply({
        content: 'balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await replyRepositoryPostgres.addReply(newReply);

      await expect(
        replyRepositoryPostgres.verifyReplyExist('reply-123')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when owner reply is different with payload', async () => {
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply-123',
          owner: 'user-12433',
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should resolved when owner reply is the same with payload ', async () => {
      const newReply = new NewReply({
        content: 'balasan',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await replyRepositoryPostgres.addReply(newReply);

      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: 'reply-123',
          owner: 'user-123',
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });
});
