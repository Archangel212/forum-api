
module.exports = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThread,
    options: {
      auth: 'forum_api_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.addCommentToThread,
    options: {
      auth: 'forum_api_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadDetails,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentInAThread,
    options: {
      auth: 'forum_api_jwt',
    },
  },
];
