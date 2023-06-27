const NewComment = require('../../Domains/comments/entities/NewComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadExist(newComment.threadId);
    return this._commentRepository.addComment(newComment);
  }

  async deleteComment(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    const { commentId, threadId, owner } = deleteComment;
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    await this._commentRepository.verifyCommentOwner({ commentId, owner });
    await this._commentRepository.deleteComment({ commentId, threadId });
  }
}

module.exports = CommentUseCase;
