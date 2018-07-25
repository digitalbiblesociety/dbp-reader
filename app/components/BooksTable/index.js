/**
 *
 * BooksTable
 *
 */
// let $;
// if ((window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window) {
// 	console.log('importing jq');
// 	$ = require('jquery');
// }

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import {
	getChapterText,
	// setActiveBookName,
	// setActiveChapter,
} from '../../containers/HomePage/actions';
import LoadingSpinner from '../LoadingSpinner';
import ChaptersContainer from '../ChaptersContainer';
import {
	selectAuthenticationStatus,
	selectUserId,
} from '../../containers/HomePage/selectors';
import {
	selectActiveTextId,
	selectBooks,
	selectActiveBookName,
	selectActiveChapter,
	selectAudioObjects,
	selectHasTextInDatabase,
	selectFilesetTypes,
	selectLoadingBookStatus,
} from './selectors';

class BooksTable extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		selectedBookName: this.props.initialBookName || '',
		updateScrollTop: false,
	};

	componentDidMount() {
		if (this.button && this.container) {
			this.container.scrollTop = this.button.offsetTop - 54 - 10;
		}
		// console.log('component is remounting');
	}

	componentDidUpdate() {
		// console.log('Stuff should change');
	}
	// setActiveBookName = ({ book, id }) => this.props.dispatch(setActiveBookName({ book, id }))
	// setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter))
	getChapterText = ({ bible, book, chapter }) =>
		this.props.dispatch(
			getChapterText({
				bible,
				book,
				chapter,
				audioObjects: this.props.audioObjects,
				hasTextInDatabase: this.props.hasTextInDatabase,
				formattedText: this.props.filesetTypes.text_formatt,
				userId: this.props.userId,
				userAuthenticated: this.props.userAuthenticated,
			}),
		);

	setScrollTop = (book, positionBefore, scrollTopBefore) => {
		const positionAfter = book.parentElement.offsetTop; // not sure about parentElement

		if (positionBefore > positionAfter) {
			const newScrollTop = scrollTopBefore - (positionBefore - positionAfter);
			// console.log('scrollTopBefore', scrollTopBefore);
			// console.log('newScrollTop', newScrollTop);
			this.container.scrollTop = newScrollTop;
		}
	};

	handleBookClick = (e, name) => {
		typeof e.persist === 'function' && e.persist(); // eslint-disable-line no-unused-expressions
		// console.log('this.button before setstate', this.button);
		const positionBefore = e.target.parentElement.offsetTop;
		const scrollTopBefore = this.container.scrollTop;
		// const previousButton = this.button;

		if (this.state.selectedBookName === name) {
			this.setState(
				() => ({
					selectedBookName: '',
				}),
				() => {
					this.setScrollTop(e.target);
				},
			);
		} else {
			this.setState(
				() => ({
					selectedBookName: name,
				}),
				() => {
					this.setScrollTop(e.target, positionBefore, scrollTopBefore);
				},
			);
		}
	};

	isElementInViewport = (el) => {
		const rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	handleChapterClick = (book, chapter) => {
		const { closeBookTable, setActiveChapter, setActiveBookName } = this.props;

		setActiveChapter(chapter);
		setActiveBookName({
			book: book.get('name') || book.get('name_short'),
			id: book.get('book_id'),
		});
		closeBookTable();
	};

	handleRef = (el, name) => {
		if (name === 'button' && el) {
			const lastChapter = el.lastChild.lastChild;
			const bookName = el.firstChild;
			// console.log('the new button ref', el);
			// console.log('the new button ref offsetTop', el.offsetTop);
			if (!this.isElementInViewport(lastChapter)) {
				// lastChapter.scrollIntoView(false);
			}

			if (!this.isElementInViewport(bookName)) {
				// bookName.scrollIntoView();
			}
		}
		this[name] = el;
	};

	render() {
		const {
			books,
			activeTextId,
			activeChapter,
			activeBookName,
			loadingBooks,
		} = this.props;
		const { selectedBookName } = this.state;
		// console.log('Rendering again');
		// console.log('books', books);
		// console.log('this.props', this.props);

		if (loadingBooks) {
			return <LoadingSpinner />;
		}
		return (
			<div className="chapter-selection-section">
				<div
					ref={(el) => this.handleRef(el, 'container')}
					className="book-container"
				>
					{books.get('OT')
						? [
								<div key={'ot_title_key'} className={'testament-title'}>
									<h3>Old Testament</h3>
								</div>,
								books.get('OT') &&
									books.get('OT').map((book) => (
										<div
											className={'book-button'}
											ref={
												(book.get('name') || book.get('name_short')) ===
												selectedBookName
													? (el) => this.handleRef(el, 'button')
													: null
											}
											tabIndex="0"
											role="button"
											key={(book.get('name') || book.get('name_short')).concat(
												book.get('book_id'),
											)}
											onClick={(e) =>
												this.handleBookClick(
													e,
													book.get('name') || book.get('name_short'),
												)
											}
										>
											<h4
												className={
													(book.get('name') || book.get('name_short')) ===
													selectedBookName
														? 'active-book'
														: ''
												}
											>
												{book.get('name') || book.get('name_short')}
											</h4>
											<ChaptersContainer
												bookName={book.get('name')}
												bookNameShort={book.get('name_short')}
												activeTextId={activeTextId}
												activeChapter={activeChapter}
												handleChapterClick={this.handleChapterClick}
												chapters={book.get('chapters')}
												selectedBookName={selectedBookName}
												activeBookName={activeBookName}
												bookId={book.get('book_id')}
												book={book}
											/>
										</div>
									)),
						  ]
						: null}
					{books.get('NT')
						? [
								<div key={'nt_title_key'} className={'testament-title'}>
									<h3>New Testament</h3>
								</div>,
								books.get('NT').map((book) => (
									<div
										className={'book-button'}
										ref={
											(book.get('name') || book.get('name_short')) ===
											selectedBookName
												? (el) => this.handleRef(el, 'button')
												: null
										}
										tabIndex="0"
										role="button"
										key={(book.get('name') || book.get('name_short')).concat(
											book.get('book_id'),
										)}
										onClick={(e) =>
											this.handleBookClick(
												e,
												book.get('name') || book.get('name_short'),
											)
										}
									>
										<h4
											className={
												(book.get('name') || book.get('name_short')) ===
												selectedBookName
													? 'active-book'
													: ''
											}
										>
											{book.get('name') || book.get('name_short')}
										</h4>
										<ChaptersContainer
											bookName={book.get('name')}
											bookNameShort={book.get('name_short')}
											activeTextId={activeTextId}
											activeChapter={activeChapter}
											handleChapterClick={this.handleChapterClick}
											chapters={book.get('chapters')}
											selectedBookName={selectedBookName}
											activeBookName={activeBookName}
											bookId={book.get('book_id')}
											book={book}
										/>
									</div>
								)),
						  ]
						: null}
					{books.get('AP')
						? [
								<div key={'ap_title_key'} className={'testament-title'}>
									<h3>Apocrypha</h3>
								</div>,
								books.get('AP').map((book) => (
									<div
										className={'book-button'}
										ref={
											(book.get('name') || book.get('name_short')) ===
											selectedBookName
												? (el) => this.handleRef(el, 'button')
												: null
										}
										tabIndex="0"
										role="button"
										key={(book.get('name') || book.get('name_short')).concat(
											book.get('book_id'),
										)}
										onClick={(e) =>
											this.handleBookClick(
												e,
												book.get('name') || book.get('name_short'),
											)
										}
									>
										<h4
											className={
												(book.get('name') || book.get('name_short')) ===
												selectedBookName
													? 'active-book'
													: ''
											}
										>
											{book.get('name') || book.get('name_short')}
										</h4>
										<ChaptersContainer
											bookName={book.get('name')}
											bookNameShort={book.get('name_short')}
											activeTextId={activeTextId}
											activeChapter={activeChapter}
											handleChapterClick={this.handleChapterClick}
											chapters={book.get('chapters')}
											selectedBookName={selectedBookName}
											activeBookName={activeBookName}
											bookId={book.get('book_id')}
											book={book}
										/>
									</div>
								)),
						  ]
						: null}
				</div>
			</div>
		);
	}
}

BooksTable.propTypes = {
	dispatch: PropTypes.func,
	closeBookTable: PropTypes.func, // closes the window open
	setActiveChapter: PropTypes.func, // Set chapter in parent component
	setActiveBookName: PropTypes.func, // Set book in parent component
	books: PropTypes.object,
	audioObjects: PropTypes.array,
	userId: PropTypes.string,
	activeTextId: PropTypes.string, // parent components active text id
	activeBookName: PropTypes.string, // parent components active book name
	initialBookName: PropTypes.string,
	activeChapter: PropTypes.number, // parent components active chapter
	loadingBooks: PropTypes.bool,
	userAuthenticated: PropTypes.bool,
	hasTextInDatabase: PropTypes.bool,
	filesetTypes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	books: selectBooks(),
	activeTextId: selectActiveTextId(),
	activeBookName: selectActiveBookName(),
	activeChapter: selectActiveChapter(),
	audioObjects: selectAudioObjects(),
	hasTextInDatabase: selectHasTextInDatabase(),
	filesetTypes: selectFilesetTypes(),
	loadingBooks: selectLoadingBookStatus(),
	userAuthenticated: selectAuthenticationStatus(),
	userId: selectUserId(),
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

export default compose(withConnect)(BooksTable);
