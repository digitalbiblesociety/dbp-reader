require('@babel/polyfill');
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const isProd = process.env.NODE_ENV === 'production';

if (process.env.ANALYZE_BUNDLE) {
	module.exports = withBundleAnalyzer({
		...withSass(
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
		),
		analyzeServer: ['server', 'both'].includes(process.env.ANALYZE_BUNDLE),
		analyzeBrowser: ['browser', 'both'].includes(process.env.ANALYZE_BUNDLE),
		bundleAnalyzerConfig: {
			server: {
				analyzerMode: 'static',
				reportFilename: '../bundles/server.html',
			},
			browser: {
				analyzerMode: 'static',
				reportFilename: '../bundles/client.html',
			},
		},
	});
} else if (isProd) {
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
