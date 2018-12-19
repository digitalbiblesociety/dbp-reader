import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import getConfig from 'next/config';
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const bugsnagClient =
	process.env.NODE_ENV === 'production'
		? bugsnag({
				apiKey:
					serverRuntimeConfig.BUGSNAG_API_KEY ||
					publicRuntimeConfig.BUGSNAG_API_KEY,
		  })
		: { use: () => {}, notify: () => {}, getPlugin: () => {} };
bugsnagClient.use(bugsnagReact, React);

export default bugsnagClient;
