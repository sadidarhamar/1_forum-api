class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({ threadId, commentId }) {
    if (!commentId || !threadId) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID_OR_THREAD_ID'
      );
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string') {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteComment;
