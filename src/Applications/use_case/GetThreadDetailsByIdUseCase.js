class GetThreadDetailsByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    // const thread = await this._threadRepository.getThreadById(useCasePayload);
    // const comments = await this._commentRepository.getCommentsByThreadId(
    //   thread.id
    // );
    // const repliedComment = await Promise.all(
    //   comments.map(async (comment) => {
    //     const replies = await this._replyRepository.getRepliesByCommentId(
    //       comment.id
    //     );
    //     const filteredReplies = replies.map((replyObj) => {
    //       if (replyObj.is_delete) {
    //         return {
    //           id: replyObj.id,
    //           content: '**balasan telah dihapus**',
    //           date: replyObj.date,
    //           username: replyObj.username,
    //         };
    //       } else {
    //         return {
    //           id: replyObj.id,
    //           content: replyObj.content,
    //           date: replyObj.date,
    //           username: replyObj.username,
    //         };
    //       }
    //     });
    //     return {
    //       id: comment.id,
    //       username: comment.username,
    //       date: comment.date,
    //       replies: filteredReplies,
    //       content: comment.content,
    //     };
    //   })
    // );
    // const filteredComment = repliedComment
    //   .map((obj) => {
    //     if (obj.is_delete) {
    //       return {
    //         id: obj.id,
    //         username: obj.username,
    //         date: obj.date,
    //         content: '**komentar telah dihapus**',
    //         replies: obj.replies,
    //       };
    //     } else {
    //       return {
    //         id: obj.id,
    //         username: obj.username,
    //         date: obj.date,
    //         content: obj.content,
    //         replies: obj.replies,
    //       };
    //     }
    //   })
    //   .filter(({ is_delete }) => !is_delete);
    // return {
    //   ...thread,
    //   comments: filteredComment,
    // };
  }
}

module.exports = GetThreadDetailsByIdUseCase;
