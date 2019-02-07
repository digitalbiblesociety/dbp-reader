import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

const bugsnagClient =
	process.env.NODE_ENV === 'development'
		? { use: () => {}, notify: () => {}, getPlugin: () => {} }
		: bugsnag({
				apiKey: process.env.BUGSNAG_BROWSER_API_KEY,
		  });
bugsnagClient.use(bugsnagReact, React);

export default bugsnagClient;
