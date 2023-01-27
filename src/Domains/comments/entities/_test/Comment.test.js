
const Comment = require('../Comment');

describe('Comment entities', ()=>{
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
      date: new Date(),
      owner: 'dicoding',
      isDeleted: false,
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'abc',
      date: new Date(),
      owner: 123,
      isDeleted: 456,
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      date: new Date(),
      owner: 'user-123',
      isDeleted: true,
      threadId: 'thread-123',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.content).toEqual(payload.content);
    expect(comment.date).toEqual(payload.date);
    expect(comment.owner).toEqual(payload.owner);
    expect(comment.isDeleted).toEqual(payload.isDeleted);
    expect(comment.threadId).toEqual(payload.threadId);
  });
});
