// Needed to make process variables available in nextjs
require('dotenv').config();

module.exports = {
	'process.env': {
		NODE_ENV: process.env.NODE_ENV,
		DBP_API_KEY: process.env.DBP_API_KEY,
		BASE_API_ROUTE: process.env.BASE_API_ROUTE,
		FB_APP_ID: process.env.FB_APP_ID,
		FB_ACCESS: process.env.FB_ACCESS,
		NOTES_PROJECT_ID: process.env.NOTES_PROJECT_ID,
		DBP_BUCKET_ID: process.env.DBP_BUCKET_ID,
		GOOGLE_APP_ID: process.env.GOOGLE_APP_ID,
		GOOGLE_APP_ID_PROD: process.env.GOOGLE_APP_ID_PROD,
		DEVELOPMENT_PROJECT_ID: process.env.DEVELOPMENT_PROJECT_ID,
		CDN_STATIC_FILES: process.env.CDN_STATIC_FILES,
		IS_DEV: process.env.IS_DEV,
		BUGSNAG_SERVER_API_KEY: process.env.BUGSNAG_SERVER_API_KEY,
		BUGSNAG_BROWSER_API_KEY: process.env.BUGSNAG_BROWSER_API_KEY,
		NEWRELIC_BROWSER_LICENSE_KEY: process.env.NEWRELIC_BROWSER_LICENSE_KEY,
		NEWRELIC_BROWSER_PROD_ID: process.env.NEWRELIC_BROWSER_PROD_ID,
		NEWRELIC_BROWSER_STAGE_ID: process.env.NEWRELIC_BROWSER_STAGE_ID,
		NEWRELIC_STAGE_ID: process.env.NEWRELIC_STAGE_ID,
		NEWRELIC_BROWSER_DEV_ID: process.env.NEWRELIC_BROWSER_DEV_ID,
	},
};
