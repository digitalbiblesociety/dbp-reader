require('@babel/polyfill');
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
	module.exports = withSass(
		withCss({
			webpack: (config) => {
				const originalEntry = config.entry;
				/* eslint-disable no-param-reassign */
				config.entry = async () => {
					const entries = await originalEntry();

					if (
						entries['main.js'] &&
						!entries['main.js'].includes('./app/utils/polyfills.js')
					) {
						entries['main.js'].unshift('./app/utils/polyfills.js');
					}

					return entries;
				};
				/* eslint-enable no-param-reassign */
				return config;
			},
			generateBuildId: async () => process.env.BUILD_ID,
		}),
	);
} else {
	module.exports = withSass(
		withCss({
			webpack: (config) => {
				const originalEntry = config.entry;
				/* eslint-disable no-param-reassign */
				config.entry = async () => {
					const entries = await originalEntry();

					if (
						entries['main.js'] &&
						!entries['main.js'].includes('./app/utils/polyfills.js')
					) {
						entries['main.js'].unshift('./app/utils/polyfills.js');
					}

					return entries;
				};
				/* eslint-enable no-param-reassign */
				return config;
			},
		}),
	);
}
