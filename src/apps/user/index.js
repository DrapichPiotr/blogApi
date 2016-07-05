
export function register(server, options, next) {
  // eslint-disable-next-line func-names
  server.handler('async', (route, handler) => function (request, reply) {
    handler.bind(this)(request, reply).catch(reply);
  });

  server.dependency(['hapi-auth-jwt2', 'db'], (serv, nxt) => {
    setupClient(serv, options, nxt); // eslint-disable-line no-use-before-define
  });

  next();
}

function setupClient(server, options, next) {
  const { db } = server.plugins;

  server.bind({
    ...server.plugins,
    options,
  });

  server.auth.strategy('user-token', 'jwt', {
    key: options.secret,
    validateFunc: (token, _, callback) => {
      db.User
        .getBy({ _id: token.id })
        .then(user => {
          if (!user || token.iat < user.changePasswordDate) {
            return callback(null, false);
          }
          callback(null, true, user);
        })
        .catch(err => callback(err, false, null));
    },
  });

  server.auth.strategy('admin-token', 'jwt', {
    key: options.secret,
    validateFunc: (token, _, callback) => {
      db.User
        .getBy({ _id: token.id })
        .then(user => {
          if (!user || token.iat < user.changePasswordDate || !user.roles.includes('admin')) {
            return callback(null, false);
          }
          callback(null, true, user);
        })
        .catch(err => callback(err, false, null));
    },
  });


  server.route(require('./auth').default);
  server.route(require('./default').default);

  next();
}

register.attributes = {
  pkg: require('./package.json'),
};
