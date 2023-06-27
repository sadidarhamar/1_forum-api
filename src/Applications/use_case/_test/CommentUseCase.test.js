const NewComment = require('../../../Domains/comments/entities/NewComment');
const NewlyAddedComment = require('../../../Domains/comments/entities/NewlyAddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
  describe('addComment', () => {
    it('should orchestrating the add comment action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
        content: 'komentar',
        owner: 'test1',
      };

      const mockNewlyAddedComment = new NewlyAddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      });

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.verifyThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      mockCommentRepository.addComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockNewlyAddedComment));

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      const newlyAddedComment = await commentUseCase.addComment(useCasePayload);

      expect(newlyAddedComment).toStrictEqual(
        new NewlyAddedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );

      expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
        useCasePayload.threadId
      );

      expect(mockCommentRepository.addComment).toBeCalledWith(
        new NewComment({
          threadId: useCasePayload.threadId,
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );
    });
  });

  describe('deleteComment', () => {
    it('should throw error if use case payload not contain commentId', async () => {
      const useCasePayload = {};
      const commentUseCase = new CommentUseCase({});

      await expect(
        commentUseCase.deleteComment(useCasePayload)
      ).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
    });

    it('should throw error if comment id or thread id not string', async () => {
      const useCasePayload = {
        commentId: 123,
        threadId: true,
      };

      const commentUseCase = new CommentUseCase({});

      await expect(
        commentUseCase.deleteComment(useCasePayload)
      ).rejects.toThrowError(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    });

    it('should orchestrating the delete comment action correctly', async () => {
      const useCasePayload = {
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.verifyThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.deleteComment = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await commentUseCase.deleteComment(useCasePayload);

      expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
        useCasePayload.commentId
      );
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith({
        commentId: useCasePayload.commentId,
        owner: useCasePayload.owner,
      });
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
      });
    });
  });
});
