/**
 *
 * Settings
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import makeSelectSettings from './selectors';
import reducer from './reducer';
import {
	updateTheme,
	updateFontType,
	updateFontSize,
	saveSettings,
	undoSettings,
} from './actions';
// import messages from './messages';
// import { FormattedMessage } from 'react-intl';

// add icon for settings close button
export class Settings extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	updateTheme = ({ theme }) => this.props.dispatch(updateTheme({ theme }));
	updateFontType = ({ font }) => this.props.dispatch(updateFontType({ font }));
	updateFontSize = ({ size }) => this.props.dispatch(updateFontSize({ size }));
	saveSettings = () => this.props.dispatch(saveSettings());
	undoSettings = () => this.props.dispatch(undoSettings());

	render() {
		return (
			<div>
				<div>
					<h2>Settings</h2>
					<h2 className="settings-close-icon">X</h2>
				</div>
				<div>
          theme changes
        </div>
				<div>
          font selector
        </div>
				<div>
          font size
        </div>
				<div>
          option toggles
        </div>
			</div>
		);
	}
}

Settings.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	settings: makeSelectSettings(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'settings', reducer });

export default compose(
  withReducer,
  withConnect,
)(Settings);
