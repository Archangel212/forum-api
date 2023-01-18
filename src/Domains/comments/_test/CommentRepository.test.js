const CommentRepository = require('../CommentRepository');

describe('CommentRepository', ()=>{
  it('should throw an error for invoking unimplemented method', async ()=>{
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addCommentToThread('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.softDeleteComment('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
