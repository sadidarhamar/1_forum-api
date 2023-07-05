const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewlyAddedThread = require('../../../Domains/threads/entities/NewlyAddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('ThreadUseCase', () => {
  describe('AddThread', () => {
    it('should orchestrating the add thread action correctly', async () => {
      const useCasePayload = {
        title: 'kklkl',
        body: 'konten',
        owner: 'testing',
      };

      const mockNewlyAddedThread = new NewlyAddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      });

      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.addThread = jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockNewlyAddedThread));

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      });

      const newlyAddedThread = await threadUseCase.addThread(useCasePayload);

      expect(newlyAddedThread).toStrictEqual(
        new NewlyAddedThread({
          id: 'thread-123',
          title: useCasePayload.title,
          owner: useCasePayload.owner,
        })
      );

      expect(mockThreadRepository.addThread).toBeCalledWith(
        new NewThread({
          title: useCasePayload.title,
          body: useCasePayload.body,
          owner: useCasePayload.owner,
        })
      );
    });
  });
  describe('GetThreadDetails', () => {
    it('should orchestrating the get thread details action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
      };

      const expectedResult = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:59:16.198Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:59:18.982Z',
            replies: [
              {
                id: 'reply-123',
                content: '**balasan telah dihapus**',
                date: '2021-08-08T07:59:48.766Z',
                username: 'johndoe',
              },
              {
                id: 'reply-xNBtm9HPR-492AeiimpfN',
                content: 'sebuah balasan',
                date: '2021-08-08T08:07:01.522Z',
                username: 'dicoding',
              },
            ],
            content: 'sebuah comment',
          },
          {
            id: 'comment-1234',
            username: 'dicoding',
            date: '2021-08-08T07:59:18.982Z',
            replies: [
              {
                id: 'reply-123',
                content: '**balasan telah dihapus**',
                date: '2021-08-08T07:59:48.766Z',
                username: 'johndoe',
              },
              {
                id: 'reply-xNBtm9HPR-492AeiimpfN',
                content: 'sebuah balasan',
                date: '2021-08-08T08:07:01.522Z',
                username: 'dicoding',
              },
            ],
            content: '**komentar telah dihapus**',
          },
        ],
      };

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: '2021-08-08T07:59:16.198Z',
          username: 'dicoding',
        })
      );
      mockCommentRepository.getCommentsByThreadId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve([
            {
              id: 'comment-123',
              content: 'sebuah comment',
              username: 'dicoding',
              date: '2021-08-08T07:59:18.982Z',
              is_delete: false,
            },
            {
              id: 'comment-1234',
              content: 'sebuah comment2',
              username: 'dicoding',
              date: '2021-08-08T07:59:18.982Z',
              is_delete: true,
            },
          ])
        );
      mockReplyRepository.getRepliesByCommentId = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve([
            {
              id: 'reply-123',
              comment_id: 'comment-123',
              thread_id: 'thread-123',
              content: 'balasan komen',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
              is_delete: true,
            },
            {
              id: 'reply-xNBtm9HPR-492AeiimpfN',
              comment_id: 'comment-123',
              thread_id: 'thread-123',
              content: 'sebuah balasan',
              username: 'dicoding',
              date: '2021-08-08T08:07:01.522Z',
              is_delete: false,
            },
          ])
        );
      mockThreadRepository.getThreadDetailsById = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08T07:59:16.198Z',
            username: 'dicoding',
            comments: [
              {
                id: 'comment-123',
                username: 'dicoding',
                date: '2021-08-08T07:59:18.982Z',
                replies: [
                  {
                    id: 'reply-123',
                    content: '**balasan telah dihapus**',
                    date: '2021-08-08T07:59:48.766Z',
                    username: 'johndoe',
                  },
                  {
                    id: 'reply-xNBtm9HPR-492AeiimpfN',
                    content: 'sebuah balasan',
                    date: '2021-08-08T08:07:01.522Z',
                    username: 'dicoding',
                  },
                ],
                content: 'sebuah comment',
              },
              {
                id: 'comment-1234',
                username: 'dicoding',
                date: '2021-08-08T07:59:18.982Z',
                replies: [
                  {
                    id: 'reply-123',
                    content: '**balasan telah dihapus**',
                    date: '2021-08-08T07:59:48.766Z',
                    username: 'johndoe',
                  },
                  {
                    id: 'reply-xNBtm9HPR-492AeiimpfN',
                    content: 'sebuah balasan',
                    date: '2021-08-08T08:07:01.522Z',
                    username: 'dicoding',
                  },
                ],
                content: 'sebuah comment2',
              },
            ],
          })
        );

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      const actualResult = await threadUseCase.getThreadDetailsById(
        useCasePayload.threadId
      );

      expect(actualResult).toEqual(expectedResult);
      expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
        'thread-123'
      );
      expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
        'comment-123'
      );
    });
  });
});
