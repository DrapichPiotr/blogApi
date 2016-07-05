const manifest = {
  server: {
    connections: {
      router: {
        stripTrailingSlash: true,
      },
    },
  },
  connections: [{
    address: '0.0.0.0',
    labels: ['user'],
    port: +process.env.PORT || 3000,
    routes: {
      cors: true,
      validate: {
        options: {
          stripUnknown: true,
        },
      },
      payload: {
        allow: ['application/json'],
      },
    },
  }],
  registrations: [
    {
      plugin: {
        register: './src/apps/user',
        options: {
          secret: 'totalySecret',
        },
      },
      options: {
        routes: {
          prefix: process.env.plugins_base_route_prefix || '/v1/user',
        },
        select: 'user',
      },
    },
    {
      plugin: {
        register: './src/db',
        options: {
          uri:
            'mongodb://localhost:27017/testdb',
        },
      },
    },
    {
      plugin: 'hapi-auth-jwt2',
    },
  ],
};

export default manifest;
