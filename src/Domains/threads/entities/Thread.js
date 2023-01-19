
class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this._title = payload.title;
    this._body = payload.body;
    this._owner = payload.owner;
  }

  _verifyPayload(payload) {
    const {title, body, owner, comments} = payload;

    if (!title || !body || !owner) {
      console.log('destructrued fucked result ', {title, body, owner, comments});

      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = Thread;
