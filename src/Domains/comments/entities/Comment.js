
class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    this._title = payload.title;
    this._body = payload.body;
    this._owner = payload.owner;
    this._comments = payload.comments;
  }

  _verifyPayload(payload) {
    const {title, body, owner, comments} = payload;

    if (!title || !body || !owner || (typeof comments === 'undefined' || !Array.isArray(comments))) {

      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = Comment;
