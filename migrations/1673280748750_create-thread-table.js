/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {type: 'VARCHAR(50)', notNull: true, primaryKey: true},
    title: {type: 'TEXT', notNull: true},
    body: {type: 'TEXT', notNull: true},
    owner: {type: 'VARCHAR(50)', notNull: true},
    comments: {type: 'VARCHAR(50)', notNull: true},
  });

  pgm.addConstraint('threads', 'fk_threads.owner_users.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('threads', 'fk_threads.comments_comments.id',
      'FOREIGN KEY(comments) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};

