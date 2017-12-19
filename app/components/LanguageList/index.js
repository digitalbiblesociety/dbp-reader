/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
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
			setBookListState,
			toggleVersionList,
		} = this.props;
		const { filterText } = this.state;
		const filteredLanguages = filterText ? languages.filter((language) => this.filterFunction(language, filterText)) : languages;
		if (active) {
			return (
				<div className="text-selection-section">
					<div className="text-selection-title">
						<SvgWrapper height="25px" width="25px" fill="#fff" svgid="world" />
						<span className="text">LANGUAGE:</span>
						<span className="active-language-name">{activeLanguageName}</span>
					</div>
					<input className="text-selection-input" onChange={this.handleChange} placeholder="SEARCH LANGUAGES" />
					<div className="language-name-list">
						{
							filteredLanguages.map((language) => (
								<div className="language-name" key={language.get('iso_code')} role="button" tabIndex={0} onClick={() => { setActiveIsoCode({ iso: language.get('iso_code'), name: language.get('name') }); toggleLanguageList({ state: false }); toggleVersionList({ state: true }); setBookListState({ state: false }); }}>
									<h4 className={language.get('name') === activeLanguageName ? 'active-language-name' : ''}>{language.get('name')}</h4>
								</div>
							))
						}
					</div>
				</div>
			);
		}
		return (
			<div className="text-selection-section closed" role="button" tabIndex={0} onClick={() => { toggleLanguageList({ state: true }); toggleVersionList({ state: false }); setBookListState({ state: false }); }}>
				<div className="text-selection-title">
					<SvgWrapper height="25px" width="25px" fill="#fff" svgid="world" />
					<span className="text">LANGUAGE:</span>
					<span className="active-language-name">{activeLanguageName}</span>
				</div>
			</div>
		);
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
	setActiveIsoCode: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	setBookListState: PropTypes.func,
	toggleVersionList: PropTypes.func,
	active: PropTypes.bool,
	activeLanguageName: PropTypes.string,
};

export default LanguageList;
