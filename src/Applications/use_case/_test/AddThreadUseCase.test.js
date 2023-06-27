const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewlyAddedThread = require('../../../Domains/threads/entities/NewlyAddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
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

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const newlyAddedThread = await getThreadUseCase.execute(useCasePayload);

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
