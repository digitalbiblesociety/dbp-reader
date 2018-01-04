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
import menu from 'images/menu.svg';
import Slider from 'rc-slider/lib/Slider';
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
	state = {
		fontSize: 4,
	}
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
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
		}
	}

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
			activeTheme,
			activeFontSize,
			activeFontType,
		} = this.props.settings;
		const {
			toggleSettingsModal,
		} = this.props;

		return (
			<aside ref={this.setRef} className="settings">
				<header>
					<h2 className="section-title">Settings</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={toggleSettingsModal}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				<section className="color-schemes">
					<span role="button" tabIndex={0} onClick={() => this.updateTheme({ theme: 'paper' })} className={`option paper${activeTheme === 'paper' ? ' active' : ''}`}>
					</span>
					<span role="button" tabIndex={0} onClick={() => this.updateTheme({ theme: 'default' })} className={`option red${activeTheme === 'default' ? ' active' : ''}`}>
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
						settingsToggleOptions.map((option) => <SettingsToggle key={option} name={option} action={this.toggle[option]} />)
					}
				</section>
			</aside>
		);
	}
}

Settings.propTypes = {
	dispatch: PropTypes.func.isRequired,
	settings: PropTypes.object,
	toggleSettingsModal: PropTypes.func,
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
