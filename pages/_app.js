import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import withReduxSaga from 'next-redux-saga';
import withReduxStore from '../app/withRedux';
import LanguageProvider from '../app/containers/LanguageProvider';
import { translationMessages } from '../app/i18n';

class CustomApp extends App {
	render() {
		const { Component, pageProps, reduxStore } = this.props;

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
