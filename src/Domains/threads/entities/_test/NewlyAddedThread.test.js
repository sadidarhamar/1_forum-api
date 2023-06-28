const NewlyAddedThread = require('../NewlyAddedThread');

describe('a NewlyAddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'judul',
      owner: 'user-123',
    };

    expect(() => new NewlyAddedThread(payload)).toThrowError(
      'NEWLY_ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: true,
      owner: {},
    };

    expect(() => new NewlyAddedThread(payload)).toThrowError(
      'NEWLY_ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newlyAddedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      owner: 'user-123',
    };

    const newlyAddedThread = new NewlyAddedThread(payload);

    expect(newlyAddedThread.id).toEqual(payload.id);
    expect(newlyAddedThread.title).toEqual(payload.title);
    expect(newlyAddedThread.owner).toEqual(payload.owner);
  });
});
