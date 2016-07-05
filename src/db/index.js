import mongoose from 'mongoose';

if (global.Promise) {
  mongoose.Promise = global.Promise;
}

export function register(server, options, next) {
  mongoose.connect(options.uri);

  server.expose('Types', mongoose.Types);

  const models = require('./models');

  Object.keys(models).forEach(model => {
    server.expose(model, models[model]);
  });

  mongoose.connection
    .on('error', next)
    .on('open', next);
}

register.attributes = {
  pkg: require('./package.json'),
};
