const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      titletest: 'abc',
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: true,
      content: 123,
      owner: true,
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newThread object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      content: 'komen pembelajaran mengenai materi backend',
      owner: 'testing',
    };

    const { threadId, content, owner } = new NewComment(payload);

    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
