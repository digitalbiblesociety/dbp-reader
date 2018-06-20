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
import SvgWrapper from 'components/SvgWrapper';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import Slider from 'rc-slider/lib/Slider';
import { toggleSettingsOption } from 'containers/HomePage/actions';
import {
	applyTheme,
	applyFontFamily,
	applyFontSize,
	toggleWordsOfJesus,
} from './themes';
import makeSelectSettings from './selectors';
import reducer from './reducer';
import {
	updateTheme,
	updateFontType,
	updateFontSize,
	// toggleReadersMode,
	// toggleCrossReferences,
	// toggleRedLetter,
	// toggleJustifiedText,
	// toggleOneVersePerLine,
	// toggleVerticalScrolling,
} from './actions';
// import messages from './messages';
// import { FormattedMessage } from 'react-intl';

// add icon for settings close button
export class Settings extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(
			this.ref,
			this.props.toggleSettingsModal,
		);
		this.closeMenuController.onMenuMount();
	}

	componentWillReceiveProps(nextProps) {
		const activeTheme = nextProps.userSettings.get('activeTheme');
		const activeFontFamily = nextProps.userSettings.get('activeFontType');
		const activeFontSize = nextProps.userSettings.get('activeFontSize');
		const redLetter = nextProps.userSettings.getIn([
			'toggleOptions',
			'redLetter',
			'active',
		]);

		if (
			redLetter !==
			this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])
		) {
			// console.log('red', redLetter);
			toggleWordsOfJesus(redLetter);
		}

		if (activeTheme !== this.props.userSettings.get('activeTheme')) {
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
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	};

	handleSliderChange = (position) => this.updateFontSize({ size: position });

	handleSettingsModalToggle = () => {
		// document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSettingsModal();
	};

	updateTheme = ({ theme }) => {
		this.props.dispatch(updateTheme({ theme }));
	};
	updateFontType = ({ font }) => this.props.dispatch(updateFontType({ font }));
	updateFontSize = ({ size }) => this.props.dispatch(updateFontSize({ size }));
	toggleSettingsOption = (props) => {
		const opposite =
			props.name === 'ONE VERSE PER LINE'
				? "READER'S MODE"
				: 'ONE VERSE PER LINE';
		const exclusivePath =
			props.name === 'ONE VERSE PER LINE' || props.name === "READER'S MODE"
				? this.toggle[opposite]
				: '';
		this.props.dispatch(
			toggleSettingsOption({
				...props,
				path: this.toggle[props.name],
				exclusivePath,
			}),
		);
	};
	// toggleReadersMode = () => this.props.dispatch(toggleReadersMode());
	// toggleCrossReferences = () => this.props.dispatch(toggleCrossReferences());
	// toggleRedLetter = () => this.props.dispatch(toggleRedLetter());
	// toggleJustifiedText = () => this.props.dispatch(toggleJustifiedText());
	// toggleOneVersePerLine = () => this.props.dispatch(toggleOneVersePerLine());
	// toggleVerticalScrolling = () => this.props.dispatch(toggleVerticalScrolling());
	toggle = {
		"READER'S MODE": ['userSettings', 'toggleOptions', 'readersMode', 'active'],
		'CROSS REFERENCE': [
			'userSettings',
			'toggleOptions',
			'crossReferences',
			'active',
		],
		'RED LETTER': ['userSettings', 'toggleOptions', 'redLetter', 'active'],
		'JUSTIFIED TEXT': [
			'userSettings',
			'toggleOptions',
			'justifiedText',
			'active',
		],
		'ONE VERSE PER LINE': [
			'userSettings',
			'toggleOptions',
			'oneVersePerLine',
			'active',
		],
		'VERTICAL SCROLLING': [
			'userSettings',
			'toggleOptions',
			'verticalScrolling',
			'active',
		],
	};

	render() {
		const activeTheme = this.props.userSettings.get('activeTheme');
		const activeFontSize = this.props.userSettings.get('activeFontSize');
		const activeFontType = this.props.userSettings.get('activeFontType');
		const toggleOptions = this.props.userSettings.get('toggleOptions');

		return (
			<GenericErrorBoundary affectedArea="Settings">
				<aside ref={this.setRef} className="settings">
					<header>
						<SvgWrapper
							className={'icon'}
							svgid={'arrow_right'}
							onClick={this.handleSettingsModalToggle}
						/>
						<SvgWrapper
							className={'icon'}
							svgid={'text_options'}
							onClick={this.handleSettingsModalToggle}
						/>
						<h1 className="section-title">Text Options</h1>
					</header>
					<div className={'settings-wrapper'}>
						<div className={'settings-content'}>
							<section className="color-schemes">
								{activeTheme === 'paper' ? (
									<SvgWrapper
										style={{ width: '55px', height: '55px' }}
										svgid={'light'}
									/>
								) : (
									<span
										role="button"
										tabIndex={0}
										onClick={() => this.updateTheme({ theme: 'paper' })}
										className={'option paper'}
									/>
								)}
								{activeTheme === 'dark' ? (
									<SvgWrapper
										style={{ width: '55px', height: '55px' }}
										svgid={'dark'}
									/>
								) : (
									<span
										role="button"
										tabIndex={0}
										onClick={() => this.updateTheme({ theme: 'dark' })}
										className={'option dark'}
									/>
								)}
								{activeTheme === 'red' ? (
									<SvgWrapper
										style={{ width: '55px', height: '55px' }}
										svgid={'red'}
									/>
								) : (
									<span
										role="button"
										tabIndex={0}
										onClick={() => this.updateTheme({ theme: 'red' })}
										className={'option red'}
									/>
								)}
							</section>
							<section className="font-settings">
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontType({ font: 'sans' })}
									className={`option sans${
										activeFontType === 'sans' ? ' active' : ''
									}`}
								>
									<span className="title">Aa</span>
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontType({ font: 'serif' })}
									className={`option serif${
										activeFontType === 'serif' ? ' active' : ''
									}`}
								>
									<span className="title">Aa</span>
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontType({ font: 'slab' })}
									className={`option slab${
										activeFontType === 'slab' ? ' active' : ''
									}`}
								>
									<span className="title">Aa</span>
								</span>
							</section>
							<section className="font-sizes">
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontSize({ size: 0 })}
									className={`option smallest${
										activeFontSize === 0 ? ' active' : ''
									}`}
								>
									Aa
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontSize({ size: 18 })}
									className={`option small${
										activeFontSize === 18 ? ' active' : ''
									}`}
								>
									Aa
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontSize({ size: 42 })}
									className={`option medium${
										activeFontSize === 42 ? ' active' : ''
									}`}
								>
									Aa
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontSize({ size: 69 })}
									className={`option large${
										activeFontSize === 69 ? ' active' : ''
									}`}
								>
									Aa
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={() => this.updateFontSize({ size: 100 })}
									className={`option largest${
										activeFontSize === 100 ? ' active' : ''
									}`}
								>
									Aa
								</span>
							</section>
							<Slider
								className="font-sizes-slider"
								onChange={this.handleSliderChange}
								defaultValue={activeFontSize}
								value={activeFontSize}
								handleStyle={{
									borderColor: 'rgb(98,177,130)',
									backgroundColor:
										activeTheme === 'paper'
											? 'rgba(98, 177, 130, .5)'
											: 'rgb(26,29,33)',
									top: '4px',
								}}
								railStyle={{
									backgroundColor:
										activeTheme === 'paper'
											? 'rgb(199, 199, 204)'
											: 'rgb(26,29,33)',
									height: '2px',
								}}
								trackStyle={{
									backgroundColor: 'rgb(98,177,130)',
									height: '2px',
								}}
								step={null}
								marks={{
									0: '',
									18: '',
									42: '',
									69: '',
									100: '',
								}}
								min={0}
								max={100}
							/>
							<section className="option-toggles">
								{toggleOptions
									.valueSeq()
									.map((option) => (
										<SettingsToggle
											key={option.get('name')}
											available={option.get('available')}
											checked={option.get('active')}
											name={option.get('name')}
											action={this.toggleSettingsOption}
										/>
									))}
							</section>
						</div>
					</div>
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

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'settings', reducer });

export default compose(
	withReducer,
	withConnect,
)(Settings);
