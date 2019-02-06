/**
 *
 * Notes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import PleaseSignInMessage from '../../components/PleaseSignInMessage';
import SvgWrapper from '../../components/SvgWrapper';
import EditNote from '../../components/EditNote';
import MyNotes from '../../components/MyNotes';
import injectReducer from '../../utils/injectReducer';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import { setActiveNote, deleteHighlights } from '../HomePage/actions';
import {
	setActiveChild,
	setPageSize,
	toggleVerseText,
	toggleAddVerseMenu,
	togglePageSelector,
	setActivePage,
	addNote,
	getNotesForNotebook,
	getChapterForNote,
	addHighlight,
	updateNote,
	deleteNote,
	getUserBookmarkData,
	readSavedMessage,
	updateHighlight,
	clearNoteErrorMessage,
	getUserHighlights,
} from './actions';
import makeSelectNotes, {
	selectUserId,
	selectActiveNote,
	selectHighlightedText,
	selectUserAuthenticationStatus,
	selectNotePassage,
	selectActiveTextId,
	vernacularBookNameObject,
	selectActiveBookName,
} from './selectors';
import reducer from './reducer';
import messages from './messages';
import Ieerror from '../../components/Ieerror';

export class Notes extends React.PureComponent {
	constructor(props) {
		super(props);
		if (props.openView) {
			this.props.dispatch(setActiveChild(props.openView));
		}
	}

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(
			this.ref,
			this.props.toggleNotesModal,
		);
		this.closeMenuController.onMenuMount();
		this.props.dispatch(getChapterForNote({ note: this.props.note }));
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setRef = (node) => {
		this.ref = node;
	};

	setActiveChild = (child) => this.props.dispatch(setActiveChild(child));

	setActivePage = (props) =>
		this.props.dispatch(
			setActivePage({ userId: this.props.userId, params: { ...props } }),
		);

	setActiveNote = ({ note }) => {
		this.props.dispatch(getChapterForNote({ note }));
		this.props.dispatch(setActiveNote({ note }));
	};

	setPageSize = (props) =>
		this.props.dispatch(
			setPageSize({ userId: this.props.userId, params: { ...props } }),
		);

	getNotes = (props) =>
		this.props.dispatch(
			getNotesForNotebook({ userId: this.props.userId, params: { ...props } }),
		);

	getBookmarks = (props) =>
		this.props.dispatch(
			getUserBookmarkData({ userId: this.props.userId, params: { ...props } }),
		);

	getHighlights = (props) =>
		this.props.dispatch(
			getUserHighlights({ userId: this.props.userId, params: { ...props } }),
		);

	toggleVerseText = () => this.props.dispatch(toggleVerseText());

	toggleAddVerseMenu = () => this.props.dispatch(toggleAddVerseMenu());

	togglePageSelector = () => this.props.dispatch(togglePageSelector());

	addHighlight = (data) =>
		this.props.dispatch(
			addHighlight({
				userId: this.props.userId,
				data: { ...data, user_id: this.props.userId },
			}),
		);

	updateHighlight = (props) =>
		this.props.dispatch(
			updateHighlight({
				userId: this.props.userId,
				bible: this.props.activeTextId,
				book: this.props.activeBookId,
				chapter: this.props.activeChapter,
				limit: this.props.notes.pageSizeHighlight,
				page: this.props.notes.activePageHighlight,
				...props,
			}),
		);

	deleteHighlights = (props) =>
		this.props.dispatch(
			deleteHighlights({
				userId: this.props.userId,
				bible: this.props.activeTextId,
				book: this.props.activeBookId,
				chapter: this.props.activeChapter,
				limit: this.props.notes.pageSizeHighlight,
				page: this.props.notes.activePageHighlight,
				...props,
			}),
		);

	addNote = (data) =>
		this.props.dispatch(
			addNote({
				userId: this.props.userId,
				data: { ...data, user_id: this.props.userId },
			}),
		);

	updateNote = (data) =>
		this.props.dispatch(
			updateNote({
				userId: this.props.userId,
				noteId: data.id,
				data: { ...data, user_id: this.props.userId },
			}),
		);

	deleteNote = (props) =>
		this.props.dispatch(
			deleteNote({
				...props,
				userId: this.props.userId,
				pageSize: this.props.notes.pageSize,
				activePage: this.props.notes.activePage,
				bibleId: this.props.activeTextId,
				bookId: this.props.activeBookId,
				chapter: this.props.activeChapter,
			}),
		);

	deleteBookmark = (props) =>
		this.props.dispatch(
			deleteNote({
				...props,
				userId: this.props.userId,
				pageSize: this.props.notes.pageSizeBookmark,
				activePage: this.props.notes.activePageBookmark,
				bibleId: this.props.activeTextId,
				bookId: this.props.activeBookId,
				chapter: this.props.activeChapter,
			}),
		);

	readSavedMessage = (props) => this.props.dispatch(readSavedMessage(props));

	clearNoteErrorMessage = () => this.props.dispatch(clearNoteErrorMessage());

	titleOptions = {
		edit: 'Edit Note',
		notes: 'My Notes',
		bookmarks: 'My Bookmarks',
		highlights: 'My Highlights',
	};

	render() {
		const {
			activeChild,
			listData,
			isAddVerseExpanded,
			isVerseTextVisible,
			pageSize,
			totalPages,
			activePage,
			pageSelectorState,
			bookmarkList,
			userHighlights,
			pageSizeBookmark,
			totalPagesBookmark,
			activePageBookmark,
			pageSizeHighlight,
			totalPagesHighlight,
			activePageHighlight,
			savedTheNote,
			errorSavingNote,
			notesErrorMessage,
		} = this.props.notes;
		const {
			toggleNotesModal,
			selectedText,
			authenticationStatus,
			note,
			notePassage,
			activeTextId,
			vernacularNamesObject,
			activeBookName,
			isIe,
		} = this.props;

		if (isIe) {
			return (
				<aside ref={this.setRef} className="notes">
					<header>
						<SvgWrapper
							className={'icon'}
							fill="#fff"
							svgid="arrow_right"
							onClick={() => {
								toggleNotesModal();
							}}
						/>
						<SvgWrapper
							className={'icon book-icon-header'}
							svgid={'notebook'}
							onClick={() => {
								toggleNotesModal();
							}}
						/>
						<h1 className="section-title">Notebook</h1>
					</header>
					<Ieerror />
				</aside>
			);
		}

		return (
			<aside ref={this.setRef} className="notes">
				<header>
					<SvgWrapper
						className={'icon'}
						fill="#fff"
						svgid="arrow_right"
						onClick={() => {
							toggleNotesModal();
						}}
					/>
					<SvgWrapper
						className={'icon book-icon-header'}
						svgid={'notebook'}
						onClick={() => {
							toggleNotesModal();
						}}
					/>
					<h1 className="section-title">Notebook</h1>
				</header>
				{authenticationStatus ? (
					<>
						<div className="top-bar">
							<div
								id={'note-list-button'}
								role={'button'}
								tabIndex={0}
								onClick={() => this.setActiveChild('notes')}
								className={
									activeChild === 'notes' || activeChild === 'edit'
										? 'nav-button active'
										: 'nav-button'
								}
							>
								{activeChild !== 'edit' ? (
									<SvgWrapper
										role="button"
										tabIndex={0}
										className={'svg'}
										height="26px"
										width="26px"
										svgid="notes"
									/>
								) : null}
								{activeChild === 'edit' ? (
									<SvgWrapper
										role="button"
										tabIndex={0}
										className={'svg'}
										height="26px"
										width="26px"
										svgid="edit_note"
									/>
								) : null}
								<h1>{<FormattedMessage {...messages.notesHeader} />}</h1>
							</div>
							<div
								id={'highlights-list-button'}
								role={'button'}
								tabIndex={0}
								onClick={() => this.setActiveChild('highlights')}
								className={
									activeChild === 'highlights'
										? 'nav-button active'
										: 'nav-button'
								}
							>
								<SvgWrapper
									role="button"
									tabIndex={0}
									className={'svg'}
									height="26px"
									width="26px"
									svgid="highlight"
								/>
								<h1>{<FormattedMessage {...messages.highlightsHeader} />}</h1>
							</div>
							<div
								id={'bookmarks-list-button'}
								role={'button'}
								tabIndex={0}
								onClick={() => this.setActiveChild('bookmarks')}
								className={
									activeChild === 'bookmarks'
										? 'nav-button active'
										: 'nav-button'
								}
							>
								<SvgWrapper
									role="button"
									tabIndex={0}
									className={'svg'}
									height="26px"
									width="26px"
									svgid="bookmark"
								/>
								<h1>{<FormattedMessage {...messages.bookmarksHeader} />}</h1>
							</div>
						</div>
						{activeChild === 'edit' ? (
							<EditNote
								addNote={this.addNote}
								deleteNote={this.deleteNote}
								updateNote={this.updateNote}
								setActiveChild={this.setActiveChild}
								toggleVerseText={this.toggleVerseText}
								readSavedMessage={this.readSavedMessage}
								toggleAddVerseMenu={this.toggleAddVerseMenu}
								clearNoteErrorMessage={this.clearNoteErrorMessage}
								note={note}
								notePassage={notePassage}
								activeTextId={activeTextId}
								selectedText={selectedText}
								savedTheNote={savedTheNote}
								activeBookName={activeBookName}
								errorSavingNote={errorSavingNote}
								notesErrorMessage={notesErrorMessage}
								isVerseTextVisible={isVerseTextVisible}
								isAddVerseExpanded={isAddVerseExpanded}
								vernacularNamesObject={vernacularNamesObject}
							/>
						) : (
							<MyNotes
								getNotes={this.getNotes}
								deleteNote={this.deleteNote}
								setPageSize={this.setPageSize}
								getBookmarks={this.getBookmarks}
								getHighlights={this.getHighlights}
								setActiveNote={this.setActiveNote}
								setActivePage={this.setActivePage}
								setActiveChild={this.setActiveChild}
								deleteBookmark={this.deleteBookmark}
								updateHighlight={this.updateHighlight}
								deleteHighlights={this.deleteHighlights}
								togglePageSelector={this.togglePageSelector}
								pageSelectorState={pageSelectorState}
								vernacularNamesObject={vernacularNamesObject}
								listData={listData}
								highlights={userHighlights}
								sectionType={activeChild}
								pageSize={pageSize}
								totalPages={totalPages}
								bookmarkList={bookmarkList}
								activePage={activePage}
								toggleNotesModal={toggleNotesModal}
								pageSizeBookmark={pageSizeBookmark}
								totalPagesBookmark={totalPagesBookmark}
								activePageBookmark={activePageBookmark}
								pageSizeHighlight={pageSizeHighlight}
								totalPagesHighlight={totalPagesHighlight}
								activePageHighlight={activePageHighlight}
							/>
						)}
					</>
				) : (
					<PleaseSignInMessage message={'accessNotebook'} />
				)}
			</aside>
		);
	}
}

Notes.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleNotesModal: PropTypes.func,
	authenticationStatus: PropTypes.bool,
	isIe: PropTypes.bool,
	note: PropTypes.object,
	notes: PropTypes.object,
	vernacularNamesObject: PropTypes.object,
	userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	openView: PropTypes.string,
	notePassage: PropTypes.string,
	selectedText: PropTypes.string,
	activeTextId: PropTypes.string,
	activeBookName: PropTypes.string,
	activeBookId: PropTypes.string,
	activeChapter: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
	notes: makeSelectNotes(),
	selectedText: selectHighlightedText(),
	authenticationStatus: selectUserAuthenticationStatus(),
	userId: selectUserId(),
	note: selectActiveNote(),
	notePassage: selectNotePassage(),
	activeTextId: selectActiveTextId(),
	vernacularNamesObject: vernacularBookNameObject(),
	activeBookName: selectActiveBookName(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'notes', reducer });

export default compose(
	withReducer,
	withConnect,
)(Notes);
