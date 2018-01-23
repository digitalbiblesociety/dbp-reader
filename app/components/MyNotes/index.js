/**
*
* MyNotes
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import Pagination from 'components/Pagination';
import PageSizeSelector from 'components/PageSizeSelector';
// import styled from 'styled-components';
// TODO: Provide way of differentiating between notes, bookmarks and highlights
class MyNotes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	handlePageClick = (page) => this.props.setActivePageData(page);
	handleClick = (listItem) => {
		if (this.props.sectionType === 'notes') {
			this.props.setActiveNote({ note: listItem });
			this.props.setActiveChild('edit');
		}
	}

	render() {
		const {
			sectionType,
			setPageSize,
			listData,
			activePageData,
			pageSize,
			pageSelectorState,
			togglePageSelector,
		} = this.props;

		return (
			<div className="list-sections">
				<div className="searchbar">
					<div role="button" tabIndex={0} className="add-note" onClick={() => this.handleClick({})}><SvgWrapper height="20px" width="20px" svgid="plus"></SvgWrapper></div>
					<input className="search" placeholder={`SEARCH ${sectionType.toUpperCase()}`} />
				</div>
				<section className="note-list">
					{
						activePageData.map((listItem) => (
							<div role="button" tabIndex={0} onClick={() => this.handleClick(listItem)} key={listItem.date + listItem.title} className="list-item">
								<div className="date">{listItem.date}</div>
								<div className="title-text">
									<h4 className="title">{listItem.title}</h4>
									<p className="text">{listItem.notes}</p>
								</div>
							</div>
						))
					}
				</section>
				<div className="pagination">
					<Pagination
						items={listData}
						onChangePage={this.handlePageClick}
						initialPage={1}
						pageSize={pageSize}
					/>
					<PageSizeSelector togglePageSelector={togglePageSelector} pageSelectorState={pageSelectorState} pageSize={pageSize} setPageSize={setPageSize} />
				</div>
			</div>
		);
	}
}

MyNotes.propTypes = {
	sectionType: PropTypes.string.isRequired,
	listData: PropTypes.array.isRequired,
	activePageData: PropTypes.array.isRequired,
	setActiveChild: PropTypes.func.isRequired,
	setActiveNote: PropTypes.func.isRequired,
	setActivePageData: PropTypes.func.isRequired,
	setPageSize: PropTypes.func.isRequired,
	togglePageSelector: PropTypes.func.isRequired,
	pageSize: PropTypes.number.isRequired,
	pageSelectorState: PropTypes.bool.isRequired,
};

export default MyNotes;
