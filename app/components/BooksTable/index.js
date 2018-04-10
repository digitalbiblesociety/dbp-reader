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
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import {
	getChapterText,
	// setActiveBookName,
	// setActiveChapter,
} from 'containers/HomePage/actions';
import LoadingSpinner from 'components/LoadingSpinner';
import {
	selectAuthenticationStatus,
	selectUserId,
} from 'containers/HomePage/selectors';
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

class BooksTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		selectedBookName: this.props.initialBookName || '',
	}

	componentDidMount() {
		if (this.button && this.container) {
			this.container.scrollTop = this.button.offsetTop - 54 - 10;
		}
		// console.log('component is remounting');
	}

	setSelectedBookName = (name) => this.setState({ selectedBookName: name })
	// setActiveBookName = ({ book, id }) => this.props.dispatch(setActiveBookName({ book, id }))
	// setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter))
	getChapterText = ({ bible, book, chapter }) => this.props.dispatch(getChapterText({ bible, book, chapter, audioObjects: this.props.audioObjects, hasTextInDatabase: this.props.hasTextInDatabase, formattedText: this.props.filesetTypes.text_formatt, userId: this.props.userId, userAuthenticated: this.props.userAuthenticated }))
	// Doesn't quite work, need to account for the overall height of the scroll container
	// Consider calculating the difference between the top of the clicked button and the
	// top of the active button, then if the clicked button is above the active button: move
	// add the difference to the current scroll position. Otherwise subtract the difference
	handleBookClick = (e, name) => {
		// Browsers using the Blink engine will cause the scrollTop to be set twice
		// I need to figure out a way to identify the engine used and then half the
		// newScrollTop for those browsers that use blink
		const book = e.target;
		const activeButton = this.button || { clientHeight: 0 };
		const clickedButton = book.parentElement;
		// if the clicked book was below the active book
		// console.log('clicked offset top', clickedButton.offsetTop);
		// console.log('active offset top', activeButton.offsetTop);
		// clicked offsetTop before activeButton is closed
		// the scroll top before activeButton is closed
		// clicked offsetTop after activeButton is closed
		// scrollTopBefore - (offsetTopBefore - offsetTopAfter);
		const offsetTopBefore = clickedButton.offsetTop;
		const offsetTopAfter = clickedButton.offsetTop - (activeButton.clientHeight - 28);
		// console.log('offset top before', offsetTopBefore);
		// console.log('offset top after', offsetTopAfter);
		// console.log('for this button', clickedButton);
		const scrollTopBefore = this.container.scrollTop;

		if (offsetTopBefore > offsetTopAfter) {
			// The glitch is appearing in Blink browsers so I am trying to make a work around for them
			if ((window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window) {
				// console.log('inside blink browser');
				// console.log('old container scroll top', this.container.scrollTop);
				// const newScrollTop = scrollTopBefore - (offsetTopBefore - (offsetTopAfter / 2));
				const newScrollTop = scrollTopBefore - (offsetTopBefore - offsetTopAfter);
				this.container.scrollTop = newScrollTop;
				// console.log('new container scroll top', this.container.scrollTop);
			} else {
				// console.log('inside non blink browser');
				// console.log('old container scroll top', this.container.scrollTop);
				const newScrollTop = scrollTopBefore - (offsetTopBefore - offsetTopAfter);
				this.container.scrollTop = newScrollTop;
				// console.log('new container scroll top', this.container.scrollTop);
			}
			// if ($) {
			// 	console.log('setting scroll top for blink');
			// 	$('.book-container').scrollTop(newScrollTop);
			// 	// this.container.scrollTop(newScrollTop);
			// } else {
			// 	console.log('setting scroll for other browsers');
			// 	this.container.scrollTop = newScrollTop;
			// }

			// console.log('old scroll top', this.container.scrollTop);
			// console.log('new scroll top', newScrollTop);
			// console.log('scroll top after it has been set', this.container.scrollTop);
		}

		// if (activeButton && activeButton.offsetTop < clickedButton.offsetTop) {
		// 	// console.log('previously active book height', activeButton.clientHeight);
		// 	// console.log('clicked button height', clickedButton.clientHeight);
		// 	// console.log('container element scroll position', this.container.scrollTop);
		// 	const newScrollTop = this.container.scrollTop - (activeButton.clientHeight - clickedButton.offsetTop);
		// 	// console.log('new scroll top', newScrollTop);
		// 	this.container.scrollTop = newScrollTop > 0 ? newScrollTop : 0;
		// 	// clickedButton.scrollIntoView();
		// }

		if (this.state.selectedBookName === name) {
			this.setSelectedBookName('');
		} else {
			this.setSelectedBookName(name);
		}
	}

	isElementInViewport = (el) => {
		const rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	handleChapterClick = (book, chapter) => {
		const {
			closeBookTable,
			setActiveChapter,
			setActiveBookName,
		} = this.props;

		setActiveChapter(chapter);
		setActiveBookName({ book: book.get('name') || book.get('name_short'), id: book.get('book_id') });
		closeBookTable();
	}

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
	}
	// TODO Split books into 2 arrays, NT and OT
	render() {
		const {
			books,
			activeTextId,
			activeChapter,
			activeBookName,
			loadingBooks,
		} = this.props;
		const { selectedBookName } = this.state;

		if (loadingBooks) {
			return <LoadingSpinner />;
		}
		return (
			<div className="chapter-selection-section">
				<div ref={(el) => this.handleRef(el, 'container')} className="book-container">
					<div className={'testament-title'}>Old Testament</div>
					{
						books.get('OT') && books.get('OT').map((book) => (
							<div
								className={'book-button'}
								ref={(book.get('name') || book.get('name_short')) === selectedBookName ? (el) => this.handleRef(el, 'button') : null}
								tabIndex="0"
								role="button"
								key={(book.get('name') || book.get('name_short')).concat(book.get('book_id'))}
								onClick={(e) => this.handleBookClick(e, book.get('name') || book.get('name_short'))}
							>
								<h4 className={(book.get('name') || book.get('name_short')) === selectedBookName ? 'active-book' : ''}>{book.get('name') || book.get('name_short')}</h4>
								{
									(book.get('name') || book.get('name_short')) && (book.get('name') || book.get('name_short')) === selectedBookName ? (
										<div className="chapter-container">
											{
												book.get('chapters').map((chapter) => (
													<span className={'chapter-box'}>
														<Link
															to={`/${activeTextId.toLowerCase()}/${book.get('book_id').toLowerCase()}/${chapter}`}
															key={chapter}
															onClick={() => this.handleChapterClick(book, chapter)}
														>
															<span className={(activeChapter === chapter && (book.get('name') || book.get('name_short')) === activeBookName) ? 'active-chapter' : ''}>{chapter}</span>
														</Link>
													</span>
												))
											}
										</div>
									) : null
								}
							</div>
						))
					}
					<div className={'testament-title'}>New Testament</div>
					{
						books.get('NT') && books.get('NT').map((book) => (
							<div
								className={'book-button'}
								ref={(book.get('name') || book.get('name_short')) === selectedBookName ? (el) => this.handleRef(el, 'button') : null}
								tabIndex="0"
								role="button"
								key={(book.get('name') || book.get('name_short')).concat(book.get('book_id'))}
								onClick={(e) => this.handleBookClick(e, book.get('name') || book.get('name_short'))}
							>
								<h4 className={(book.get('name') || book.get('name_short')) === selectedBookName ? 'active-book' : ''}>{book.get('name') || book.get('name_short')}</h4>
								{
									(book.get('name') || book.get('name_short')) && (book.get('name') || book.get('name_short')) === selectedBookName ? (
										<div className="chapter-container">
											{
												book.get('chapters').map((chapter) => (
													<span className={'chapter-box'}>
														<Link
															to={`/${activeTextId.toLowerCase()}/${book.get('book_id').toLowerCase()}/${chapter}`}
															key={chapter}
															onClick={() => this.handleChapterClick(book, chapter)}
														>
															<span className={(activeChapter === chapter && (book.get('name') || book.get('name_short')) === activeBookName) ? 'active-chapter' : ''}>{chapter}</span>
														</Link>
													</span>
												))
											}
										</div>
									) : null
								}
							</div>
						))
					}
					{
						books.get('AP') ? [
							<div className={'testament-title'}>Apocrypha</div>,
							books.get('AP').map((book) => (
								<div
									className={'book-button'}
									ref={(book.get('name') || book.get('name_short')) === selectedBookName ? (el) => this.handleRef(el, 'button') : null}
									tabIndex="0"
									role="button"
									key={(book.get('name') || book.get('name_short')).concat(book.get('book_id'))}
									onClick={(e) => this.handleBookClick(e, book.get('name') || book.get('name_short'))}
								>
									<h4 className={(book.get('name') || book.get('name_short')) === selectedBookName ? 'active-book' : ''}>{book.get('name') || book.get('name_short')}</h4>
									{
										(book.get('name') || book.get('name_short')) && (book.get('name') || book.get('name_short')) === selectedBookName ? (
											<div className="chapter-container">
												{
													book.get('chapters').map((chapter) => (
														<span className={'chapter-box'}>
															<Link
																to={`/${activeTextId.toLowerCase()}/${book.get('book_id').toLowerCase()}/${chapter}`}
																key={chapter}
																onClick={() => this.handleChapterClick(book, chapter)}
															>
																<span className={(activeChapter === chapter && (book.get('name') || book.get('name_short')) === activeBookName) ? 'active-chapter' : ''}>{chapter}</span>
															</Link>
														</span>
													))
												}
											</div>
										) : null
									}
								</div>
							)),
						] : null
					}
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
	books: PropTypes.array,
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

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(BooksTable);
