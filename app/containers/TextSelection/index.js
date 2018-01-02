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
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import CountryList from 'components/CountryList';
import LanguageList from 'components/LanguageList';
import VersionList from 'components/VersionList';
import SvgWrapper from 'components/SvgWrapper';
import {
	setVersionListState,
	setLanguageListState,
	setActiveIsoCode,
	setCountryListState,
	getLanguages,
	getTexts,
	setCountryName,
} from './actions';
import makeSelectTextSelection, { selectLanguages, selectTexts, selectCountries } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// TODO: use a conditional to ensure the actions below only happen on the first mount
		this.props.dispatch(getLanguages());
		this.props.dispatch(getTexts());
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	setCountryListState = ({ state }) => this.props.dispatch(setCountryListState({ state }));

	setActiveIsoCode = ({ iso, name }) => this.props.dispatch(setActiveIsoCode({ iso, name }));

	setCountryName = ({ name, languages }) => this.props.dispatch(setCountryName({ name, languages }));

	toggleLanguageList = ({ state }) => this.props.dispatch(setLanguageListState({ state }));

	toggleVersionList = ({ state }) => this.props.dispatch(setVersionListState({ state }));

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleVersionSelection();
		}
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
		} = this.props.textselection;
		const {
			bibles,
			languages,
			countries,
			setActiveText,
			activeTextName,
			toggleVersionSelection,
		} = this.props;
		let sectionTitle = 'LANGUAGE';
		if (versionListActive) {
			sectionTitle = 'VERSION';
		} else if (countryListActive) {
			sectionTitle = 'COUNTRY';
		}
		return (
			<aside ref={this.setRef} className="chapter-text-dropdown">
				<header>
					<h2 className="text-selection">{`${sectionTitle} SELECTION`}</h2>
					<SvgWrapper role="button" tabIndex={0} className="close-icon icon" onClick={toggleVersionSelection} svgid="go-up" opacity=".5" />
				</header>
				<CountryList
					active={countryListActive}
					setCountryListState={this.setCountryListState}
					toggleVersionList={this.toggleVersionList}
					activeCountryName={activeCountryName}
					toggleLanguageList={this.toggleLanguageList}
					countries={countries}
					setCountryName={this.setCountryName}
				/>
				<LanguageList
					active={languageListActive}
					countryLanguages={countryLanguages}
					setCountryListState={this.setCountryListState}
					toggleVersionList={this.toggleVersionList}
					activeLanguageName={activeLanguageName}
					toggleLanguageList={this.toggleLanguageList}
					languages={languages}
					setActiveIsoCode={this.setActiveIsoCode}
				/>
				<VersionList
					active={versionListActive}
					setCountryListState={this.setCountryListState}
					activeTextName={activeTextName}
					toggleVersionList={this.toggleVersionList}
					activeIsoCode={activeIsoCode}
					setActiveText={setActiveText}
					bibles={bibles}
					toggleLanguageList={this.toggleLanguageList}
					toggleTextSelection={toggleVersionSelection}
				/>
			</aside>
		);
	}
}

TextSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bibles: PropTypes.object,
	languages: PropTypes.object,
	countries: PropTypes.object,
	textselection: PropTypes.object,
	setActiveText: PropTypes.func,
	activeTextName: PropTypes.string,
	toggleVersionSelection: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	textselection: makeSelectTextSelection(),
	languages: selectLanguages(),
	bibles: selectTexts(),
	countries: selectCountries(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'textSelection', reducer });
const withSaga = injectSaga({ key: 'textSelection', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(TextSelection);
