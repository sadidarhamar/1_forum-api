class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, commentId, replyId, owner,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.replyId = replyId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const {
      replyId, threadId, commentId, owner,
    } = payload;
    if (!replyId || !threadId || !commentId || !owner) {
      throw new Error(
        'DELETE_REPLY_USE_CASE.NOT_CONTAIN_REPLY_ID_OR_THREAD_ID_OR_COMMENT_ID_OR_OWNER',
      );
    }

    if (
      typeof replyId !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof owner !== 'string'
    ) {
      throw new Error(
        'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = DeleteReply;
