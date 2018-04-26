/**
*
* RecentSearches
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function RecentSearches({ searches, clickHandler }) {
	return searches.map((s) => [<br key={`br${s}`} />, <button className={'search-history-item'} key={s} onClick={() => clickHandler(s)}>{s}</button>]);
}

RecentSearches.propTypes = {
	searches: PropTypes.array,
	clickHandler: PropTypes.func,
};

export default RecentSearches;
