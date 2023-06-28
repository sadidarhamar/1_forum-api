const NewReply = require('../../Domains/replies/entities/NewReply');
const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class ReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async addReply(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.verifyThreadExist(newReply.threadId);
    await this._commentRepository.verifyCommentExist(newReply.commentId);
    return this._replyRepository.addReply(newReply);
  }

  async deleteReply(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    const { replyId, threadId, commentId, owner } = deleteReply;
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    await this._replyRepository.verifyReplyExist(replyId);
    await this._replyRepository.verifyReplyOwner({ replyId, owner });

    await this._replyRepository.deleteReply({ replyId, threadId, commentId });
  }
}

module.exports = ReplyUseCase;
