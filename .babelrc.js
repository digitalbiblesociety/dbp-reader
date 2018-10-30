const env = require('./env-config.js');

module.exports = {
	presets: ['next/babel'],
	plugins: [['transform-define', env]],
	env: {
		test: {
			presets: ['next/babel', '@babel/preset-env', '@babel/preset-react'],
			plugins: [['transform-define', env], '@babel/plugin-transform-runtime'],
		},
	},
};
