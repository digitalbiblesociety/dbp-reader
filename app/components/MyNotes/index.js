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
	componentDidMount() {
		if (this.props.sectionType === 'notes') {
			this.props.getNotes();
		}
	}

	getNoteReference(listItem) {
		const verseRef = listItem.verse_end ? `${listItem.verse_start}-${listItem.verse_end}` : listItem.verse_start;
		const { vernacularNamesObject } = this.props;

		return `${vernacularNamesObject[listItem.book_id]} ${listItem.chapter}:${verseRef}`;
	}

	getFormattedNoteDate(timestamp) {
		const date = timestamp.slice(0, 10).split('-');

		return `${date[1]}.${date[2]}.${date[0].slice(2)}`;
	}

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
							<div role="button" tabIndex={0} onClick={() => this.handleClick(listItem)} key={listItem.id} className="list-item">
								<div className="date">{this.getFormattedNoteDate(listItem.created_at)}</div>
								<div className="title-text">
									<h4 className="title">{this.getNoteReference(listItem)}</h4>
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
	setActiveChild: PropTypes.func.isRequired,
	setActiveNote: PropTypes.func.isRequired,
	setActivePageData: PropTypes.func.isRequired,
	togglePageSelector: PropTypes.func.isRequired,
	setPageSize: PropTypes.func.isRequired,
	getNotes: PropTypes.func.isRequired,
	pageSelectorState: PropTypes.bool.isRequired,
	activePageData: PropTypes.array.isRequired,
	listData: PropTypes.array.isRequired,
	sectionType: PropTypes.string.isRequired,
	pageSize: PropTypes.number.isRequired,
	vernacularNamesObject: PropTypes.object,
};

export default MyNotes;
