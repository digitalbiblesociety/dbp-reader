/**
 *
 * TextSelection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
// import injectSaga from 'utils/injectSaga';
// import injectReducer from 'utils/injectReducer';
import CountryList from 'components/CountryList';
import LanguageList from 'components/LanguageList';
import VersionList from 'components/VersionList';
import SvgWrapper from 'components/SvgWrapper';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import {
	setActiveTextId,
	toggleVersionSelection,
} from 'containers/HomePage/actions';
import {
	setVersionListState,
	setLanguageListState,
	setActiveIsoCode,
	setCountryListState,
	getTexts,
	getCountry,
	getCountries,
	setCountryName,
} from './actions';
import makeSelectTextSelection, {
	selectLanguages,
	selectTexts,
	selectCountries,
	selectHomepageData,
} from './selectors';
// import reducer from './reducer';
// import saga from './saga';
import messages from './messages';
/* eslint-disable jsx-a11y/no-static-element-interactions */
export class TextSelection extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		filterText: '',
	};

	componentDidMount() {
		this.props.dispatch(
			setActiveIsoCode({
				iso: this.props.homepageData.initialIsoCode,
				name: this.props.homepageData.initialLanguageName,
			}),
		);
		this.closeMenuController = new CloseMenuFunctions(
			this.ref,
			this.toggleVersionSelection,
		);
		this.closeMenuController.onMenuMount();
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.textselection.activeIsoCode !==
			this.props.textselection.activeIsoCode
		) {
			this.props.dispatch(
				getTexts({ languageISO: nextProps.textselection.activeIsoCode }),
			);
		} else if (
			nextProps.homepageData.initialIsoCode !==
			this.props.homepageData.initialIsoCode
		) {
			this.props.dispatch(
				getTexts({ languageISO: nextProps.homepageData.initialIsoCode }),
			);
		}

		if (
			nextProps.textselection.versionListActive !==
				this.props.textselection.versionListActive ||
			nextProps.textselection.countryListActive !==
				this.props.textselection.countryListActive ||
			nextProps.textselection.languageListActive !==
				this.props.textselection.languageListActive
		) {
			this.setState({ filterText: '' });
		}
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	};

	setCountryListState = () => this.props.dispatch(setCountryListState());

	setActiveIsoCode = ({ iso, name }) =>
		this.props.dispatch(setActiveIsoCode({ iso, name }));

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props));

	setCountryName = ({ name, languages }) =>
		this.props.dispatch(setCountryName({ name, languages }));

	getCountry = (props) => this.props.dispatch(getCountry(props));

	getCountries = () => this.props.dispatch(getCountries());

	getActiveTab() {
		const {
			activeIsoCode,
			languageListActive,
			versionListActive,
			activeLanguageName,
			countryListActive,
			activeCountryName,
			countryLanguages,
			loadingCountries,
			loadingLanguages,
			loadingVersions,
			finishedLoadingCountries,
		} = this.props.textselection;
		const { activeTextName, activeTextId } = this.props.homepageData;
		const { bibles, languages, countries } = this.props;
		const { filterText } = this.state;

		if (languageListActive) {
			return (
				<LanguageList
					languages={languages}
					filterText={filterText}
					active={languageListActive}
					activeIsoCode={activeIsoCode}
					countryLanguages={countryLanguages}
					loadingLanguages={loadingLanguages}
					countryListActive={countryListActive}
					activeLanguageName={activeLanguageName}
					setActiveIsoCode={this.setActiveIsoCode}
					toggleVersionList={this.toggleVersionList}
					toggleLanguageList={this.toggleLanguageList}
					setCountryListState={this.setCountryListState}
				/>
			);
		} else if (countryListActive) {
			return (
				<CountryList
					countries={countries}
					filterText={filterText}
					active={countryListActive}
					loadingCountries={loadingCountries}
					activeCountryName={activeCountryName}
					finishedLoadingCountries={finishedLoadingCountries}
					setCountryName={this.setCountryName}
					getCountry={this.getCountry}
					getCountries={this.getCountries}
					toggleVersionList={this.toggleVersionList}
					toggleLanguageList={this.toggleLanguageList}
					setCountryListState={this.setCountryListState}
				/>
			);
		}
		return (
			<VersionList
				bibles={bibles}
				filterText={filterText}
				active={versionListActive}
				activeIsoCode={activeIsoCode}
				activeTextId={activeTextId}
				activeTextName={activeTextName}
				loadingVersions={loadingVersions}
				setActiveText={this.setActiveTextId}
				toggleVersionList={this.toggleVersionList}
				toggleLanguageList={this.toggleLanguageList}
				setCountryListState={this.setCountryListState}
				toggleTextSelection={this.toggleVersionSelection}
			/>
		);
	}

	stopClickProp = (e) => e.stopPropagation();

	stopTouchProp = (e) => e.stopPropagation();

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection());

	toggleLanguageList = () => this.props.dispatch(setLanguageListState());

	toggleVersionList = () => this.props.dispatch(setVersionListState());

	// handleVersionSelectionToggle = () => {
	// 	document.removeEventListener('click', this.handleClickOutside);
	//
	// 	this.toggleVersionSelection();
	// }

	handleSearchInputChange = (e) =>
		this.setState({ filterText: e.target.value });

	get inputPlaceholder() {
		if (this.props.textselection.countryListActive) {
			return 'countryMessage';
		} else if (this.props.textselection.languageListActive) {
			return 'languageMessage';
		}

		return 'versionMessage';
	}

	render() {
		const {
			countryListActive,
			languageListActive,
			versionListActive,
		} = this.props.textselection;
		const { filterText } = this.state;

		return (
			<GenericErrorBoundary affectedArea="TextSelection">
				<aside
					ref={this.setRef}
					onTouchEnd={this.stopTouchProp}
					onClick={this.stopClickProp}
					className="text-selection-dropdown"
				>
					<div className={'search-input-bar'}>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<input
							onChange={this.handleSearchInputChange}
							value={filterText}
							className={'input-class'}
							placeholder={messages[this.inputPlaceholder].defaultMessage}
						/>
					</div>
					<div className={'tab-options'}>
						<span
							onClick={countryListActive ? () => {} : this.setCountryListState}
							className={countryListActive ? 'tab-option active' : 'tab-option'}
						>
							<FormattedMessage {...messages.country} />
						</span>
						<span
							onClick={languageListActive ? () => {} : this.toggleLanguageList}
							className={
								languageListActive ? 'tab-option active' : 'tab-option'
							}
						>
							<FormattedMessage {...messages.language} />
						</span>
						<span
							onClick={versionListActive ? () => {} : this.toggleVersionList}
							className={versionListActive ? 'tab-option active' : 'tab-option'}
						>
							<FormattedMessage {...messages.version} />
						</span>
					</div>
					{this.getActiveTab(filterText)}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

TextSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bibles: PropTypes.object,
	languages: PropTypes.array,
	countries: PropTypes.object,
	textselection: PropTypes.object,
	homepageData: PropTypes.object,
	// getAudio: PropTypes.func,
	// setActiveText: PropTypes.func,
	// toggleVersionSelection: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	textselection: makeSelectTextSelection(),
	languages: selectLanguages(),
	bibles: selectTexts(),
	countries: selectCountries(),
	homepageData: selectHomepageData(),
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

// const withReducer = injectReducer({ key: 'textSelection', reducer });
// const withSaga = injectSaga({ key: 'textSelection', saga });

export default compose(
	// withReducer,
	// withSaga,
	withConnect,
)(TextSelection);
