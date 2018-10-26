const env = require('./env-config.js');

module.exports = {
	presets: ['next/babel', '@babel/preset-env', '@babel/preset-react'],
	// presets: ['next/babel', '@babel/preset-env', 'stage-0'],
	plugins: [['transform-define', env], '@babel/plugin-transform-runtime'],
	// env: {
	//   test: {
	//     plugins: ['transform-es2015-modules-commonjs', 'dynamic-import-node'],
	//   },
	// },
};
