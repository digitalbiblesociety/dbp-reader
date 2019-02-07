const React = require('react');
const bugsnag = require('@bugsnag/js');
const bugsnagReact = require('@bugsnag/plugin-react');

const bugsnagClient =
	process.env.NODE_ENV === 'development'
		? { use: () => {}, notify: () => {}, getPlugin: () => {} }
		: bugsnag({
				apiKey: process.env.BUGSNAG_SERVER_API_KEY,
		  });
bugsnagClient.use(bugsnagReact, React);

module.exports = bugsnagClient;
