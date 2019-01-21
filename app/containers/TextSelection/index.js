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
import CountryList from '../../components/CountryList';
import LanguageList from '../../components/LanguageList';
import VersionList from '../../components/VersionList';
import SvgWrapper from '../../components/SvgWrapper';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import { setActiveTextId, toggleVersionSelection } from '../HomePage/actions';
import {
	setVersionListState,
	setLanguageListState,
	setActiveIsoCode,
	setCountryListState,
	getTexts,
	getCountry,
	getCountries,
	getLanguages,
	setCountryName,
} from './actions';
import makeSelectTextSelection, {
	selectLanguages,
	selectTexts,
	selectCountries,
	selectHomepageData,
} from './selectors';
import messages from './messages';
/* eslint-disable jsx-a11y/no-static-element-interactions */
export class TextSelection extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		filterText: '',
	};

	componentDidMount() {
		if (this.props.active) {
			this.closeMenuController = new CloseMenuFunctions(
				this.ref,
				this.toggleVersionSelection,
			);
			this.closeMenuController.onMenuMount();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.active && !nextProps.active && this.closeMenuController) {
			this.closeMenuController.onMenuUnmount();
			// Might want to add !this.closeMenuController to the if below
		} else if (nextProps.active && !this.props.active) {
			this.closeMenuController = new CloseMenuFunctions(
				this.ref,
				this.toggleVersionSelection,
			);
			this.closeMenuController.onMenuMount();
		}

		if (
			nextProps.textselection.activeIsoCode !==
				this.props.textselection.activeIsoCode ||
			nextProps.textselection.activeLanguageCode !==
				this.props.textselection.activeLanguageCode
		) {
			this.props.dispatch(
				getTexts({
					languageISO: nextProps.textselection.activeIsoCode,
					languageCode: nextProps.textselection.activeLanguageCode,
				}),
			);
		} else if (
			nextProps.homepageData.initialIsoCode !==
			this.props.homepageData.initialIsoCode
		) {
			this.props.dispatch(
				getTexts({
					languageISO: nextProps.homepageData.initialIsoCode,
					languageCode: nextProps.homepageData.defaultLanguageCode,
				}),
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
		if (this.closeMenuController) {
			this.closeMenuController.onMenuUnmount();
		}
	}

	setRef = (node) => {
		this.ref = node;
	};

	setCountryListState = () => this.props.dispatch(setCountryListState());

	setActiveIsoCode = ({ iso, name, languageCode }) =>
		this.props.dispatch(setActiveIsoCode({ iso, name, languageCode }));

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props));

	setCountryName = ({ name, languages }) =>
		this.props.dispatch(setCountryName({ name, languages }));

	getCountry = (props) => this.props.dispatch(getCountry(props));

	getCountries = () => this.props.dispatch(getCountries());

	getLanguages = () => this.props.dispatch(getLanguages());

	get inputPlaceholder() {
		if (this.props.textselection.countryListActive) {
			return 'countryMessage';
		} else if (this.props.textselection.languageListActive) {
			return 'languageMessage';
		}

		return 'versionMessage';
	}

	stopClickProp = (e) => e.stopPropagation();

	stopTouchProp = (e) => e.stopPropagation();

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection());

	toggleLanguageList = () => this.props.dispatch(setLanguageListState());

	toggleVersionList = () => this.props.dispatch(setVersionListState());

	handleSearchInputChange = (e) =>
		this.setState({ filterText: e.target.value });

	render() {
		const {
			countryListActive,
			languageListActive,
			versionListActive,
			activeIsoCode,
			activeLanguageName,
			activeCountryName,
			activeLanguageCode,
			countryLanguages,
			loadingVersions,
			loadingCountries,
			loadingLanguages,
			finishedLoadingCountries,
		} = this.props.textselection;
		const { activeTextId } = this.props.homepageData;
		const { bibles, active, languages, countries } = this.props;
		const { filterText } = this.state;

		return (
			<aside
				style={{ display: active ? 'flex' : 'none' }}
				ref={this.setRef}
				onTouchEnd={this.stopTouchProp}
				onClick={this.stopClickProp}
				className={'text-selection-dropdown'}
			>
				<div className={'tab-options'}>
					<span
						id={'country-tab'}
						onClick={countryListActive ? () => {} : this.setCountryListState}
						className={countryListActive ? 'tab-option active' : 'tab-option'}
					>
						<FormattedMessage {...messages.country} />
					</span>
					<span
						id={'language-tab'}
						onClick={languageListActive ? () => {} : this.toggleLanguageList}
						className={languageListActive ? 'tab-option active' : 'tab-option'}
					>
						<FormattedMessage {...messages.language} />
					</span>
					<span
						id={'version-tab'}
						onClick={versionListActive ? () => {} : this.toggleVersionList}
						className={versionListActive ? 'tab-option active' : 'tab-option'}
					>
						<FormattedMessage {...messages.version} />
					</span>
				</div>
				<div className={'search-input-bar'}>
					<SvgWrapper className={'icon'} svgid={'search'} />
					<input
						id={'version-search'}
						onChange={this.handleSearchInputChange}
						value={filterText}
						className={'input-class'}
						placeholder={messages[this.inputPlaceholder].defaultMessage}
					/>
				</div>
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
				<LanguageList
					languages={languages}
					filterText={filterText}
					active={languageListActive}
					activeIsoCode={activeIsoCode}
					languageCode={activeLanguageCode}
					countryLanguages={countryLanguages}
					loadingLanguages={loadingLanguages}
					countryListActive={countryListActive}
					activeLanguageName={activeLanguageName}
					getLanguages={this.getLanguages}
					setActiveIsoCode={this.setActiveIsoCode}
					toggleVersionList={this.toggleVersionList}
					toggleLanguageList={this.toggleLanguageList}
					setCountryListState={this.setCountryListState}
				/>
				<VersionList
					bibles={bibles}
					filterText={filterText}
					active={versionListActive}
					activeTextId={activeTextId}
					loadingVersions={loadingVersions}
					setActiveText={this.setActiveTextId}
					toggleTextSelection={this.toggleVersionSelection}
				/>
			</aside>
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
	active: PropTypes.bool,
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

export default compose(withConnect)(TextSelection);
