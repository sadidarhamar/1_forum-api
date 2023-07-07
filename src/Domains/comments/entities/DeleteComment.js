class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!commentId || !threadId || !owner) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID_OR_THREAD_ID_OR_OWNER',
      );
    }

    if (
      typeof commentId !== 'string'
      || typeof threadId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = DeleteComment;
