import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withReduxSaga from 'next-redux-saga';
import dynamic from 'next/dynamic';
import withReduxStore from '../app/withRedux';
import LanguageProvider from '../app/containers/LanguageProvider';
import { translationMessages } from '../app/i18n';
import Error from './_error';

const bugsnagClient =
	process.env.NODE_ENV === 'production' &&
	dynamic(() => import('../app/utils/bugsnagClient'));

const ErrorBounary = bugsnagClient && bugsnagClient.getPlugin('react');

class CustomApp extends App {
	render() {
		const { Component, pageProps, reduxStore } = this.props;
		if (bugsnagClient) {
			return (
				<ErrorBounary FallbackComponent={Error}>
					<Container>
						<Provider store={reduxStore}>
							<LanguageProvider messages={translationMessages}>
								<Component {...pageProps} />
							</LanguageProvider>
						</Provider>
					</Container>
				</ErrorBounary>
			);
		}
		return (
			<Container>
				<Provider store={reduxStore}>
					<LanguageProvider messages={translationMessages}>
						<Component {...pageProps} />
					</LanguageProvider>
				</Provider>
			</Container>
		);
	}
}

export default withReduxStore(withReduxSaga({ async: true })(CustomApp));
