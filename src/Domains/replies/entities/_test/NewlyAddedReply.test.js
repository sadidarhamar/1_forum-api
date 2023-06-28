const NewlyAddedReply = require('../NewlyAddedReply');

describe('a NewlyAddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'balasan komentar',
      owner: 'user-123',
    };

    expect(() => new NewlyAddedReply(payload)).toThrowError(
      'NEWLY_ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: true,
      owner: {},
    };

    expect(() => new NewlyAddedReply(payload)).toThrowError(
      'NEWLY_ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newlyAddedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan komentar',
      owner: 'user-123',
    };

    const newlyAddedReply = new NewlyAddedReply(payload);

    expect(newlyAddedReply.id).toEqual(payload.id);
    expect(newlyAddedReply.content).toEqual(payload.content);
    expect(newlyAddedReply.owner).toEqual(payload.owner);
  });
});
