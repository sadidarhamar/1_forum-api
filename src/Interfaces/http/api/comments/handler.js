const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId } = request.params;
    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    const addedComment = await commentUseCase.addComment({
      content,
      threadId,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { commentId, threadId } = request.params;

    const commentUseCase = this._container.getInstance(CommentUseCase.name);

    await commentUseCase.deleteComment({
      commentId,
      threadId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });

    return response;
  }
}

module.exports = CommentsHandler;
