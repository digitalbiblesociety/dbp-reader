const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
// const childProcess = require('child_process');
// const promisify = require('util').promisify;
// const execPromise = promisify(childProcess.exec);
const isProd = process.env.NODE_ENV === 'production';

// const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config');
if (isProd) {
	module.exports = withSass(
		withCss({
			generateBuildId: async () => {
				// let hash = '';
				// await execPromise('git rev-parse HEAD').then((res) => {
				// 	hash = res.stdout;
				// });
				// return hash;
				return process.env.BUILD_ID;
			},
		}),
	);
} else {
	module.exports = withSass(withCss());
}
