import Glue from 'glue';
import manifest from './manifest';

Glue.compose(manifest, { relativeTo: process.cwd() }, (err, server) => {
  if (err) return console.log(err);

  server.start(() => {
    server.connections.forEach(conn => console.log(conn.info.uri));
  });
});
