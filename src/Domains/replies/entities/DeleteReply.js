class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload(payload) {
    const { replyId, threadId, commentId } = payload;
    if (!replyId || !threadId || !commentId) {
      throw new Error(
        'DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID_OR_THREAD_ID_OR_COMMENT_ID'
      );
    }

    if (
      typeof replyId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof commentId !== 'string'
    ) {
      throw new Error(
        'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteReply;
