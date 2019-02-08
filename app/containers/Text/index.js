/**
 *
 * Text
 * TODO: Split this up into components and isolate the different parts that do not need to be together
 * TODO: Find way to highlight and un-highlight verses without directly manipulating the dom by adding/removing classnames
 * TODO: Paramaterize addHighlight so it can be more easily tested and can be re-used
 */

import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../components/LoadingSpinner';
import getPreviousChapterUrl from '../../utils/getPreviousChapterUrl';
import getNextChapterUrl from '../../utils/getNextChapterUrl';
import {
	getClassNameForTextContainer,
	isEndOfBible,
	isStartOfBible,
} from './textRenderUtils';
const Verses = dynamic(import('../Verses'), {
	loading: () => <LoadingSpinner />,
});
const NewChapterArrow = dynamic(import('../../components/NewChapterArrow'), {
	loading: () => null,
});

/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
// Todo: Set selected text when user clicks a verse
class Text extends React.PureComponent {
	state = {
		loadingNextPage: false,
	};

	componentDidMount() {
		// Doing all these assignments because nextjs was erroring because they try to use the dom
		if (this.mainWrapper) {
			this.mainWrapper.focus();
		}
	}

	componentWillReceiveProps(nextProps) {
		// If there is new formatted text or new plain text then the menus need to be disabled
		// Change the loading state to be set and controlled within the API call and promise
		if (
			// If there was a change in the text at all then the menus need to be closed
			nextProps.verseNumber !== this.props.verseNumber ||
			nextProps.activeChapter !== this.props.activeChapter ||
			nextProps.activeBookId !== this.props.activeBookId ||
			nextProps.activeTextId !== this.props.activeTextId
		) {
			this.setState({ loadingNextPage: false });
		}
	}

	handleArrowClick = () => {
		this.setState({ loadingNextPage: true });
	};

	mainWrapperRef = (el) => {
		this.mainWrapper = el;
	};

	render() {
		const {
			activeChapter,
			text,
			loadingNewChapterText,
			verseNumber,
			activeTextId,
			activeBookId,
			books,
			menuIsOpen,
			isScrollingDown,
			audioPlayerState,
			subFooterOpen,
			chapterTextLoadingState,
			videoPlayerOpen,
			hasVideo,
			audioType,
			changingVersion,
		} = this.props;
		const { loadingNextPage } = this.state;

		if (
			loadingNewChapterText ||
			chapterTextLoadingState ||
			loadingNextPage ||
			changingVersion
		) {
			return (
				<div
					className={getClassNameForTextContainer({
						isScrollingDown,
						videoPlayerOpen,
						subFooterOpen,
						hasVideo,
					})}
				>
					<LoadingSpinner />
				</div>
			);
		}

		return (
			<div
				id="text-container-parent"
				className={getClassNameForTextContainer({
					isScrollingDown,
					videoPlayerOpen,
					subFooterOpen,
					hasVideo,
					audioPlayerState,
				})}
			>
				<NewChapterArrow
					getNewUrl={getPreviousChapterUrl}
					urlProps={{
						books,
						chapter: activeChapter,
						bookId: activeBookId.toLowerCase(),
						textId: activeTextId.toLowerCase(),
						verseNumber,
						text,
						audioType,
					}}
					clickHandler={this.handleArrowClick}
					disabled={
						isStartOfBible(books, activeBookId, activeChapter) || menuIsOpen
					}
					svgid={'arrow_left'}
					svgClasses={'prev-arrow-svg'}
					disabledContainerClasses={'arrow-wrapper prev disabled'}
					containerClasses={'arrow-wrapper prev'}
				/>
				<div ref={this.mainWrapperRef} className={'main-wrapper'}>
					<Verses menuIsOpen={menuIsOpen} />
				</div>
				<NewChapterArrow
					getNewUrl={getNextChapterUrl}
					urlProps={{
						books,
						chapter: activeChapter,
						bookId: activeBookId.toLowerCase(),
						textId: activeTextId.toLowerCase(),
						verseNumber,
						text,
						audioType,
					}}
					clickHandler={this.handleArrowClick}
					disabled={
						isEndOfBible(books, activeBookId, activeChapter) || menuIsOpen
					}
					svgid={'arrow_right'}
					svgClasses={'next-arrow-svg'}
					disabledContainerClasses={'arrow-wrapper next disabled'}
					containerClasses={'arrow-wrapper next'}
				/>
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
	books: PropTypes.array,
	activeChapter: PropTypes.number,
	hasVideo: PropTypes.bool,
	menuIsOpen: PropTypes.bool,
	subFooterOpen: PropTypes.bool,
	videoPlayerOpen: PropTypes.bool,
	changingVersion: PropTypes.bool,
	isScrollingDown: PropTypes.bool,
	audioPlayerState: PropTypes.bool,
	loadingNewChapterText: PropTypes.bool,
	chapterTextLoadingState: PropTypes.bool,
	audioType: PropTypes.string,
	verseNumber: PropTypes.string,
	activeTextId: PropTypes.string,
	activeBookId: PropTypes.string,
};

export default Text;
