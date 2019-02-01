const env = require('./env-config.js');

module.exports = {
	presets: ['next/babel'],
	plugins: ['lodash', ['transform-define', env]],
	env: {
		test: {
			presets: [
				'next/babel',
				['@babel/preset-env', { modules: false }],
				'@babel/preset-react',
			],
			plugins: [
				'lodash',
				['transform-define', env],
				'@babel/plugin-transform-runtime',
				'@babel/plugin-proposal-class-properties',
			],
		},
	},
};
