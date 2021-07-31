module.exports = {
  apps: [
    {
      name: 'bible.is.production',
      script: './nextServer.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 8082,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8082,
      },
    },
    {
      name: 'bible.is.development',
      script: './nextServer.js',
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 8082,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8082,
      },
    },
    {
      name: 'bible.is.staging',
      script: './nextServer.js',
      instances: 1,
      env: {
        NODE_ENV: 'staging',
        PORT: 8082,
      },
      env_production: {
        NODE_ENV: 'staging',
        PORT: 8082,
      },
    },
  ],
};
