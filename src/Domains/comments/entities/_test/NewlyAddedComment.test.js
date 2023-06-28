const NewlyAddedComment = require('../NewlyAddedComment');

describe('a NewlyAddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'komentar',
      owner: 'user-123',
    };

    expect(() => new NewlyAddedComment(payload)).toThrowError(
      'NEWLY_ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: true,
      owner: {},
    };

    expect(() => new NewlyAddedComment(payload)).toThrowError(
      'NEWLY_ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newlyAddedComment object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'komentar',
      owner: 'user-123',
    };

    const newlyAddedComment = new NewlyAddedComment(payload);

    expect(newlyAddedComment.id).toEqual(payload.id);
    expect(newlyAddedComment.content).toEqual(payload.content);
    expect(newlyAddedComment.owner).toEqual(payload.owner);
  });
});
