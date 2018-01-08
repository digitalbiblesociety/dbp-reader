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
		this.state = { pageObject: {} };
	}

	componentWillMount() {
		if (this.props.items && this.props.items.length) {
			this.setActivePage(this.props.initialPage, this.props.pageSize);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.pageSize !== nextProps.pageSize) {
			this.setActivePage(this.props.initialPage, nextProps.pageSize);
		}
	}

	setActivePage(page, pageSize) {
		const items = this.props.items;
		let pageObject = this.state.pageObject;
		// only needed if we decide to have prev/next buttons
		// if (page < 1 || page > pageObject.totalPages) {
		// 	return;
		// }

		pageObject = this.getPageObject(items.length, page, pageSize);
		const pageOfItems = items.slice(pageObject.startIndex, pageObject.endIndex + 1);

		this.setState({ pageObject });

		this.props.onChangePage(pageOfItems);
	}

	getPageObject(totalItems, currentPage = 1, pageSize = 10) {
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
		const pageObject = this.state.pageObject;

		if (!pageObject.pages || pageObject.pages.length <= 1) {
			return null;
		}

		return (
			<div className="item-list">
				{
					pageObject.pages.map((page) => (
						<div key={page} className={pageObject.currentPage === page ? 'item active' : 'item'}>
							<span role="button" tabIndex={0} onClick={() => this.setActivePage(page, this.props.pageSize)}>{page}</span>
						</div>
					))
				}
			</div>
		);
	}
}

Pagination.propTypes = {
	items: PropTypes.array.isRequired,
	onChangePage: PropTypes.func.isRequired,
	initialPage: PropTypes.number,
	pageSize: PropTypes.number,
};

export default Pagination;
