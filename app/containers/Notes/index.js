/**
 *
 * Notes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import SvgWrapper from 'components/SvgWrapper';
import EditNote from 'components/EditNote';
import MyNotes from 'components/MyNotes';
import menu from 'images/menu.svg';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import {
	getChapterText,
	setActiveChapter,
	setActiveBookName,
	setSelectedBookName,
} from 'containers/HomePage/actions';
import {
	setActiveChild,
	setActiveNote,
	setPageSize,
	toggleVerseText,
	toggleAddVerseMenu,
	togglePageSelector,
	setActivePageData,
	addNote,
	addBookmark,
	addHighlight,
} from './actions';
import makeSelectNotes, {
	selectHighlightedText,
	selectBooks,
	selectActiveBookName,
	selectActiveTextId,
	selectActiveChapter,
	selectActiveFilesets,
	selectSelectedBookName,
	selectUserAuthenticationStatus,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class Notes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.props.dispatch(setActiveChild(props.openView));
	}

	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	setActiveChild = (child) => this.props.dispatch(setActiveChild(child))

	setActivePageData = (page) => this.props.dispatch(setActivePageData(page))

	setActiveNote = ({ note }) => this.props.dispatch(setActiveNote({ note }))

	setPageSize = (size) => this.props.dispatch(setPageSize(size))

	setActiveChapter = (props) => this.props.dispatch(setActiveChapter(props))

	setActiveBookName = (props) => this.props.dispatch(setActiveBookName(props))

	setSelectedBookName = (book) => this.props.dispatch(setSelectedBookName(book))

	getChapters = (props) => this.props.dispatch(getChapterText({ ...props, audioObjects: this.props.activeFilesets }))

	toggleVerseText = () => this.props.dispatch(toggleVerseText())

	toggleAddVerseMenu = () => this.props.dispatch(toggleAddVerseMenu())

	togglePageSelector = () => this.props.dispatch(togglePageSelector())

	addBookmark = ({ userId, data }) => this.props.dispatch(addBookmark({ userId, data }))

	addHighlight = ({ userId, data }) => this.props.dispatch(addHighlight({ userId, data }))

	addNote = ({ userId, data }) => this.props.dispatch(addNote({ userId, data }))

	titleOptions = {
		edit: 'EDIT NOTE',
		notes: 'MY NOTES',
		bookmarks: 'MY BOOKMARKS',
		highlights: 'MY HIGHLIGHTS',
	}

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleNotesModal();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	render() {
		const {
			activeChild,
			listData,
			note,
			isAddVerseExpanded,
			isVerseTextVisible,
			activePageData,
			paginationPageSize: pageSize,
			pageSelectorState,
		} = this.props.notes;
		const {
			toggleNotesModal,
			selectedText,
			activeTextId,
			activeChapter,
			books,
			activeBookName,
			selectedBookName,
			authenticationStatus,
			toggleProfile,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="Notes">
				<aside ref={this.setRef} className="notes">
					<header>
						<h2 className="section-title">NOTEBOOK</h2>
						<span role="button" tabIndex={0} className="close-icon" onClick={() => { setActiveChild('notes'); toggleNotesModal(); }}>
							<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
						</span>
					</header>
					{
						authenticationStatus ? (
							<React.Fragment>
								<div className="top-bar">
									{
										activeChild === 'notes' ? (
											<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('edit')} className={activeChild === 'notes' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="note-list" />
										) : null
									}
									{
										activeChild !== 'notes' ? (
											<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('notes')} className={activeChild === 'edit' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="notes" />
										) : null
									}
									<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('highlights')} className={activeChild === 'highlights' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="highlights" />
									<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('bookmarks')} className={activeChild === 'bookmarks' ? 'svg active' : 'svg'} height="30px" width="30px" svgid="bookmarks" />
									<span className="text">{this.titleOptions[activeChild]}</span>
								</div>
								{
									activeChild === 'edit' ? (
										<EditNote
											getChapterText={this.getChapters}
											toggleVerseText={this.toggleVerseText}
											setActiveChapter={this.setActiveChapter}
											setActiveBookName={this.setActiveBookName}
											toggleAddVerseMenu={this.toggleAddVerseMenu}
											setSelectedBookName={this.setSelectedBookName}
											note={note}
											books={books}
											selectedText={selectedText}
											activeTextId={activeTextId}
											activeChapter={activeChapter}
											activeBookName={activeBookName}
											selectedBookName={selectedBookName}
											isVerseTextVisible={isVerseTextVisible}
											isAddVerseExpanded={isAddVerseExpanded}
										/>
									) : (
										<MyNotes
											setPageSize={this.setPageSize}
											setActiveNote={this.setActiveNote}
											setActiveChild={this.setActiveChild}
											setActivePageData={this.setActivePageData}
											togglePageSelector={this.togglePageSelector}
											listData={listData}
											pageSize={pageSize}
											sectionType={activeChild}
											activePageData={activePageData}
											pageSelectorState={pageSelectorState}
										/>
									)
								}
							</React.Fragment>
						) : (
							<div className="need-to-login">
								Please <span className="login-text" role="button" tabIndex={0} onClick={() => { toggleNotesModal(); toggleProfile(); }}>Login</span> to access the notebook
							</div>
						)
					}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

Notes.propTypes = {
	dispatch: PropTypes.func.isRequired,
	notes: PropTypes.object.isRequired,
	toggleNotesModal: PropTypes.func.isRequired,
	openView: PropTypes.string.isRequired,
	selectedText: PropTypes.string,
	activeChapter: PropTypes.number.isRequired,
	books: PropTypes.array,
	activeBookName: PropTypes.string.isRequired,
	activeTextId: PropTypes.string.isRequired,
	activeFilesets: PropTypes.object.isRequired,
	selectedBookName: PropTypes.string,
	authenticationStatus: PropTypes.bool,
	toggleProfile: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	notes: makeSelectNotes(),
	selectedText: selectHighlightedText(),
	activeBookName: selectActiveBookName(),
	activeTextId: selectActiveTextId(),
	activeChapter: selectActiveChapter(),
	books: selectBooks(),
	activeFilesets: selectActiveFilesets(),
	selectedBookName: selectSelectedBookName(),
	authenticationStatus: selectUserAuthenticationStatus(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'notes', reducer });
const withSaga = injectSaga({ key: 'notes', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Notes);
