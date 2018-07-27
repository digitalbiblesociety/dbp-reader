// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
// const OfflinePlugin = require('offline-plugin');

module.exports = require('./webpack.base.babel')({
	// In production, we skip all hot-reloading stuff
	entry: [
		path.join(process.cwd(), 'app/app.js'), // Start with js/app.js
	],

	// Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[name].[chunkhash].chunk.js',
	},

	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			children: true,
			minChunks: 2,
			async: true,
		}),
		// Minify and optimize the index.html
		new HtmlWebpackPlugin({
			template: 'app/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
			inject: true,
		}),

		// Put it in the end to capture all the HtmlWebpackPlugin's
		// assets manipulations and do leak its manipulations to HtmlWebpackPlugin
		// new OfflinePlugin({
		// 	relativePaths: false,
		// 	// appShell: '/',
		// 	publicPath: '/',
		//
		// 	// No need to cache .htaccess. See http://mxs.is/googmp,
		// 	// this is applied before any match in `caches` section
		// 	excludes: ['.htaccess'],
		//
		// 	caches: {
		// 		main: [/:rest:|main|manifest|:externals:/],
		//
		// 		// All chunks marked as `additional`, loaded after main section
		// 		// and do not prevent SW to install. Change to `optional` if
		// 		// do not want them to be preloaded at all (cached only when first loaded)
		// 		additional: ['*.chunk.js'],
		// 	},
		// 	cacheMaps: [
		// 		{
		// 			match: function(requestUrl) {
		// 				return new URL('/', location);
		// 			},
		// 			requestTypes: ['navigate'],
		// 		},
		// 	],
		// 	// Removes warning for about `additional` section usage
		// 	safeToUseOptionalCaches: true,
		//
		// 	AppCache: false,
		// 	ServiceWorker: {
		// 		prefetchRequest: {
		// 			mode: 'cors',
		// 		},
		// 		minify: true,
		// 	},
		// 	externals: [
		// 		'https://fonts.googleapis.com/css?family=Noto+Sans|Alegreya|Roboto+Slab|Roboto:400,500',
		// 		`${process.env.BASE_API_ROUTE}/countries?key=${
		// 			process.env.DBP_API_KEY
		// 		}&v=4&bucket_id=${
		// 			process.env.DBP_BUCKET_ID
		// 		}&has_filesets=true&include_languages=true`,
		// 		`${process.env.BASE_API_ROUTE}/languages?key=${
		// 			process.env.DBP_API_KEY
		// 		}&v=4&bucket_id=${
		// 			process.env.DBP_BUCKET_ID
		// 		}&has_filesets=true&include_alt_names=true`,
		// 		`${process.env.BASE_API_ROUTE}/languages?key=${
		// 			process.env.DBP_API_KEY
		// 		}&v=4&bucket_id=${process.env.DBP_BUCKET_ID}&has_filesets=true`,
		// 		`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=${
		// 			process.env.FB_APP_ID
		// 		}&autoLogAppEvents=1`,
		// 		'https://apis.google.com/js/platform.js',
		// 		'http://localhost:3000/manifest.json',
		// 	],
		// }),
	],

	performance: {
		assetFilter: (assetFilename) =>
			!/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
	},
});
