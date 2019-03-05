/**
 *
 * BooksTable
 *
 */

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import BooksTestament from '../BooksTestament';
import {
	selectAuthenticationStatus,
	selectUserId,
	selectAudioType,
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
import { selectTextDirection } from '../../containers/Verses/selectors';

export class BooksTable extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		selectedBookName:
			this.props.initialBookName || this.props.activeBookName || '',
		updateScrollTop: false,
	};

	componentDidMount() {
		if (this.button && this.container) {
			this.container.scrollTop = this.button.offsetTop - 54 - 10;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active !== this.props.active && nextProps.active) {
			this.setState({ selectedBookName: nextProps.activeBookName });
		}
	}

	setScrollTop = (book, positionBefore, scrollTopBefore) => {
		const positionAfter = book.parentElement.offsetTop; // not sure about parentElement

		if (positionBefore > positionAfter) {
			const newScrollTop = scrollTopBefore - (positionBefore - positionAfter);

			this.container.scrollTop = newScrollTop;
		}
	};

	handleBookClick = (e, name) => {
		typeof e.persist === 'function' && e.persist(); // eslint-disable-line no-unused-expressions
		const positionBefore = e.target.parentElement.offsetTop;
		const scrollTopBefore = this.container.scrollTop;

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

	handleChapterClick = () => {
		sessionStorage.setItem('bible_is_maintain_location', JSON.stringify(true));
		this.props.closeBookTable();
	};

	handleRef = (el, name) => {
		this[name] = el;
	};

	render() {
		const {
			books,
			audioType,
			activeTextId,
			activeChapter,
			activeBookName,
			loadingBooks,
			textDirection,
		} = this.props;
		const { selectedBookName } = this.state;

		if (loadingBooks) {
			return <LoadingSpinner />;
		}
		return (
			<div
				className={
					textDirection === 'rtl'
						? 'chapter-selection-section rtl'
						: 'chapter-selection-section'
				}
			>
				<div
					ref={(el) => this.handleRef(el, 'container')}
					className="book-container"
				>
					{!!books.get('OT') && (
						<BooksTestament
							books={books.get('OT')}
							testamentPrefix={'ot'}
							testamentTitle={'Old Testament'}
							selectedBookName={selectedBookName}
							handleRef={this.handleRef}
							handleBookClick={this.handleBookClick}
							handleChapterClick={this.handleChapterClick}
							audioType={audioType}
							activeBookName={activeBookName}
							activeTextId={activeTextId}
							activeChapter={activeChapter}
						/>
					)}
					{!!books.get('NT') && (
						<BooksTestament
							books={books.get('NT')}
							testamentPrefix={'nt'}
							testamentTitle={'New Testament'}
							selectedBookName={selectedBookName}
							handleRef={this.handleRef}
							handleBookClick={this.handleBookClick}
							handleChapterClick={this.handleChapterClick}
							audioType={audioType}
							activeBookName={activeBookName}
							activeTextId={activeTextId}
							activeChapter={activeChapter}
						/>
					)}
					{!!books.get('AP') && (
						<BooksTestament
							books={books.get('AP')}
							testamentPrefix={'ap'}
							testamentTitle={'Apocrypha'}
							selectedBookName={selectedBookName}
							handleRef={this.handleRef}
							handleBookClick={this.handleBookClick}
							handleChapterClick={this.handleChapterClick}
							audioType={audioType}
							activeBookName={activeBookName}
							activeTextId={activeTextId}
							activeChapter={activeChapter}
						/>
					)}
				</div>
			</div>
		);
	}
}

BooksTable.propTypes = {
	closeBookTable: PropTypes.func,
	books: PropTypes.object,
	audioType: PropTypes.string,
	activeTextId: PropTypes.string,
	activeBookName: PropTypes.string,
	initialBookName: PropTypes.string,
	textDirection: PropTypes.string,
	activeChapter: PropTypes.number,
	loadingBooks: PropTypes.bool,
	active: PropTypes.bool,
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
	audioType: selectAudioType(),
	// Verses selector
	textDirection: selectTextDirection(),
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
