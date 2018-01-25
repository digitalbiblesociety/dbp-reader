/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';

class LanguageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
		};
	}

	get filteredLanguages() {
		const {
			languages,
			activeLanguageName,
		} = this.props;
		const { filterText } = this.state;
		const filteredLanguages = filterText ? languages.filter((language) => this.filterFunction(language, filterText)) : languages;

		const components = filteredLanguages.map((language) => (
			<div className="language-name" key={language.get('iso_code')} role="button" tabIndex={0} onClick={() => this.handleLanguageClick(language)}>
				<h4 className={language.get('name') === activeLanguageName ? 'active-language-name' : ''}>{language.get('name')}</h4>
			</div>
		));

		return components.size ? components : <LoadingSpinner />;
	}

	filterFunction = (language, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (language.get('iso_code').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (language.get('name').toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

	handleLanguageClick = (language) => {
		const {
			setActiveIsoCode,
			toggleLanguageList,
			toggleVersionList,
			setCountryListState,
		} = this.props;

		if (language) {
			setActiveIsoCode({ iso: language.get('iso_code'), name: language.get('name') });
			toggleLanguageList({ state: false });
			toggleVersionList({ state: true });
		} else {
			toggleLanguageList({ state: true });
			toggleVersionList({ state: false });
			setCountryListState({ state: false });
		}
	}

	handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			active,
			activeLanguageName,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div className="text-selection-title">
						<SvgWrapper height="25px" width="25px" fill="#fff" svgid="world" />
						<span className="text">LANGUAGE:</span>
						<span className="active-header-name">{activeLanguageName}</span>
					</div>
					<input className="text-selection-input" onChange={this.handleChange} placeholder="SEARCH LANGUAGES" value={this.state.filterText} />
					<div className="language-name-list">
						{this.filteredLanguages}
					</div>
				</div>
			);
		}
		return (
			<div className="text-selection-section closed" role="button" tabIndex={0} onClick={() => this.handleLanguageClick()}>
				<div className="text-selection-title">
					<SvgWrapper height="25px" width="25px" fill="#fff" svgid="world" />
					<span className="text">LANGUAGE:</span>
					<span className="active-header-name">{activeLanguageName}</span>
				</div>
			</div>
		);
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
	setActiveIsoCode: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	setCountryListState: PropTypes.func,
	toggleVersionList: PropTypes.func,
	active: PropTypes.bool,
	activeLanguageName: PropTypes.string,
};

export default LanguageList;
