const Thread = require('../Thread');

describe('Thread entities', ()=>{
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: 'abc',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'just a title',
      body: 'a thread body',
      owner: 'user-123',
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread).toBeInstanceOf(Thread);
    expect(thread.content).toEqual(payload.content);
    expect(thread.date).toEqual(payload.date);
    expect(thread.owner).toEqual(payload.owner);
  });
});
