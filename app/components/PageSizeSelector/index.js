/**
*
* PageSizeSelector
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function PageSizeSelector({ pageSize, togglePageSelector, setPageSize, pageSelectorState: state }) {
	return (
		<div className="page-size-selector">
			{
				state ? (
					<div className="open">
						<div role="button" tabIndex={0} onClick={() => { setPageSize(10); togglePageSelector(); }}>10 PER PAGE</div>
						<div role="button" tabIndex={0} onClick={() => { setPageSize(25); togglePageSelector(); }}>25 PER PAGE</div>
						<div role="button" tabIndex={0} onClick={() => { setPageSize(50); togglePageSelector(); }}>50 PER PAGE</div>
						<div role="button" tabIndex={0} onClick={() => { setPageSize(100); togglePageSelector(); }}>100 PER PAGE</div>
						<div role="button" tabIndex={0} onClick={() => { setPageSize(0); togglePageSelector(); }}>VIEW ALL</div>
					</div>
				) : (
					<div role="button" tabIndex={0} onClick={togglePageSelector} className="closed">{pageSize === 0 ? 'VIEW ALL' : `${pageSize} PER PAGE`}</div>
				)
			}
		</div>
	);
}

PageSizeSelector.propTypes = {
	setPageSize: PropTypes.func.isRequired,
	togglePageSelector: PropTypes.func.isRequired,
	pageSize: PropTypes.number.isRequired,
	pageSelectorState: PropTypes.bool.isRequired,
};

export default PageSizeSelector;
