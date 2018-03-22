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
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
/* eslint-disable jsx-a11y/no-static-element-interactions */
export class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// TODO: use a conditional to ensure the actions below only happen on the first mount
		// move these calls to CDM of homepage to ensure they are loaded by the time the user is here
		// if (this.props.firstLoad) {
		// 	this.props.dispatch(getCountries());
		// 	this.props.dispatch(getLanguages());
		// 	this.props.dispatch(getTexts({ languageISO: this.props.initialIsoCode }));
		// 	this.props.toggleFirstLoadForTextSelection();
		// }
		this.props.dispatch(setActiveIsoCode({ iso: this.props.homepageData.initialIsoCode, name: this.props.homepageData.initialLanguageName }));
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.toggleVersionSelection);
		this.closeMenuController.onMenuMount();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.textselection.activeIsoCode !== this.props.textselection.activeIsoCode) {
			this.props.dispatch(getTexts({ languageISO: nextProps.textselection.activeIsoCode }));
		} else if (nextProps.homepageData.initialIsoCode !== this.homepageData.props.initialIsoCode) {
			this.props.dispatch(getTexts({ languageISO: nextProps.homepageData.initialIsoCode }));
		}
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	}

	setCountryListState = ({ state }) => this.props.dispatch(setCountryListState({ state }));

	setActiveIsoCode = ({ iso, name }) => this.props.dispatch(setActiveIsoCode({ iso, name }));

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props))

	setCountryName = ({ name, languages }) => this.props.dispatch(setCountryName({ name, languages }));

	stopClickProp = (e) => e.stopPropagation()

	stopTouchProp = (e) => e.stopPropagation()

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection())

	toggleLanguageList = ({ state }) => this.props.dispatch(setLanguageListState({ state }));

	toggleVersionList = ({ state }) => this.props.dispatch(setVersionListState({ state }));

	handleVersionSelectionToggle = () => {
		document.removeEventListener('click', this.handleClickOutside);

		this.toggleVersionSelection();
	}

	render() {
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
		} = this.props.textselection;
		const {
			activeTextName,
		} = this.props.homepageData;
		const {
			bibles,
			languages,
			countries,
		} = this.props;
		let sectionTitle = 'LANGUAGE';

		if (versionListActive) {
			sectionTitle = 'VERSION';
		} else if (countryListActive) {
			sectionTitle = 'COUNTRY';
		}

		return (
			<GenericErrorBoundary affectedArea="TextSelection">
				<aside ref={this.setRef} onTouchEnd={this.stopTouchProp} onClick={this.stopClickProp} className="chapter-text-dropdown">
					<header>
						<h2 className="text-selection">{`${sectionTitle} SELECTION`}</h2>
						<SvgWrapper role="button" tabIndex={0} className="close-icon icon" onClick={this.handleVersionSelectionToggle} svgid="arrow_up" />
					</header>
					<VersionList
						bibles={bibles}
						active={versionListActive}
						activeIsoCode={activeIsoCode}
						activeTextName={activeTextName}
						loadingVersions={loadingVersions}
						setActiveText={this.setActiveTextId}
						toggleVersionList={this.toggleVersionList}
						toggleLanguageList={this.toggleLanguageList}
						setCountryListState={this.setCountryListState}
						toggleTextSelection={this.toggleVersionSelection}
					/>
					<CountryList
						active={countryListActive}
						setCountryListState={this.setCountryListState}
						toggleVersionList={this.toggleVersionList}
						activeCountryName={activeCountryName}
						toggleLanguageList={this.toggleLanguageList}
						countries={countries}
						setCountryName={this.setCountryName}
						loadingCountries={loadingCountries}
					/>
					<LanguageList
						active={languageListActive}
						countryListActive={countryListActive}
						countryLanguages={countryLanguages}
						setCountryListState={this.setCountryListState}
						toggleVersionList={this.toggleVersionList}
						activeLanguageName={activeLanguageName}
						toggleLanguageList={this.toggleLanguageList}
						languages={languages}
						setActiveIsoCode={this.setActiveIsoCode}
						loadingLanguages={loadingLanguages}
					/>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

TextSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bibles: PropTypes.object,
	languages: PropTypes.object,
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

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// const withReducer = injectReducer({ key: 'textSelection', reducer });
// const withSaga = injectSaga({ key: 'textSelection', saga });

export default compose(
	// withReducer,
	// withSaga,
	withConnect,
)(TextSelection);
