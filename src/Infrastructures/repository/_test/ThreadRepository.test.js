const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread into thread table', async ()=>{
      await UsersTableTestHelper.addUser({id: 'user-123'});
      const thread = {
        title: 'sample-thread',
        body: 'just a sample',
        owner: 'user-123',
        comments: [],
      };
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(thread);

      const threads = await ThreadsTableHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });
});
