const Thread = require('../Thread');

describe('Thread entities', ()=>{
  it('should throw an error for not containing needed properties', ()=>{
    const payload = {title: 'a', body: 'b', comments: ['a', 'b']};
    expect(()=>new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});
