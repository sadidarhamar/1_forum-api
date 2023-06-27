const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const NewComment = require('../../../Domains/comments/entities/NewComment');
const NewlyAddedComment = require('../../../Domains/comments/entities/NewlyAddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'SomeUser',
    });
    await ThreadsTableTestHelper.addThread({});
  });
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return newly added comment correctly', async () => {
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'komentar',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.addComment(newComment);

      const comment = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );
      expect(comment).toHaveLength(1);
    });

    it('should return newly added comment correctly', async () => {
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'komentar',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const newlyAddedComment = await commentRepositoryPostgres.addComment(
        newComment
      );

      expect(newlyAddedComment).toStrictEqual(
        new NewlyAddedComment({
          id: 'comment-123',
          content: 'komentar',
          owner: 'user-123',
        })
      );
    });
  });

  describe('getCommentById', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.getCommentById('comment-1234443')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment detail correctly', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-123'
      );

      expect(comment.id).toEqual('comment-123');
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return comment detail correctly', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123'
      );

      expect(comment).toHaveLength(1);
    });
  });

  describe('deleteComment function', () => {
    it('should change is_delete to true from database', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'first comment',
      });

      await commentRepositoryPostgres.verifyCommentOwner({
        commentId: 'comment-123',
        owner: 'user-123',
      });

      await commentRepositoryPostgres.deleteComment({
        commentId: 'comment-123',
        threadId: 'thread-123',
      });

      const comment = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      );

      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentExist('comment-3434')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return true when comment is found', async () => {
      const newComment = new NewComment({
        content: 'isi komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.addComment(newComment);

      const isCommentExist = await commentRepositoryPostgres.verifyCommentExist(
        'comment-123'
      );

      expect(isCommentExist).toBeTruthy();
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when owner comment is different with payload', async () => {
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment-123',
          owner: 'user-12433',
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should return true when owner comment is the same with payload', async () => {
      const newComment = new NewComment({
        content: 'isi komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.addComment(newComment);

      const isCommentOwner = await commentRepositoryPostgres.verifyCommentOwner(
        { commentId: 'comment-123', owner: 'user-123' }
      );

      expect(isCommentOwner).toBeTruthy();
    });
  });
});
