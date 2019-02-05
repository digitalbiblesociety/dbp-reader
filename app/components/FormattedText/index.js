/**
 *
 * FormattedText
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import createFormattedHighlights from '../../containers/Text/highlightFormattedText';
import {
	applyNotes,
	applyBookmarks,
	applyWholeVerseHighlights,
} from '../../containers/Text/formattedTextUtils';
import setEventHandlersForFormattedVerses from '../../utils/requiresDom/setEventHandlersForFormattedVerses';
import setEventHandlersForFootnotes from '../../utils/requiresDom/setEventHandlersForFootnotes';

class FormattedText extends React.PureComponent {
	state = {
		// footnoteState: false,
		footnotes: {},
		domMethodsAvailable: false,
	};

	componentDidMount() {
		const {
			getFirstVerse,
			handleMouseUp,
			handleNoteClick,
			openFootnote,
		} = this.props;
		if (this.formatRef) {
			setEventHandlersForFootnotes(this.formatRef, openFootnote);
			setEventHandlersForFormattedVerses(this.formatRef, {
				mouseDown: getFirstVerse,
				mouseUp: handleMouseUp,
				bookmarkClick: handleNoteClick,
				noteClick: handleNoteClick,
			});
		} else if (this.formatHighlightRef) {
			setEventHandlersForFootnotes(this.formatHighlightRef, openFootnote);
			setEventHandlersForFormattedVerses(this.formatHighlightRef, {
				mouseDown: getFirstVerse,
				mouseUp: handleMouseUp,
				bookmarkClick: handleNoteClick,
				noteClick: handleNoteClick,
			});
		}

		this.getFootnotesOnFirstRender();
		this.domMethodsAvailable();
	}

	// I am using this function because it means that the component finished updating and that the dom is available
	componentDidUpdate(prevProps) {
		const {
			mainRef,
			activeVerseInfo,
			activeBookId,
			activeChapter,
			formattedSource,
			highlights,
			userSettings,
			getFirstVerse,
			handleMouseUp,
			handleNoteClick,
			openFootnote,
		} = this.props;
		if (
			mainRef &&
			(this.formatRef || this.formatHighlightRef) &&
			activeVerseInfo.isPlain === false &&
			activeVerseInfo.verse !== prevProps.activeVerseInfo.verse &&
			activeVerseInfo.verse
		) {
			// Add the highlight to the new active verse
			const verse = activeVerseInfo.verse;
			const verseNodes = [
				...mainRef.querySelectorAll(
					`[data-id="${activeBookId}${activeChapter}_${verse}"]`,
				),
			];
			if (verseNodes.length) {
				verseNodes.forEach(
					(n) => (n.className = `${n.className} active-verse`), // eslint-disable-line no-param-reassign
				);
			}
			// Remove the highlight from the old active verse
			const prevVerse = prevProps.activeVerseInfo.verse;
			const prevVerseNodes = [
				...mainRef.querySelectorAll(
					`[data-id="${activeBookId}${activeChapter}_${prevVerse}"]`,
				),
			];
			if (prevVerseNodes.length) {
				// Slicing the classname since the last 13 characters are the highlighted classname that needs to be removed
				prevVerseNodes.forEach(
					(n) => (n.className = n.className.slice(0, -13)), // eslint-disable-line no-param-reassign
				);
			}
		} else if (
			mainRef &&
			(this.formatRef || this.formatHighlightRef) &&
			activeVerseInfo.isPlain === false
		) {
			// Remove the highlight from the old active verse
			const prevVerse = prevProps.activeVerseInfo.verse;
			const prevVerseNodes = [
				...mainRef.querySelectorAll(
					`[data-id="${activeBookId}${activeChapter}_${prevVerse}"]`,
				),
			];
			if (prevVerseNodes.length) {
				prevVerseNodes.forEach(
					(n) => (n.className = n.className.slice(0, -13)), // eslint-disable-line no-param-reassign
				);
			}
		}

		if (
			formattedSource.footnoteSource &&
			formattedSource.footnoteSource !==
				prevProps.formattedSource.footnoteSource
		) {
			// Safety check since I use browser apis and the first render is on the server
			if (formattedSource.footnoteSource) {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(
					formattedSource.footnoteSource,
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
			formattedSource.main &&
			prevProps.formattedSource.main !== formattedSource.main &&
			(this.formatRef || this.formatHighlightRef)
		) {
			if (this.formatRef) {
				setEventHandlersForFootnotes(this.formatRef, openFootnote);
				setEventHandlersForFormattedVerses(this.formatRef, {
					mouseDown: getFirstVerse,
					mouseUp: handleMouseUp,
					bookmarkClick: handleNoteClick,
					noteClick: handleNoteClick,
				});
			} else if (this.formatHighlightRef) {
				setEventHandlersForFootnotes(this.formatHighlightRef, openFootnote);
				setEventHandlersForFormattedVerses(this.formatHighlightRef, {
					mouseDown: getFirstVerse,
					mouseUp: handleMouseUp,
					bookmarkClick: handleNoteClick,
					noteClick: handleNoteClick,
				});
			}
		} else if (
			!isEqual(highlights, prevProps.highlights) &&
			this.formatHighlightRef
		) {
			setEventHandlersForFootnotes(this.formatHighlightRef, openFootnote);
			setEventHandlersForFormattedVerses(this.formatHighlightRef, {
				mouseDown: getFirstVerse,
				mouseUp: handleMouseUp,
				bookmarkClick: handleNoteClick,
				noteClick: handleNoteClick,
			});
		} else if (
			prevProps.userSettings.getIn([
				'toggleOptions',
				'readersMode',
				'active',
			]) !== userSettings.getIn(['toggleOptions', 'readersMode', 'active']) &&
			!userSettings.getIn(['toggleOptions', 'readersMode', 'active']) &&
			(this.formatHighlightRef || this.formatRef)
		) {
			// Need to set event handlers again here because they are removed once the plain text is rendered
			if (this.formatRef) {
				setEventHandlersForFootnotes(this.formatRef, openFootnote);
				setEventHandlersForFormattedVerses(this.formatRef, {
					mouseDown: getFirstVerse,
					mouseUp: handleMouseUp,
					bookmarkClick: handleNoteClick,
					noteClick: handleNoteClick,
				});
			} else if (this.formatHighlightRef) {
				setEventHandlersForFootnotes(this.formatHighlightRef, openFootnote);
				setEventHandlersForFormattedVerses(this.formatHighlightRef, {
					mouseDown: getFirstVerse,
					mouseUp: handleMouseUp,
					bookmarkClick: handleNoteClick,
					noteClick: handleNoteClick,
				});
			}
		}

		// This handles setting the events on a page refresh or navigation via url
		if (this.formatRef) {
			setEventHandlersForFootnotes(this.formatRef, openFootnote);
			setEventHandlersForFormattedVerses(this.formatRef, {
				mouseDown: getFirstVerse,
				mouseUp: handleMouseUp,
				bookmarkClick: handleNoteClick,
				noteClick: handleNoteClick,
			});
		} else if (this.formatHighlightRef) {
			setEventHandlersForFootnotes(this.formatHighlightRef, openFootnote);
			setEventHandlersForFormattedVerses(this.formatHighlightRef, {
				mouseDown: getFirstVerse,
				mouseUp: handleMouseUp,
				bookmarkClick: handleNoteClick,
				noteClick: handleNoteClick,
			});
		}
	}
	// Use selected text only when marking highlights

	getFootnotesOnFirstRender = () => {
		const { formattedSource } = this.props;
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(
			formattedSource.footnoteSource,
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

		this.props.setFootnotes(footnotes);
		// this.setState({
		// 	footnoteState: false,
		// 	footnotes,
		// });
	};

	setFormattedRef = (el) => {
		this.formatRef = el;
		this.props.setFormattedRef(el);
	};

	setFormattedRefHighlight = (el) => {
		this.formatHighlightRef = el;
		this.props.setFormattedRefHighlight(el);
	};

	// Probably need to stop doing this here
	callSetStateNotInUpdate = (footnotes) => this.props.setFootnotes(footnotes);

	domMethodsAvailable = () => this.setState({ domMethodsAvailable: true });

	render() {
		const {
			userSettings,
			formattedSource: initialFormattedSourceFromProps,
			highlights,
			activeChapter,
			verseNumber,
			userAuthenticated,
			activeBookId,
			userNotes,
			bookmarks,
			handleNoteClick,
		} = this.props;
		const domMethodsAvailable = this.state;

		const initialFormattedSource = JSON.parse(
			JSON.stringify(initialFormattedSourceFromProps),
		);
		let formattedVerse = false;

		// Need to move this to selector and use regex
		// Possible for verse but not for footnotes
		if (domMethodsAvailable && initialFormattedSource.main) {
			if (verseNumber) {
				const parser = new DOMParser();
				const serializer = new XMLSerializer();
				// Create temp xml doc from source
				const xmlDocText = parser.parseFromString(
					initialFormattedSource.main,
					'text/xml',
				);
				// Find the verse node by its class name
				const verseClassName = `${activeBookId.toUpperCase()}${activeChapter}_${verseNumber}`;
				const verseNumberElement = xmlDocText.getElementsByClassName(
					`verse${verseNumber}`,
				)[0];
				// Get the inner text of the verse
				const verseString = xmlDocText.getElementsByClassName(
					verseClassName,
				)[0];
				// Create a new container for the verse
				const newXML = xmlDocText.createElement('div');
				newXML.className = 'single-formatted-verse';
				// Add the verse to the new container
				if (verseNumberElement && verseString) {
					newXML.appendChild(verseNumberElement);
					newXML.appendChild(verseString);
				}
				// Use the new text as the formatted source
				initialFormattedSource.main = newXML
					? serializer.serializeToString(newXML)
					: 'This chapter does not have a verse matching the url';
				formattedVerse = true;
			}
		}
		// Doing it like this may impact performance, but it is probably cleaner
		// than most other ways of doing it...
		let formattedSource = initialFormattedSource;

		if (applyNotes && applyBookmarks && applyWholeVerseHighlights) {
			formattedSource = initialFormattedSource.main
				? {
						...initialFormattedSource,
						main: [initialFormattedSource.main]
							.map((s) => applyNotes(s, userNotes, handleNoteClick))
							.map((s) => applyBookmarks(s, bookmarks, handleNoteClick))
							.map((s) =>
								applyWholeVerseHighlights(
									s,
									highlights.filter(
										(h) => h.chapter === activeChapter && !h.highlighted_words,
									),
								),
							)[0],
				  }
				: initialFormattedSource;
		}
		const readersMode = userSettings.getIn([
			'toggleOptions',
			'readersMode',
			'active',
		]);
		const oneVersePerLine = userSettings.getIn([
			'toggleOptions',
			'oneVersePerLine',
			'active',
		]);
		const justifiedText = userSettings.getIn([
			'toggleOptions',
			'justifiedText',
			'active',
		]);
		// Need to connect to the api and get the highlights object for this chapter
		// based on whether the highlights object has any data decide whether to
		// run this function or not
		let formattedText = [];

		if (
			highlights.length &&
			userAuthenticated &&
			(!oneVersePerLine && !readersMode && formattedSource.main) &&
			createFormattedHighlights
		) {
			// Use function for highlighting the formatted formattedText
			formattedText = createFormattedHighlights(
				highlights.filter((h) => h.chapter === activeChapter),
				formattedSource.main,
			);
		}
		if (
			formattedSource.main &&
			(!verseNumber || (verseNumber && formattedVerse))
		) {
			// Need to run a function to highlight the formatted text if this option is selected
			if (!Array.isArray(formattedText)) {
				return (
					<div
						ref={this.setFormattedRefHighlight}
						className={justifiedText ? 'justify' : ''}
						dangerouslySetInnerHTML={{ __html: formattedText }} // eslint-disable-line react/no-danger
					/>
				);
			}
			return (
				<div
					ref={this.setFormattedRef}
					className={justifiedText ? 'justify' : ''}
					dangerouslySetInnerHTML={{ __html: formattedSource.main }} // eslint-disable-line react/no-danger
				/>
			);
		}

		return null;
	}
}

FormattedText.propTypes = {
	highlights: PropTypes.array,
	userNotes: PropTypes.array,
	bookmarks: PropTypes.array,
	formattedSource: PropTypes.object,
	userSettings: PropTypes.object,
	mainRef: PropTypes.object,
	activeVerseInfo: PropTypes.object,
	activeChapter: PropTypes.number,
	verseNumber: PropTypes.string,
	activeBookId: PropTypes.string,
	userAuthenticated: PropTypes.bool,
	openFootnote: PropTypes.func,
	setFootnotes: PropTypes.func,
	handleMouseUp: PropTypes.func,
	getFirstVerse: PropTypes.func,
	handleNoteClick: PropTypes.func,
	setFormattedRef: PropTypes.func,
	setFormattedRefHighlight: PropTypes.func,
};

export default FormattedText;
