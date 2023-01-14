
module.exports = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThread(request, h),
  },
];
