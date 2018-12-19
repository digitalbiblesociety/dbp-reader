import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

const bugsnagClient =
	process.env.NODE_ENV === 'production'
		? bugsnag({
				apiKey: process.env.UGSNAG_BROWSER_API_KEY,
		  })
		: { use: () => {}, notify: () => {}, getPlugin: () => {} };
bugsnagClient.use(bugsnagReact, React);

export default bugsnagClient;
