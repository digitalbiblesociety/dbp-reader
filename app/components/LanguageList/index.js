/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class LanguageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			languages,
			setActiveIsoCode,
		} = this.props;
		return (
			<div>
				<FormattedMessage {...messages.header} />
				{
					languages.map((language) => (
						<div role="button" tabIndex={0} onClick={() => setActiveIsoCode(language.get('iso'))}>{language.get('name')}</div>
					))
				}
			</div>
		);
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
	setActiveIsoCode: PropTypes.func,
};

export default LanguageList;
