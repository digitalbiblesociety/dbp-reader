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

	getFilteredPageList = (pageData) => {
		const filterText = this.state.filterText;

		return matchSorter(pageData, filterText, { keys: ['notes', 'bible_id', 'book_id', 'verse_start', 'updated_at'] });
	}

	getFilteredHighlights = (highlights) => {
		const filterText = this.state.filterText;

		return matchSorter(highlights, filterText, { keys: ['book_id', 'chapter', 'verse_start'] });
	}

	getHighlightReference = (h) => `${h.bible_id} - ${h.book_id} - ${h.chapter}:${h.verse_start === h.verse_end || !h.verse_end ? h.verse_start : `${h.verse_start}-${h.verse_end}`} - (${h.bible_id})`

	handleSearchChange = (e) => this.setState({ filterText: e.target.value })

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
		const filteredPageData = sectionType === 'highlights' ? this.getFilteredHighlights(highlights) : this.getFilteredPageList(activePageData);
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
	highlights: PropTypes.array,
};

export default MyNotes;
