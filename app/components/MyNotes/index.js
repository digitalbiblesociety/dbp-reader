/**
 *
 * MyNotes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import matchSorter from 'match-sorter';
import SvgWrapper from '../SvgWrapper';
import Pagination from '../Pagination';
import PageSizeSelector from '../PageSizeSelector';
import MyHighlights from '../MyHighlights';
import MyBookmarks from '../MyBookmarks';
import ColorPicker from '../ColorPicker';
class MyNotes extends React.PureComponent {
	state = {
		// Need to reset this once user goes from notes to bookmarks
		filterText: '',
		colorPickerState: false,
	};

	// Need this for when a user has edited a note and come back here
	componentDidMount() {
		this.props.getNotes({
			limit: this.props.pageSize,
			page: this.props.activePage,
		});
		this.props.getBookmarks({
			limit: this.props.pageSizeBookmark,
			page: this.props.activePageBookmark,
		});
		this.props.getHighlights({
			limit: this.props.pageSizeHighlight,
			page: this.props.activePageHighlight,
		});
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.sectionType === 'notes' &&
			(this.props.pageSize !== nextProps.pageSize ||
				this.props.activePage !== nextProps.activePage)
		) {
			this.props.getNotes({
				limit: nextProps.pageSize,
				page: nextProps.activePage,
			});
		} else if (
			nextProps.sectionType === 'bookmarks' &&
			(this.props.pageSizeBookmark !== nextProps.pageSizeBookmark ||
				this.props.activePageBookmark !== nextProps.activePageBookmark)
		) {
			this.props.getBookmarks({
				limit: nextProps.pageSizeBookmark,
				page: nextProps.activePageBookmark,
			});
		} else if (
			nextProps.sectionType === 'highlights' &&
			(this.props.pageSizeHighlight !== nextProps.pageSizeHighlight ||
				this.props.activePageHighlight !== nextProps.activePageHighlight)
		) {
			this.props.getHighlights({
				limit: nextProps.pageSizeHighlight,
				page: nextProps.activePageHighlight,
			});
		}

		if (nextProps.sectionType !== this.props.sectionType) {
			if (nextProps.sectionType === 'notes') {
				this.props.getNotes({
					limit: nextProps.pageSize,
					page: nextProps.activePage,
				});
			} else if (nextProps.sectionType === 'bookmarks') {
				nextProps.getBookmarks({
					limit: nextProps.pageSizeBookmark,
					page: nextProps.activePageBookmark,
				});
			} else if (nextProps.sectionType === 'highlights') {
				nextProps.getHighlights({
					limit: nextProps.pageSizeHighlight,
					page: nextProps.activePageHighlight,
				});
			}
		}
	}

	getNoteReference = (listItem, isBookmark) => {
		// Uses the title if it is there
		if (listItem.tags && listItem.tags.find((tag) => tag.type === 'title')) {
			return listItem.tags.find((tag) => tag.type === 'title').value;
		}
		// Otherwise uses the reference saved at the time of creation
		if (
			listItem.tags &&
			listItem.tags.find((tag) => tag.type === 'reference')
		) {
			return listItem.tags.find((tag) => tag.type === 'reference').value;
		}
		let verseRef = '';
		if (isBookmark) {
			// As a last resort it tries to generate a sort of reference
			verseRef = `${listItem.verse}`;
		} else {
			// As a last resort it tries to generate a sort of reference
			verseRef =
				listItem.verse_end && !(listItem.verse_end === listItem.verse_start)
					? `${listItem.verse_start}-${listItem.verse_end}`
					: listItem.verse_start;
		}
		const { vernacularNamesObject } = this.props;

		return `${vernacularNamesObject[listItem.book_id]} ${
			listItem.chapter
		}:${verseRef}`;
	};

	getFormattedNoteDate = (timestamp) => {
		const date = timestamp.slice(0, 10).split('-');

		return `${date[1]}.${date[2]}.${date[0].slice(2)}`;
	};

	getFilteredPageList = (pageData) => {
		const filterText = this.state.filterText;

		return matchSorter(pageData, filterText, {
			keys: [
				(item) =>
					item.tags && item.tags.find((tag) => tag.type === 'reference')
						? item.tags.find((tag) => tag.type === 'reference').value
						: item.notes,
				'notes',
				'bible_id',
				'book_id',
				'chapter',
				'verse_start',
				'updated_at',
			],
		});
	};

	getFilteredHighlights = (highlights) => {
		const filterText = this.state.filterText;

		return matchSorter(highlights, filterText, {
			keys: ['reference', 'book_id', 'chapter', 'verse_start'],
		});
	};

	getHighlightReference = (h) => {
		if (h.reference) {
			return h.reference;
		}
		return `${h.book_id} - ${h.chapter}:${
			h.verse_start === h.verse_end || !h.verse_end
				? h.verse_start
				: `${h.verse_start}-${h.verse_end}`
		} - (${h.bible_id})`;
	};

	handleSearchChange = (e) => this.setState({ filterText: e.target.value });

	handlePageClick = (page) => {
		const sectionType = this.props.sectionType;
		// Default limit to notes
		let limit = this.props.pageSize;
		// If the section was note in notes then find the appropriate section page size
		if (sectionType === 'bookmarks') {
			limit = this.props.pageSizeBookmark;
		} else if (sectionType === 'highlights') {
			limit = this.props.pageSizeHighlight;
		}
		this.props.setActivePage({
			sectionType,
			limit,
			page,
		});
	};

	handleClick = (listItem) => {
		if (this.props.sectionType === 'notes') {
			this.props.setActiveNote({ note: listItem });
			this.props.setActiveChild('edit');
		}
	};

	handleSettingPageSize = (pageSize) =>
		this.props.setPageSize({
			sectionType: this.props.sectionType,
			limit: pageSize,
			page: 1,
		});

	handlePickedColor = ({ color }) => {
		if (color !== this.state.selectedColor) {
			this.props.updateHighlight({ color, id: this.state.selectedId });
		}

		this.setState({
			colorPickerState: false,
			selectedId: '',
			selectedColor: '',
		});
	};

	startUpdateProcess = ({ id, color }) => {
		this.setState({
			colorPickerState: true,
			selectedId: id,
			selectedColor: color,
		});
	};

	get pagesize() {
		const type = this.props.sectionType;
		if (type === 'notes') {
			return this.props.pageSize;
		} else if (type === 'bookmarks') {
			return this.props.pageSizeBookmark;
		}
		return this.props.pageSizeHighlight;
	}

	get activepage() {
		const type = this.props.sectionType;
		if (type === 'notes') {
			return this.props.activePage;
		} else if (type === 'bookmarks') {
			return this.props.activePageBookmark;
		}
		return this.props.activePageHighlight;
	}

	get totalpages() {
		const type = this.props.sectionType;
		if (type === 'notes') {
			return this.props.totalPages;
		} else if (type === 'bookmarks') {
			return this.props.totalPagesBookmark;
		}
		return this.props.totalPagesHighlight;
	}

	render() {
		const {
			sectionType,
			listData,
			bookmarkList,
			highlights,
			pageSelectorState,
			togglePageSelector,
			deleteHighlights,
			deleteNote,
			deleteBookmark,
			toggleNotesModal,
		} = this.props;
		const { colorPickerState } = this.state;
		let filteredPageData = [];

		if (sectionType === 'highlights') {
			filteredPageData = this.getFilteredHighlights(highlights);
		} else if (sectionType === 'bookmarks') {
			filteredPageData = this.getFilteredPageList(bookmarkList);
		} else {
			filteredPageData = this.getFilteredPageList(listData);
		}

		return (
			<div className="list-sections">
				<div className="searchbar">
					<span className={'input-wrapper'}>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<input
							onChange={this.handleSearchChange}
							value={this.state.filterText}
							placeholder={`SEARCH ${sectionType.toUpperCase()}`}
						/>
					</span>
				</div>
				{sectionType === 'highlights' && colorPickerState ? (
					<ColorPicker handlePickedColor={this.handlePickedColor} />
				) : null}
				<section className="note-list">
					{sectionType === 'notes'
						? filteredPageData.map((listItem) => (
								<div
									key={listItem.id}
									id={listItem.id}
									className={'highlight-item'}
								>
									<div
										role="button"
										tabIndex={0}
										onClick={() => this.handleClick(listItem)}
										className="list-item"
									>
										<div className="title-text">
											<h4 className="title">
												<span className="date">
													{this.getFormattedNoteDate(listItem.created_at)}
												</span>{' '}
												| {this.getNoteReference(listItem)}
											</h4>
											<p className="text">{listItem.notes}</p>
										</div>
									</div>
									<div
										id={`${listItem.id}-edit`}
										onClick={() => this.handleClick(listItem)}
										className={'edit-note'}
										tabIndex={0}
										role={'button'}
									>
										<SvgWrapper className={'icon'} svgid={'edit_note'} />
										<span>Edit</span>
									</div>
									<div
										id={`${listItem.id}-delete`}
										onClick={() => deleteNote({ noteId: listItem.id })}
										className={'delete-highlight'}
										tabIndex={0}
										role={'button'}
									>
										<SvgWrapper className={'icon'} svgid={'delete'} />
										<span>Delete</span>
									</div>
								</div>
						  ))
						: null}
					{sectionType === 'highlights' ? (
						<MyHighlights
							highlights={filteredPageData}
							getReference={this.getHighlightReference}
							toggleNotesModal={toggleNotesModal}
							deleteHighlights={deleteHighlights}
							startUpdateProcess={this.startUpdateProcess}
						/>
					) : null}
					{sectionType === 'bookmarks' ? (
						<MyBookmarks
							bookmarks={filteredPageData}
							deleteNote={deleteBookmark}
							toggleNotesModal={toggleNotesModal}
							getFormattedNoteDate={this.getFormattedNoteDate}
							getNoteReference={this.getNoteReference}
						/>
					) : null}
				</section>
				<div className="pagination">
					<Pagination
						onChangePage={this.handlePageClick}
						activePage={this.activepage}
						totalPages={this.totalpages}
					/>
					<PageSizeSelector
						togglePageSelector={togglePageSelector}
						pageSelectorState={pageSelectorState}
						pageSize={this.pagesize}
						setPageSize={this.handleSettingPageSize}
					/>
				</div>
			</div>
		);
	}
}

MyNotes.propTypes = {
	getNotes: PropTypes.func,
	deleteNote: PropTypes.func,
	setPageSize: PropTypes.func,
	getBookmarks: PropTypes.func,
	getHighlights: PropTypes.func,
	setActiveNote: PropTypes.func,
	setActivePage: PropTypes.func,
	setActiveChild: PropTypes.func,
	deleteBookmark: PropTypes.func,
	updateHighlight: PropTypes.func,
	deleteHighlights: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	togglePageSelector: PropTypes.func,
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
	pageSizeHighlight: PropTypes.number,
	totalPagesHighlight: PropTypes.number,
	activePageHighlight: PropTypes.number,
	pageSelectorState: PropTypes.bool.isRequired,
};

export default MyNotes;
