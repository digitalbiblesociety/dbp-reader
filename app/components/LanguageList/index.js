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
		} = this.props;
		if (active) {
			return (
				<div>
					{
						languages.map((language) => (
							<div role="button" tabIndex={0} onClick={() => { setActiveIsoCode(language.get('iso')); toggleLanguageList(); }}>{language.get('name')}</div>
						))
					}
				</div>
			);
		}
		return (
			<div role="button" tabIndex={0} onClick={toggleLanguageList}>ACTIVE LANGUAGE NAME</div>
		);
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
	setActiveIsoCode: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	active: PropTypes.bool,
};

export default LanguageList;
