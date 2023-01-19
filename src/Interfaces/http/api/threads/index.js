const ThreadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, {container}) => {
    server.route(routes(new ThreadsHandler(container)));
  },
};
