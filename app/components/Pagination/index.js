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
class Pagination extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { pager: {} };
	}

	componentWillMount() {
		if (this.props.items && this.props.items.length) {
			this.setPage(this.props.initialPage);
		}
	}

	setPage(page) {
		const items = this.props.items;
		let pager = this.state.pager;
		// only needed if we decide to have prev/next buttons
		if (page < 1 || page > pager.totalPages) {
			return;
		}

		pager = this.getPager(items.length, page);
		const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

		this.setState({ pager });

		this.props.onChangePage(pageOfItems);
	}

	getPager(totalItems, currentPage = 1, pageSize = 10) {
		const totalPages = Math.ceil(totalItems / pageSize);
		let startPage;
		let	endPage;

		if (totalPages <= 10) {
			startPage = 1;
			endPage = totalPages;
		} else if (currentPage <= 6) {
			startPage = 1;
			endPage = 10;
		} else if (currentPage + 4 >= totalPages) {
			startPage = totalPages - 9;
			endPage = totalPages;
		} else {
			startPage = currentPage - 5;
			endPage = currentPage + 4;
		}

		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = Math.min((startIndex + pageSize) - 1, totalItems - 1);
		const pages = range(startPage, endPage + 1);

		return {
			totalItems,
			currentPage,
			pageSize,
			totalPages,
			startPage,
			endPage,
			startIndex,
			endIndex,
			pages,
		};
	}

	render() {
		const pager = this.state.pager;

		if (!pager.pages || pager.pages.length <= 1) {
			return null;
		}

		return (
			<div className="item-list">
				{pager.pages.map((page) =>
					(<div key={page} className={pager.currentPage === page ? 'item active' : 'item'}>
						<span role="button" tabIndex={0} onClick={() => this.setPage(page)}>{page}</span>
					</div>)
				)}
			</div>
		);
	}
}

Pagination.propTypes = {
	items: PropTypes.array.isRequired,
	onChangePage: PropTypes.func.isRequired,
	initialPage: PropTypes.number,
};

export default Pagination;
