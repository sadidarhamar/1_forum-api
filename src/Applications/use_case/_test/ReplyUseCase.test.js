const NewReply = require('../../../Domains/replies/entities/NewReply');
const NewlyAddedReply = require('../../../Domains/replies/entities/NewlyAddedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');

describe('ReplyUseCase', () => {
  describe('AddReply', () => {
    it('should orchestrating the add reply action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'balasan dari komen 123',
        owner: 'test1',
      };

      const mockNewlyAddedReply = new NewlyAddedReply({
        id: 'reply-123',
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      });

      const mockReplyRepository = new ReplyRepository();
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.verifyThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.addReply = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockNewlyAddedReply));

      const replyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      const newlyAddedReply = await replyUseCase.addReply(useCasePayload);

      expect(newlyAddedReply).toStrictEqual(
        new NewlyAddedReply({
          id: 'reply-123',
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );

      expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
        useCasePayload.commentId
      );

      expect(mockReplyRepository.addReply).toBeCalledWith(
        new NewReply({
          threadId: useCasePayload.threadId,
          commentId: useCasePayload.commentId,
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );
    });
  });

  describe('deleteReply', () => {
    it('should throw error if use case payload not contain replyId', async () => {
      const useCasePayload = {};
      const replyUseCase = new ReplyUseCase({});

      await expect(
        replyUseCase.deleteReply(useCasePayload)
      ).rejects.toThrowError(
        'DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID_OR_THREAD_ID_OR_COMMENT_I'
      );
    });

    it('should throw error if reply id or thread id not string', async () => {
      const useCasePayload = {
        replyId: 123,
        commentId: 354,
        threadId: true,
      };

      const replyUseCase = new ReplyUseCase({});

      await expect(
        replyUseCase.deleteReply(useCasePayload)
      ).rejects.toThrowError(
        'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    });

    it('should orchestrating the delete reply action correctly', async () => {
      const useCasePayload = {
        replyId: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      };

      const mockReplyRepository = new ReplyRepository();
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.verifyThreadExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyExist = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.deleteReply = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      const replyUseCase = new ReplyUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        replyRepository: mockReplyRepository,
      });

      await replyUseCase.deleteReply(useCasePayload);

      expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
        useCasePayload.threadId
      );
      expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
        useCasePayload.commentId
      );
      expect(mockReplyRepository.verifyReplyExist).toHaveBeenCalledWith(
        useCasePayload.replyId
      );
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith({
        replyId: useCasePayload.replyId,
        owner: useCasePayload.userId,
      });
    });
  });
});
