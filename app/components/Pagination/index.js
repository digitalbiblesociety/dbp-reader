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
// I only want the 4 pages before the active page and the 5 after the active page
const Pagination = ({ totalPages, activePage, onChangePage }) => {
	const pageRange = range(1, totalPages + 1);
	const rangeLength = pageRange.length;
	const maxPage = activePage + 4 > rangeLength ? rangeLength : activePage + 4;
	const minPage = activePage - 5 < 0 ? 0 : activePage - 5;
	const checkMax = maxPage === rangeLength;
	const checkMin = minPage === 0;

	let visiblePages = pageRange;

	if (checkMax && !checkMin) {
		visiblePages =
			rangeLength > 10 ? pageRange.slice(maxPage - 9, maxPage) : pageRange;
	} else if (checkMin && !checkMax) {
		visiblePages =
			rangeLength > 10 ? pageRange.slice(minPage, minPage + 9) : pageRange;
	} else {
		visiblePages =
			rangeLength > 10 ? pageRange.slice(minPage, maxPage) : pageRange;
	}

	return (
		<div
			className={
				visiblePages.length > 7 ? 'item-list item-list-full' : 'item-list'
			}
		>
			{visiblePages.map((page) => (
				<div
					key={page}
					className={activePage === page ? 'item active' : 'item'}
				>
					<span
						id={`${page}-button`}
						role="button"
						tabIndex={0}
						onClick={() => onChangePage(page)}
					>
						{page}
					</span>
				</div>
			))}
		</div>
	);
};

Pagination.propTypes = {
	onChangePage: PropTypes.func.isRequired,
	activePage: PropTypes.number,
	totalPages: PropTypes.number,
};

export default Pagination;
