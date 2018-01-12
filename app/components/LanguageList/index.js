/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import { TransitionGroup } from 'react-transition-group';
import FadeTransition from 'components/FadeTransition';

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
			setCountryListState,
			toggleVersionList,
		} = this.props;
		const { filterText } = this.state;
		const filteredLanguages = filterText ? languages.filter((language) => this.filterFunction(language, filterText)) : languages;
		return (
			<div className={active ? 'text-selection-section' : 'text-selection-section closed'}>
				<div className="text-selection-title" role="button" tabIndex={0} onClick={() => { setCountryListState({ state: false }); toggleVersionList({ state: false }); toggleLanguageList({ state: true }); }}>
					<SvgWrapper height="25px" width="25px" fill="#fff" svgid="world" />
					<span className="text">LANGUAGE:</span>
					<span className="active-header-name">{activeLanguageName}</span>
				</div>
				<input className={active ? 'text-selection-input' : 'text-selection-input closed'} onChange={this.handleChange} placeholder="SEARCH LANGUAGES" value={this.state.filterText} />
				<TransitionGroup className={active ? 'transition-group' : ''}>
					{
						active ? (
							<FadeTransition classNames="slide-down" in={active}>
								<div className="language-name-list">
									{
										filteredLanguages.map((language) => (
											<div className="language-name" key={language.get('iso_code')} role="button" tabIndex={0} onClick={() => { setActiveIsoCode({ iso: language.get('iso_code'), name: language.get('name') }); toggleLanguageList({ state: false }); toggleVersionList({ state: true }); setCountryListState({ state: false }); }}>
												<h4 className={language.get('name') === activeLanguageName ? 'active-language-name' : ''}>{language.get('name')}</h4>
											</div>
										))
									}
								</div>
							</FadeTransition>
						) : null
					}
				</TransitionGroup>
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
