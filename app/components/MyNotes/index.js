/**
*
* MyNotes
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import matchSorter from 'match-sorter';
import { Link } from 'react-router-dom';
import SvgWrapper from 'components/SvgWrapper';
import Pagination from 'components/Pagination';
import PageSizeSelector from 'components/PageSizeSelector';
// import styled from 'styled-components';
class MyNotes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		// Need to reset this once user goes from notes to bookmarks
		filterText: '',
	}
	// Need this for when a user has edited a note and come back here
	componentDidMount() {
		if (this.props.sectionType === 'notes') {
			// console.log('Getting notebook data in did mount');
			this.props.getNotes({ limit: this.props.pageSize, page: this.props.activePage });
		} else if (this.props.sectionType === 'bookmarks') {
			this.props.getBookmarks({ limit: this.props.pageSizeBookmark, page: this.props.activePageBookmark });
		}
	}

	// componentDidUpdate() {
	// 	console.log('Component updated');
	// }

	componentWillReceiveProps(nextProps) {
		if (nextProps.sectionType === 'notes' && (this.props.pageSize !== nextProps.pageSize || this.props.activePage !== nextProps.activePage)) {
			this.props.getNotes({ limit: nextProps.pageSize, page: nextProps.activePage });
		} else if (nextProps.sectionType === 'bookmarks' && (this.props.pageSizeBookmark !== nextProps.pageSizeBookmark || this.props.activePageBookmark !== nextProps.activePageBookmark)) {
			this.props.getBookmarks({ limit: nextProps.pageSizeBookmark, page: nextProps.activePageBookmark });
		}
		if (this.props.sectionType === 'notes' && nextProps.sectionType === 'bookmarks' && this.props.bookmarkList.length === 0) {
			this.props.getBookmarks({ limit: nextProps.pageSizeBookmark, page: 1 });
		}
	}

	getNoteReference(listItem) {
		if (listItem.tags && listItem.tags.find((tag) => tag.type === 'reference')) {
			return listItem.tags.find((tag) => tag.type === 'reference').value;
		}
		const verseRef = listItem.verse_end && !(listItem.verse_end === listItem.verse_start) ? `${listItem.verse_start}-${listItem.verse_end}` : listItem.verse_start;
		const { vernacularNamesObject } = this.props;

		return `${vernacularNamesObject[listItem.book_id]} ${listItem.chapter}:${verseRef} - (${listItem.bible_id})`;
	}

	getFormattedNoteDate(timestamp) {
		const date = timestamp.slice(0, 10).split('-');

		return `${date[1]}.${date[2]}.${date[0].slice(2)}`;
	}

	getFilteredPageList = (pageData) => {
		const filterText = this.state.filterText;

		return matchSorter(pageData, filterText, { keys: ['notes', 'bible_id', 'book_id', 'chapter', 'verse_start', 'updated_at'] });
	}

	getFilteredHighlights = (highlights) => {
		const filterText = this.state.filterText;

		return matchSorter(highlights, filterText, { keys: ['reference', 'book_id', 'chapter', 'verse_start'] });
	}

	getHighlightReference = (h) => {
		if (h.reference) {
			return h.reference;
		}
		return `${h.bible_id} - ${h.book_id} - ${h.chapter}:${h.verse_start === h.verse_end || !h.verse_end ? h.verse_start : `${h.verse_start}-${h.verse_end}`} - (${h.bible_id})`;
	}

	handleSearchChange = (e) => this.setState({ filterText: e.target.value })

	handlePageClick = (page) => this.props.setActivePage({ sectionType: this.props.sectionType, limit: this.props.sectionType === 'notes' ? this.props.pageSize : this.props.pageSizeBookmark, page })

	handleClick = (listItem) => {
		if (this.props.sectionType === 'notes') {
			this.props.setActiveNote({ note: listItem });
			this.props.setActiveChild('edit');
		}
	}

	handleSettingPageSize = (pageSize) => this.props.setPageSize({ sectionType: this.props.sectionType, limit: pageSize, page: 1 })

	render() {
		const {
			sectionType,
			listData,
			bookmarkList,
			highlights,
			activePage,
			pageSize,
			totalPages,
			pageSelectorState,
			togglePageSelector,
			pageSizeBookmark,
			totalPagesBookmark,
			activePageBookmark,
		} = this.props;
		let filteredPageData = [];

		if (sectionType === 'highlights') {
			filteredPageData = this.getFilteredHighlights(highlights);
		} else if (sectionType === 'bookmarks') {
			filteredPageData = this.getFilteredPageList(bookmarkList);
		} else {
			filteredPageData = this.getFilteredPageList(listData);
		}
		// console.log(this.getFilteredPageList(activePageData));
		// console.log(highlights);
		// console.log(this.props);
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
						<input onChange={this.handleSearchChange} value={this.state.filterText} placeholder={`SEARCH ${sectionType.toUpperCase()}`} />
					</span>
				</div>
				<section className="note-list">
					{
						sectionType === 'notes' ? (
							filteredPageData.map((listItem) => (
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
						sectionType === 'highlights' ? filteredPageData.map((highlight) => (
							<Link to={`/${highlight.bible_id}/${highlight.book_id}/${highlight.chapter}/${highlight.verse_start}`} role="button" tabIndex={0} key={highlight.id} className="list-item">
								<div className="title-text">
									<h4 className="title">{this.getHighlightReference(highlight)}</h4>
								</div>
							</Link>
						)) : null
					}
					{
						sectionType === 'bookmarks' ? (
							filteredPageData.filter((n) => n.bookmark)).map((listItem) => (
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
						onChangePage={this.handlePageClick}
						activePage={sectionType === 'notes' ? activePage : activePageBookmark}
						totalPages={sectionType === 'notes' ? totalPages : totalPagesBookmark}
					/>
					<PageSizeSelector
						togglePageSelector={togglePageSelector}
						pageSelectorState={pageSelectorState}
						pageSize={sectionType === 'notes' ? pageSize : pageSizeBookmark}
						setPageSize={this.handleSettingPageSize}
					/>
				</div>
			</div>
		);
	}
}

MyNotes.propTypes = {
	setActiveChild: PropTypes.func.isRequired,
	setActiveNote: PropTypes.func.isRequired,
	setActivePage: PropTypes.func.isRequired,
	togglePageSelector: PropTypes.func.isRequired,
	setPageSize: PropTypes.func.isRequired,
	getNotes: PropTypes.func.isRequired,
	getBookmarks: PropTypes.func.isRequired,
	listData: PropTypes.array.isRequired,
	bookmarkList: PropTypes.array.isRequired,
	highlights: PropTypes.array,
	sectionType: PropTypes.string.isRequired,
	vernacularNamesObject: PropTypes.object,
	pageSize: PropTypes.number.isRequired,
	totalPages: PropTypes.number,
	activePage: PropTypes.number,
	pageSizeBookmark: PropTypes.number.isRequired,
	totalPagesBookmark: PropTypes.number,
	activePageBookmark: PropTypes.number,
	pageSelectorState: PropTypes.bool.isRequired,
};

export default MyNotes;
