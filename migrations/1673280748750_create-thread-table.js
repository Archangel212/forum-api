/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {type: 'VARCHAR(50)', notNull: true, primaryKey: true},
    title: {type: 'TEXT', notNull: true},
    body: {type: 'TEXT', notNull: true},
    date_created: {type: 'TIMESTAMP', notNull: true},
    owner: {type: 'VARCHAR(50)', notNull: true},
    comment_id: {type: 'VARCHAR(50)', notNull: false},
  });

  pgm.addConstraint('threads', 'fk_threads.owner_users.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('threads', 'fk_threads.comment_id_comments.id',
      'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};

