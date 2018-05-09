/**
*
* Pagination
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
// import styled from 'styled-components';
// Doing the number of total pages + 1 because I do not want the list to be 0 indexed
const Pagination = ({ totalPages, activePage, onChangePage }) => (
	<div className="item-list">
		{
			range(1, totalPages + 1).map((page) => (
				<div key={page} className={activePage === page ? 'item active' : 'item'}>
					<span role="button" tabIndex={0} onClick={() => onChangePage(page)}>{page}</span>
				</div>
			))
		}
	</div>
);

Pagination.propTypes = {
	onChangePage: PropTypes.func.isRequired,
	activePage: PropTypes.number,
	totalPages: PropTypes.number,
};

export default Pagination;
