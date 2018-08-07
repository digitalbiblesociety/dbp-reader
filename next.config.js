const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config');
module.exports = withSass(
	withCss({
		webpack(config) {
			// config.module.rules.push({ test: /\.svg$/, loader: ['file-loader'] });
			return commonsChunkConfig(config, /\.(sass|scss|css)$/);
		},
	}),
);
