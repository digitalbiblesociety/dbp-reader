/**
*
* MyNotes
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
		const verseRef = listItem.verse_end && !(listItem.verse_end === listItem.verse_start) ? `${listItem.verse_start}-${listItem.verse_end}` : listItem.verse_start;
		const { vernacularNamesObject } = this.props;

		return `${vernacularNamesObject[listItem.book_id]} ${listItem.chapter}:${verseRef} - (${listItem.bible_id})`;
	}

	getFormattedNoteDate(timestamp) {
		const date = timestamp.slice(0, 10).split('-');

		return `${date[1]}.${date[2]}.${date[0].slice(2)}`;
	}

	getHighlightReference = (h) => `${h.get('bible_id')} - ${h.get('book_id')} - ${h.get('chapter')}:${h.get('verse_start') === h.get('verse_end') || !h.get('verse_end') ? h.get('verse_start') : `${h.get('verse_start')}-${h.get('verse_end')}`} - (${h.get('bible_id')})`

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
			highlights,
			activePageData,
			pageSize,
			pageSelectorState,
			togglePageSelector,
		} = this.props;
		// Use concept like this to enhance modularity
		// const dataTypes = {
		// 	highlights,
		// 	notes: listData,
		// 	bookmarks: [],
		// };
		// const dataToMap = dataTypes[sectionType];
		// console.log('highlights in my notes', highlights);
		// console.log('active page data', activePageData);
		// console.log('list data', listData);

		return (
			<div className="list-sections">
				<div className="searchbar">
					<span className={'input-wrapper'}>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<input placeholder={`SEARCH ${sectionType.toUpperCase()}`} />
					</span>
				</div>
				<section className="note-list">
					{
						sectionType === 'notes' ? (
							activePageData.map((listItem) => (
								<div role="button" tabIndex={0} onClick={() => this.handleClick(listItem)} key={listItem.id} className="list-item">
									<div className="date">{this.getFormattedNoteDate(listItem.created_at)}</div>
									<div className="title-text">
										<h4 className="title">{this.getNoteReference(listItem)}</h4>
										<p className="text">{listItem.notes}</p>
									</div>
								</div>
							))
						) : null
					}
					{
						sectionType === 'highlights' ? highlights.map((highlight) => (
							<div key={highlight.id} className="list-item">
								<div className="title-text">
									<h4 className="title">{this.getHighlightReference(highlight)}</h4>
								</div>
							</div>
						)) : null
					}
					{
						sectionType === 'bookmarks' ? (
							activePageData.filter((n) => n.bookmark)).map((listItem) => (
								<Link to={`/${listItem.bible_id}/${listItem.book_id}/${listItem.chapter}/${listItem.verse_start}`} role="button" tabIndex={0} key={listItem.id} className="list-item">
									<div className="date">{this.getFormattedNoteDate(listItem.created_at)}</div>
									<div className="title-text">
										<h4 className="title">{this.getNoteReference(listItem)}</h4>
									</div>
								</Link>
						)) : null
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
	highlights: PropTypes.object,
};

export default MyNotes;
