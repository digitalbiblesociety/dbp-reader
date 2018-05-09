/**
*
* Pagination
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
// import styled from 'styled-components';
// TODO: Move all pagination logic into selector for Notes container
const Pagination = ({ totalPages, activePage, onChangePage }) => (
	<div className="item-list">
		{
			range(totalPages).map((page) => (
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
