/**
 *
 * Text
 * TODO: Split this up into components and isolate the different parts that do not need to be together
 * TODO: Find way to highlight and un-highlight verses without directly manipulating the dom by adding/removing classnames
 * TODO: Paramaterize addHighlight so it can be more easily tested and can be re-used
 */

import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../components/LoadingSpinner';
import getPreviousChapterUrl from '../../utils/getPreviousChapterUrl';
import getNextChapterUrl from '../../utils/getNextChapterUrl';
import {
	getClassNameForTextContainer,
	isEndOfBible,
	isStartOfBible,
} from './textRenderUtils';
import createFormattedHighlights from './highlightFormattedText';
import {
	applyNotes,
	applyBookmarks,
	applyWholeVerseHighlights,
} from './formattedTextUtils';
import setEventHandlersForFormattedVerses from '../../utils/requiresDom/setEventHandlersForFormattedVerses';
import setEventHandlersForFootnotes from '../../utils/requiresDom/setEventHandlersForFootnotes';
import Verses from '../Verses';
// import NewChapterArrow from '../../components/NewChapterArrow';

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
		this.createFormattedHighlights = createFormattedHighlights;
		this.applyWholeVerseHighlights = applyWholeVerseHighlights;
		this.applyNotes = applyNotes;
		this.applyBookmarks = applyBookmarks;
		this.window = window;

		if (this.format) {
			setEventHandlersForFootnotes(this.format, this.openFootnote);
			setEventHandlersForFormattedVerses(this.format, {
				mouseDown: this.getFirstVerse,
				mouseUp: this.handleMouseUp,
				bookmarkClick: this.handleNoteClick,
				noteClick: this.handleNoteClick,
			});
		} else if (this.formatHighlight) {
			setEventHandlersForFootnotes(this.formatHighlight, this.openFootnote);
			setEventHandlersForFormattedVerses(this.formatHighlight, {
				mouseDown: this.getFirstVerse,
				mouseUp: this.handleMouseUp,
				bookmarkClick: this.handleNoteClick,
				noteClick: this.handleNoteClick,
			});
		}
		this.domMethodsAvailable();
		// Need to get the footnotes here because I need to parse the html
		this.getFootnotesOnFirstRender();

		if (this.mainWrapper) {
			this.mainWrapper.focus();
		}
	}

	// I am using this function because it means that the component finished updating and that the dom is available
	componentDidUpdate(prevProps, prevState) {
		if (
			this.main &&
			(this.format || this.formatHighlight) &&
			this.state.activeVerseInfo.isPlain === false &&
			this.state.activeVerseInfo.verse !== prevState.activeVerseInfo.verse &&
			this.state.activeVerseInfo.verse
		) {
			// Add the highlight to the new active verse
			const verse = this.state.activeVerseInfo.verse;
			const verseNodes = [
				...this.main.querySelectorAll(
					`[data-id="${this.props.activeBookId}${
						this.props.activeChapter
					}_${verse}"]`,
				),
			];
			if (verseNodes.length) {
				verseNodes.forEach(
					(n) => (n.className = `${n.className} active-verse`), // eslint-disable-line no-param-reassign
				);
			}
			// Remove the highlight from the old active verse
			const prevVerse = prevState.activeVerseInfo.verse;
			const prevVerseNodes = [
				...this.main.querySelectorAll(
					`[data-id="${this.props.activeBookId}${
						this.props.activeChapter
					}_${prevVerse}"]`,
				),
			];
			if (prevVerseNodes.length) {
				// Slicing the classname since the last 13 characters are the highlighted classname that needs to be removed
				prevVerseNodes.forEach(
					(n) => (n.className = n.className.slice(0, -13)), // eslint-disable-line no-param-reassign
				);
			}
		} else if (
			this.main &&
			(this.format || this.formatHighlight) &&
			this.state.activeVerseInfo.isPlain === false
		) {
			// Remove the highlight from the old active verse
			const prevVerse = prevState.activeVerseInfo.verse;
			const prevVerseNodes = [
				...this.main.querySelectorAll(
					`[data-id="${this.props.activeBookId}${
						this.props.activeChapter
					}_${prevVerse}"]`,
				),
			];
			if (prevVerseNodes.length) {
				prevVerseNodes.forEach(
					(n) => (n.className = n.className.slice(0, -13)), // eslint-disable-line no-param-reassign
				);
			}
		}

		if (
			this.props.formattedSource.footnoteSource &&
			this.props.formattedSource.footnoteSource !==
				prevProps.formattedSource.footnoteSource
		) {
			// Safety check since I use browser apis and the first render is on the server
			if (this.props.formattedSource.footnoteSource) {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(
					this.props.formattedSource.footnoteSource,
					'text/xml',
				);
				// Parses the footnotes and creates the object used to render the footnote popups
				const footnotes =
					[...xmlDoc.querySelectorAll('.footnote')].reduce((a, n) => {
						let node = n;
						let safeGuard = 0;
						while ((node && !node.attributes.id) || safeGuard >= 10) {
							node = node.parentElement;
							safeGuard += 1;
						}
						if (node && node.attributes.id) {
							return {
								...a,
								[node.attributes.id.value.slice(4)]: node.textContent,
							};
						}
						return a;
					}, {}) || {};

				this.callSetStateNotInUpdate(footnotes);
			}
		}
		// Logic below ensures that the proper event handlers are set on each footnote
		if (
			this.props.formattedSource.main &&
			prevProps.formattedSource.main !== this.props.formattedSource.main &&
			(this.format || this.formatHighlight)
		) {
			if (this.format) {
				setEventHandlersForFootnotes(this.format, this.openFootnote);
				setEventHandlersForFormattedVerses(this.format, {
					mouseDown: this.getFirstVerse,
					mouseUp: this.handleMouseUp,
					bookmarkClick: this.handleNoteClick,
					noteClick: this.handleNoteClick,
				});
			} else if (this.formatHighlight) {
				setEventHandlersForFootnotes(this.formatHighlight, this.openFootnote);
				setEventHandlersForFormattedVerses(this.formatHighlight, {
					mouseDown: this.getFirstVerse,
					mouseUp: this.handleMouseUp,
					bookmarkClick: this.handleNoteClick,
					noteClick: this.handleNoteClick,
				});
			}
		} else if (
			!isEqual(this.props.highlights, prevProps.highlights) &&
			this.formatHighlight
		) {
			setEventHandlersForFootnotes(this.formatHighlight, this.openFootnote);
			setEventHandlersForFormattedVerses(this.formatHighlight, {
				mouseDown: this.getFirstVerse,
				mouseUp: this.handleMouseUp,
				bookmarkClick: this.handleNoteClick,
				noteClick: this.handleNoteClick,
			});
		} else if (
			prevProps.userSettings.getIn([
				'toggleOptions',
				'readersMode',
				'active',
			]) !==
				this.props.userSettings.getIn([
					'toggleOptions',
					'readersMode',
					'active',
				]) &&
			!this.props.userSettings.getIn([
				'toggleOptions',
				'readersMode',
				'active',
			]) &&
			(this.formatHighlight || this.format)
		) {
			// Need to set event handlers again here because they are removed once the plain text is rendered
			if (this.format) {
				setEventHandlersForFootnotes(this.format, this.openFootnote);
				setEventHandlersForFormattedVerses(this.format, {
					mouseDown: this.getFirstVerse,
					mouseUp: this.handleMouseUp,
					bookmarkClick: this.handleNoteClick,
					noteClick: this.handleNoteClick,
				});
			} else if (this.formatHighlight) {
				setEventHandlersForFootnotes(this.formatHighlight, this.openFootnote);
				setEventHandlersForFormattedVerses(this.formatHighlight, {
					mouseDown: this.getFirstVerse,
					mouseUp: this.handleMouseUp,
					bookmarkClick: this.handleNoteClick,
					noteClick: this.handleNoteClick,
				});
			}
		}

		// This handles setting the events on a page refresh or navigation via url
		if (this.format && !this.props.loadingNewChapterText) {
			setEventHandlersForFootnotes(this.format, this.openFootnote);
			setEventHandlersForFormattedVerses(this.format, {
				mouseDown: this.getFirstVerse,
				mouseUp: this.handleMouseUp,
				bookmarkClick: this.handleNoteClick,
				noteClick: this.handleNoteClick,
			});
		} else if (this.formatHighlight && !this.props.loadingNewChapterText) {
			setEventHandlersForFootnotes(this.formatHighlight, this.openFootnote);
			setEventHandlersForFormattedVerses(this.formatHighlight, {
				mouseDown: this.getFirstVerse,
				mouseUp: this.handleMouseUp,
				bookmarkClick: this.handleNoteClick,
				noteClick: this.handleNoteClick,
			});
		}
	}

	setFormattedRefHighlight = (el) => {
		this.formatHighlight = el;
	};

	setFormattedRef = (el) => {
		this.format = el;
	};

	// Use selected text only when marking highlights

	getFootnotesOnFirstRender = () => {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(
			this.props.formattedSource.footnoteSource,
			'text/html',
		);

		const footnotes =
			[...xmlDoc.querySelectorAll('.footnote')].reduce((a, n) => {
				let node = n;
				let safeGuard = 0;
				while ((node && !node.attributes.id) || safeGuard >= 10) {
					node = node.parentElement;
					safeGuard += 1;
				}
				if (node && node.attributes.id) {
					return {
						...a,
						[node.attributes.id.value.slice(4)]: node.textContent,
					};
				}
				return a;
			}, {}) || {};

		this.setState({
			footnoteState: false,
			footnotes,
		});
	};

	handleArrowClick = () => {
		this.setState({ loadingNextPage: true });
	};

	// Probably need to stop doing this here
	callSetStateNotInUpdate = (footnotes) => this.setState({ footnotes });

	domMethodsAvailable = () => this.setState({ domMethodsAvailable: true });

	mainWrapperRef = (el) => {
		this.mainWrapper = el;
	};

	render() {
		const {
			activeChapter,
			text,
			loadingNewChapterText,
			loadingAudio,
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
		} = this.props;

		if (
			loadingNewChapterText ||
			loadingAudio ||
			this.state.loadingNextPage ||
			chapterTextLoadingState
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
					<Verses mainRef={this.mainRef} menuIsOpen={menuIsOpen} />
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
	highlights: PropTypes.array,
	userSettings: PropTypes.object,
	formattedSource: PropTypes.object,
	activeChapter: PropTypes.number,
	hasVideo: PropTypes.bool,
	menuIsOpen: PropTypes.bool,
	loadingAudio: PropTypes.bool,
	subFooterOpen: PropTypes.bool,
	isScrollingDown: PropTypes.bool,
	videoPlayerOpen: PropTypes.bool,
	chapterTextLoadingState: PropTypes.bool,
	audioPlayerState: PropTypes.bool,
	loadingNewChapterText: PropTypes.bool,
	verseNumber: PropTypes.string,
	activeTextId: PropTypes.string,
	activeBookId: PropTypes.string,
};

export default Text;
