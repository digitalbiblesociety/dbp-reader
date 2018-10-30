module.exports = {
	apps: [
		{
			name: 'bible.is.prod',
			script: './nextServer.js',
			instances: 'max',
			env_production: {
				NODE_ENV: 'production',
				PORT: 3000,
			},
		},
		{
			name: 'bible.is.dev',
			script: './nextServer.js',
			instances: 'max',
			env: {
				NODE_ENV: 'development',
				PORT: 3001,
			},
			env_production: {
				NODE_ENV: 'production',
				PORT: 3001,
			},
		},
	],
};
