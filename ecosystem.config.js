module.exports = {
  apps: [
    {
      name: 'bible.is.production',
      script: './nextServer.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'bible.is.development',
      script: './nextServer.js',
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'bible.is.staging',
      script: './nextServer.js',
      instances: 1,
      env: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
    },
  ],
};
