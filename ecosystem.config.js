module.exports = {
	apps: [
		{
			name: 'bible.is.one',
			script: './nextServer.js',
			instances: 2,
			env: {
				NODE_ENV: 'development',
				PORT: 3000,
			},
			env_production: {
				NODE_ENV: 'production',
				PORT: 3000,
			},
		},
		// {
		// 	name: 'bible.is.two',
		// 	script: './nextServer.js',
		// 	env: {
		// 		NODE_ENV: 'development',
		// 		PORT: 3001,
		// 	},
		// 	env_production: {
		// 		NODE_ENV: 'production',
		// 		PORT: 3001,
		// 	},
		// },
	],
};
