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
import SettingsToggle from 'components/SettingsToggle/index';
import makeSelectSettings from './selectors';
import reducer from './reducer';
import {
	updateTheme,
	updateFontType,
	updateFontSize,
	toggleReadersMode,
	toggleCrossReferences,
	toggleRedLetter,
	toggleJustifiedText,
	toggleOneVersePerLine,
	toggleVerticalScrolling,
} from './actions';
// import messages from './messages';
// import { FormattedMessage } from 'react-intl';

// add icon for settings close button
export class Settings extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	updateTheme = ({ theme }) => this.props.dispatch(updateTheme({ theme }));
	updateFontType = ({ font }) => this.props.dispatch(updateFontType({ font }));
	updateFontSize = ({ size }) => this.props.dispatch(updateFontSize({ size }));
	toggleReadersMode = () => this.props.dispatch(toggleReadersMode());
	toggleCrossReferences = () => this.props.dispatch(toggleCrossReferences());
	toggleRedLetter = () => this.props.dispatch(toggleRedLetter());
	toggleJustifiedText = () => this.props.dispatch(toggleJustifiedText());
	toggleOneVersePerLine = () => this.props.dispatch(toggleOneVersePerLine());
	toggleVerticalScrolling = () => this.props.dispatch(toggleVerticalScrolling());
	toggle = {
		'READER\'S MODE': this.toggleReadersMode,
		'CROSS REFERENCE': this.toggleCrossReferences,
		'RED LETTER': this.toggleRedLetter,
		'JUSTIFIED TEXT': this.toggleJustifiedText,
		'ONE VERSE PER LINE': this.toggleOneVersePerLine,
		'VERTICAL SCROLLING': this.toggleVerticalScrolling,
	}

	render() {
		const {
			settingsToggleOptions,
		} = this.props.settings;
		return (

			<aside className="settings">
				<div>
					<h2>Settings</h2>
					<h2 className="settings-close-icon">X</h2>
				</div>
				<div className="color-schemes">
					<span className="option paper">
						<span className="title">Light</span>
					</span>
					<span className="option red">
						<span className="title">Default</span>
					</span>
					<span className="option dark">
						<span className="title">Night</span>
					</span>
				</div>
				<div className="font-settings">
					<span className="option sans">
						<span className="title">Sans Serif</span>
					</span>
					<span className="option serif">
						<span className="title">Serif</span>
					</span>
					<span className="option slab">
						<span className="title">Slab Serif</span>
					</span>
				</div>
				<div className="font-sizes">
					<span className="option smallest">Aa</span>
					<span className="option small">Aa</span>
					<span className="option medium">Aa</span>
					<span className="option large">Aa</span>
					<span className="option largest">Aa</span>
				</div>
				<div>option toggles</div>
				{
                    settingsToggleOptions.map((option) => <SettingsToggle name={option} action={this.toggle[option]} />)
                }
			</aside>
		);
	}
}

Settings.propTypes = {
	dispatch: PropTypes.func.isRequired,
	settings: PropTypes.object,
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
