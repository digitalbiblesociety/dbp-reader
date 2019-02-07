/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import LanguageProvider from '../app/containers/LanguageProvider';
import { translationMessages } from '../app/i18n';
import SvgWrapper from '../app/components/SvgWrapper';
import messages from '../app/containers/NotFoundPage/messages';
import '../static/app.scss';
import configureStore from '../app/configureStore';
import bugsnagClient from '../app/utils/bugsnagClient';

export default class Error extends React.Component {
	static async getInitialProps({ res, err }) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null; // eslint-disable-line
		if (
			err &&
			(process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging')
		) {
			bugsnagClient.notify(err);
		}

		return { statusCode };
	}

	render() {
		const store = configureStore({}, {}, {});
		return (
			<Provider store={store}>
				<LanguageProvider messages={translationMessages}>
					<div className={'not-found'}>
						<div className={'top-bar'}>
							<a
								className="logo"
								href={'http://www.bible.is'}
								title={'http://www.bible.is'}
								target={'_blank'}
								rel={'noopener'}
							>
								<SvgWrapper className="svg" svgid={'bible.is_logo'} />
							</a>
						</div>
						<div className={'content'}>
							<h1 className={'header'}>
								<FormattedMessage {...messages.headermessage} />
							</h1>
							<FormattedMessage {...messages.cause} />
							<ul>
								<li>
									<FormattedMessage {...messages.technical} />
								</li>
								<li>
									<FormattedMessage {...messages.moved} />
								</li>
								<li>
									<FormattedMessage {...messages.clickedOld} />
								</li>
								<li>
									<FormattedMessage {...messages.accident} />
								</li>
							</ul>
							<FormattedMessage {...messages.youDo} />
							<ul>
								<li>
									<FormattedMessage {...messages.browser} />
								</li>
								<li>
									<FormattedMessage {...messages.tryAgain} />
								</li>
								<li>
									<FormattedMessage {...messages.homePage} />
									<a href={'http://www.bible.is'}>
										<FormattedMessage {...messages.homePageLink} />
									</a>
								</li>
							</ul>
							<FormattedMessage {...messages.weKnow} />
						</div>
						<div className={'bottom-bar'} />
					</div>
				</LanguageProvider>
			</Provider>
		);
	}
}
