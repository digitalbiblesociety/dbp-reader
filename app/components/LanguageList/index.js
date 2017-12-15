/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class LanguageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
		};
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

	handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			languages,
			setActiveIsoCode,
			active,
			toggleLanguageList,
			activeLanguageName,
			toggleVersionList,
		} = this.props;
		const { filterText } = this.state;
		const filteredLanguages = filterText ? languages.filter((language) => this.filterFunction(language, filterText)) : languages;
		if (active) {
			return (
				<section className="language-section">
					<section className="language-title">
						<i>icon</i>
						<span>LANGUAGE:</span>
						<span className="active-language-name">{activeLanguageName}</span>
					</section>
					<input onChange={this.handleChange} placeholder="SEARCH LANGUAGES" />
					<section className="language-name-list">
						{
							filteredLanguages.map((language) => (
								<div className="language-name" key={language.get('iso_code')} role="button" tabIndex={0} onClick={() => { setActiveIsoCode({ iso: language.get('iso_code'), name: language.get('name') }); toggleLanguageList(); toggleVersionList(); }}>{language.get('name')}</div>
							))
						}
					</section>
				</section>
			);
		}
		return (
			<section className="language-section" role="button" tabIndex={0} onClick={toggleLanguageList}>
				<i>icon</i>
				<span>LANGUAGE:</span>
				<span className="active-language-name">{activeLanguageName}</span>
			</section>
		);
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
	setActiveIsoCode: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	toggleVersionList: PropTypes.func,
	active: PropTypes.bool,
	activeLanguageName: PropTypes.string,
};

export default LanguageList;
