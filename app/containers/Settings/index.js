/**
 *
 * Settings
 *
 * NOTE: The <Slider /> component requires inline styles to be passed into it
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import SettingsToggle from 'components/SettingsToggle/index';
import menu from 'images/menu.svg';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import Slider from 'rc-slider/lib/Slider';
import { applyTheme, applyFontFamily, applyFontSize, toggleWordsOfJesus } from './themes';
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
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillReceiveProps(nextProps) {
		const activeTheme = nextProps.userSettings.get('activeTheme');
		const activeFontFamily = nextProps.userSettings.get('activeFontType');
		const activeFontSize = nextProps.userSettings.get('activeFontSize');
		const redLetter = nextProps.userSettings.getIn(['toggleOptions', 'redLetter', 'active']);

		if (redLetter !== this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])) {
			toggleWordsOfJesus(redLetter);
		}

		if (activeTheme !== this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])) {
			applyTheme(activeTheme);
		}

		if (activeFontFamily !== this.props.userSettings.get('activeFontType')) {
			applyFontFamily(activeFontFamily);
		}

		if (activeFontSize !== this.props.userSettings.get('activeFontSize')) {
			applyFontSize(activeFontSize);
		}
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	handleSliderChange = (position) => this.updateFontSize({ size: position })

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleSettingsModal();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	handleSettingsModalToggle = () => {
		document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSettingsModal();
	}

	updateTheme = ({ theme }) => {
		this.props.dispatch(updateTheme({ theme }));
	}
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
		const activeTheme = this.props.userSettings.get('activeTheme');
		const activeFontSize = this.props.userSettings.get('activeFontSize');
		const activeFontType = this.props.userSettings.get('activeFontType');
		const toggleOptions = this.props.userSettings.get('toggleOptions');

		return (
			<GenericErrorBoundary affectedArea="Settings">
				<aside ref={this.setRef} className="menu-sidebar settings">
					<header>
						<h2 className="section-title">Settings</h2>
						<span role="button" tabIndex={0} className="close-icon" onClick={this.handleSettingsModalToggle}>
							<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
						</span>
					</header>
					<section className="color-schemes">
						<span role="button" tabIndex={0} onClick={() => this.updateTheme({ theme: 'paper' })} className={`option paper${activeTheme === 'paper' ? ' active' : ''}`}>
						</span>
						<span role="button" tabIndex={0} onClick={() => this.updateTheme({ theme: 'red' })} className={`option red${activeTheme === 'red' ? ' active' : ''}`}>
						</span>
						<span role="button" tabIndex={0} onClick={() => this.updateTheme({ theme: 'dark' })} className={`option dark${activeTheme === 'dark' ? ' active' : ''}`}>
						</span>
					</section>
					<section className="font-settings">
						<span role="button" tabIndex={0} onClick={() => this.updateFontType({ font: 'sans' })} className={`option sans${activeFontType === 'sans' ? ' active' : ''}`}>
							<span className="title">Aa <small>Sans Serif</small></span>
						</span>
						<span role="button" tabIndex={0} onClick={() => this.updateFontType({ font: 'serif' })} className={`option serif${activeFontType === 'serif' ? ' active' : ''}`}>
							<span className="title">Aa <small>Serif</small></span>
						</span>
						<span role="button" tabIndex={0} onClick={() => this.updateFontType({ font: 'slab' })} className={`option slab${activeFontType === 'slab' ? ' active' : ''}`}>
							<span className="title">Aa <small>Slab Serif</small></span>
						</span>
					</section>
					<section className="font-sizes">
						<span role="button" tabIndex={0} onClick={() => this.updateFontSize({ size: 1 })} className={`option smallest${activeFontSize === 1 ? ' active' : ''}`}>Aa</span>
						<span role="button" tabIndex={0} onClick={() => this.updateFontSize({ size: 2 })} className={`option small${activeFontSize === 2 ? ' active' : ''}`}>Aa</span>
						<span role="button" tabIndex={0} onClick={() => this.updateFontSize({ size: 3 })} className={`option medium${activeFontSize === 3 ? ' active' : ''}`}>Aa</span>
						<span role="button" tabIndex={0} onClick={() => this.updateFontSize({ size: 4 })} className={`option large${activeFontSize === 4 ? ' active' : ''}`}>Aa</span>
						<span role="button" tabIndex={0} onClick={() => this.updateFontSize({ size: 5 })} className={`option largest${activeFontSize === 5 ? ' active' : ''}`}>Aa</span>
					</section>
					<Slider className="font-sizes-slider" onChange={this.handleSliderChange} defaultValue={activeFontSize} value={activeFontSize} handleStyle={{ border: 'none', backgroundColor: 'rgb(98,177,130)' }} railStyle={{ backgroundColor: 'rgb(26,29,33)' }} trackStyle={{ backgroundColor: 'rgb(98,177,130)' }} step={1} min={1} max={5} />
					<section className="option-toggles">
						{
							toggleOptions.valueSeq().map((option) => (<SettingsToggle key={option.get('name')} checked={option.get('active')} name={option.get('name')} action={this.toggle[option.get('name')]} />))
						}
					</section>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

Settings.propTypes = {
	dispatch: PropTypes.func.isRequired,
	userSettings: PropTypes.object.isRequired,
	toggleSettingsModal: PropTypes.func.isRequired,
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
