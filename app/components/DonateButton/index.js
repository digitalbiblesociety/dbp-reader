/**
 *
 * DonateButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import injectReducer from '../../utils/injectReducer';
import messages from './messages';
import SvgWrapper from '../SvgWrapper';
import { selectActiveTheme } from '../../containers/Settings/selectors';
import settingsReducer from '../../containers/Settings/reducer';
// Use below for source before pushing to dev/prod
function DonateButton({ theme }) {
	return (
		<a
			target={'_blank'}
			href={'https://www.faithcomesbyhearing.com/donate/form/183'}
			className={'donate-button'}
		>
			<span className={'donate-svg-wrapper'}>
				<SvgWrapper
					svgid={theme === 'paper' ? 'donate_dark' : 'donate_light'}
				/>
			</span>
			<FormattedMessage {...messages.donate} />
		</a>
	);
}

DonateButton.propTypes = {
	theme: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
	theme: selectActiveTheme(),
});

const withConnect = connect(mapStateToProps);
const withRedux = injectReducer({ key: 'settings', reducer: settingsReducer });

export default compose(
	withConnect,
	withRedux,
)(DonateButton);
