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
	render() {
		const {
			languages,
			setActiveIsoCode,
			active,
			toggleLanguageList,
			activeLanguageName,
		} = this.props;
		if (active) {
			return (
				<div className="language-section">
					<i>i</i>
					<h3>LANGUAGE:</h3>
					<h3 className="active-language-name">{activeLanguageName.toUpperCase()}</h3>
					<div className="language-name-list">
						{
							languages.map((language) => (
								<div className="language-name" role="button" tabIndex={0} onClick={() => { setActiveIsoCode({ iso: language.get('iso'), name: language.get('name') }); toggleLanguageList(); }}>{language.get('name')}</div>
							))
						}
					</div>
				</div>
			);
		}
		return (
			<div className="language-section" role="button" tabIndex={0} onClick={toggleLanguageList}>
				<i>i</i>
				<h3>LANGUAGE:</h3>
				<h3 className="active-language-name">{activeLanguageName.toUpperCase()}</h3>
			</div>
		);
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
	setActiveIsoCode: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	active: PropTypes.bool,
	activeLanguageName: PropTypes.string,
};

export default LanguageList;
