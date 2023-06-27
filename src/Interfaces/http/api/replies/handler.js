const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId, commentId } = request.params;
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const addedReply = await replyUseCase.addReply({
      content,
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { replyId, threadId, commentId } = request.params;

    const replyUseCase = this._container.getInstance(ReplyUseCase.name);

    await replyUseCase.deleteReply({
      replyId,
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = RepliesHandler;
