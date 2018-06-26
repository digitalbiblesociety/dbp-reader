/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
require('dotenv').config();
// const SitemapPlugin = require('sitemap-webpack-plugin').default;

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

module.exports = (options) => ({
	entry: options.entry,
	output: Object.assign(
		{
			// Compile into js/build.js
			path: path.resolve(process.cwd(), 'build'),
			publicPath: '/',
		},
		options.output,
	), // Merge with env dependent settings
	module: {
		rules: [
			{
				test: /\.js$/, // Transform all .js files required somewhere with Babel
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: options.babelQuery,
				},
			},
			{
				// Preprocess our own .css files
				// This is the place to add your own loaders (e.g. sass/less etc.)
				// for a list of loaders, see https://webpack.js.org/loaders/#styling
				test: /\.css$|\.scss$/,
				include: /app/,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				// Preprocess 3rd party .css files located in node_modules
				test: /\.css$/,
				include: /node_modules/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
				use: 'file-loader',
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							progressive: true,
							optimizationLevel: 7,
							interlaced: false,
							pngquant: {
								quality: '65-90',
								speed: 4,
							},
						},
					},
				],
			},
			{
				test: /\.html$/,
				use: 'html-loader',
			},
			{
				test: /(^manifest)\.json$/,
				use: 'json-loader',
			},
			{
				test: /manifest\.json/,
				use: 'file-loader',
			},
			{
				test: /\.(mp4|webm)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'images/[name].[ext]',
					},
				},
			},
		],
	},
	plugins: options.plugins.concat([
		new webpack.ProvidePlugin({
			// make fetch available
			fetch: 'exports-loader?self.fetch!whatwg-fetch',
		}),

		// Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
		// inside your code for any environment checks; UglifyJS will automatically
		// drop any unreachable code.
		// and any env variables here such as api keys
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
				DBP_API_KEY: JSON.stringify(process.env.DBP_API_KEY),
				BASE_API_ROUTE: JSON.stringify(process.env.BASE_API_ROUTE),
				FB_APP_ID: JSON.stringify(process.env.FB_APP_ID),
				FB_ACCESS: JSON.stringify(process.env.FB_ACCESS),
				NOTES_PROJECT_ID: JSON.stringify(process.env.NOTES_PROJECT_ID),
				DBP_BUCKET_ID: JSON.stringify(process.env.DBP_BUCKET_ID),
				GOOGLE_APP_ID: JSON.stringify(process.env.GOOGLE_APP_ID),
				GOOGLE_APP_ID_PROD: JSON.stringify(process.env.GOOGLE_APP_ID_PROD),
			},
		}),
		new webpack.NamedModulesPlugin(),
	]),
	resolve: {
		modules: ['app', 'node_modules'],
		extensions: ['.js', '.jsx', '.react.js'],
		mainFields: ['browser', 'jsnext:main', 'main'],
	},
	devtool: options.devtool,
	target: 'web', // Make web variables accessible to webpack, e.g. window
	performance: options.performance || {},
});
