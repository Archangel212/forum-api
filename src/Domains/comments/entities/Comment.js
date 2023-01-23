
class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
    this.date = payload.date;
    this.owner = payload.owner;
    this.isDeleted = payload.isDeleted;
    this.threadId = payload.threadId;
  }

  _verifyPayload(payload) {
    const {content, date, owner, isDeleted, threadId} = payload;

    if (!content || !date || !owner || isDeleted === undefined || !threadId) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || !(date instanceof Date) || typeof owner !== 'string' ||
    typeof isDeleted !== 'boolean' || typeof threadId != 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
