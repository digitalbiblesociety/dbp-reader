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
import Link from 'next/link';
import Information from '../../components/Information';
import SvgWrapper from '../../components/SvgWrapper';
import ContextPortal from '../../components/ContextPortal';
import FootnotePortal from '../../components/FootnotePortal';
import LoadingSpinner from '../../components/LoadingSpinner';
import PopupMessage from '../../components/PopupMessage';
import PleaseSignInMessage from '../../components/PleaseSignInMessage';
import AudioOnlyMessage from '../../components/AudioOnlyMessage';
import {
  getFormattedParentVerseNumber,
  getPlainParentVerse,
  getFormattedParentVerse,
  getFormattedChildIndex,
  getFormattedElementVerseId,
  getPlainParentVerseWithoutNumber,
  getClosestParent,
  getOffsetNeededForPsalms,
  replaceCharsRegex,
} from '../../utils/highlightingUtils';
import getPreviousChapterUrl from '../../utils/getPreviousChapterUrl';
import getNextChapterUrl from '../../utils/getNextChapterUrl';
import {
  calcDistance,
  getClassNameForMain,
  getClassNameForTextContainer,
  getReference,
  isEndOfBible,
  isStartOfBible,
} from './textRenderUtils';
import createHighlights from './highlightPlainText';
import createFormattedHighlights from './highlightFormattedText';
import {
  applyNotes,
  applyBookmarks,
  applyWholeVerseHighlights,
} from './formattedTextUtils';
import ReadFullChapter from '../../components/ReadFullChapter';
import setEventHandlersForFormattedVerses from '../../utils/requiresDom/setEventHandlersForFormattedVerses';
import setEventHandlersForFootnotes from '../../utils/requiresDom/setEventHandlersForFootnotes';
import addHighlight from '../../utils/requiresDom/addHighlight';
import PlainTextVerses from '../../components/PlainTextVerses';
import shareHighlightToFacebook from '../../utils/requiresDom/shareToFacebook';
import getLastSelectedVerse from '../../utils/requiresDom/getLastSelectedVerse';
import getFirstVerse from '../../utils/requiresDom/getFirstSelectedVerse';

/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// Todo: Set selected text when user clicks a verse
class Text extends React.PureComponent {
  state = {
    contextMenuState: false,
    footnoteState: false,
    coords: {},
    selectedText: '',
    userSelectedText: '',
    firstVerse: 0,
    lastVerse: 0,
    highlightActive: this.props.highlights || false,
    handlersAreSet: false,
    handledMouseDown: false,
    activeVerseInfo: { verse: 0 },
    loadingNextPage: false,
    wholeVerseIsSelected: false,
    domMethodsAvailable: false,
    formattedVerse: false,
    footnotes: {},
  };

  componentDidMount() {
    // Doing all these assignments because nextjs was erroring because they try to use the dom
    this.createHighlights = createHighlights;
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

  componentWillReceiveProps(nextProps) {
    // If there is new formatted text or new plain text then the menus need to be disabled
    if (nextProps.formattedSource.main !== this.props.formattedSource.main) {
      this.setState(
        {
          activeVerseInfo: { verse: 0 },
          footnoteState: false,
          loadingNextPage: false,
          contextMenuState: false,
        },
        () => {
          this.props.setTextLoadingState({ state: false });
        },
      );
    }
    if (!isEqual(nextProps.text, this.props.text)) {
      this.setState({
        activeVerseInfo: { verse: 0 },
        loadingNextPage: false,
        contextMenuState: false,
      });
      this.props.setTextLoadingState({ state: false });
    }
    if (nextProps.verseNumber !== this.props.verseNumber) {
      this.setState({ loadingNextPage: false, contextMenuState: false });
      this.props.setTextLoadingState({ state: false });
    }
    if (nextProps.activeChapter !== this.props.activeChapter) {
      this.setState({ loadingNextPage: false, contextMenuState: false });
      this.props.setTextLoadingState({ state: false });
    }
    if (nextProps.activeBookId !== this.props.activeBookId) {
      this.setState({ loadingNextPage: false, contextMenuState: false });
      this.props.setTextLoadingState({ state: false });
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

  /* eslint-disable no-param-reassign, no-unused-expressions, jsx-a11y/no-static-element-interactions */

  setFormattedRefHighlight = (el) => {
    this.formatHighlight = el;
  };

  setFormattedRef = (el) => {
    this.format = el;
  };

  setMainRef = (el) => {
    this.main = el;
  };
  // Use selected text only when marking highlights
  setActiveNote = ({ coords, existingNote, bookmark }) => {
    if (!this.props.userAuthenticated || !this.props.userId) {
      this.openPopup({ x: coords.x, y: coords.y });
      return;
    }
    const { firstVerse, lastVerse } = this.state;
    const { activeBookId, activeChapter, bibleId } = this.props;

    const note = {
      verse_start: firstVerse || lastVerse,
      verse_end: lastVerse || firstVerse,
      book_id: activeBookId,
      chapter: activeChapter,
      bible_id: bibleId,
      bookmark: bookmark ? 1 : 0,
    };

    this.props.setActiveNote({ note: existingNote || note });
  };

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

  getFirstVerse = (e) => {
    e.stopPropagation();
    typeof e.persist === 'function' && e.persist();

    const firstVerse = getFirstVerse({
      target: e.target,
      button: e.button === 0,
      userSettings: this.props.userSettings,
      formattedSourceMain: this.props.formattedSource.main,
      main: this.main,
      getFormattedParentVerse,
      getPlainParentVerseWithoutNumber,
    });
    this.setState({
      firstVerse,
    });
  };

  getLastVerse = (e) => {
    typeof e.persist === 'function' && e.persist();
    // Failsafe for the case that the dom hasn't loaded yet
    // may not need this anymore
    if (typeof this.window === 'undefined') return;

    const lastVerse = getLastSelectedVerse(e, {
      formattedSourceMain: this.props.formattedSource.main,
      userSettings: this.props.userSettings,
      windowObject: this.window,
      main: this.main,
      activeBookId: this.props.activeBookId,
      activeChapter: this.props.activeChapter,
      text: this.props.text,
      selectedWholeVerse: this.selectedWholeVerse,
      getFormattedParentVerse,
      getPlainParentVerseWithoutNumber,
    });
    if (lastVerse.openMenu) {
      this.setState(
        {
          lastVerse: lastVerse.stateObject.lastVerse,
          wholeVerseIsSelected: lastVerse.stateObject.wholeVerseIsSelected,
          anchorOffset: lastVerse.stateObject.anchorOffset,
          anchorText: lastVerse.stateObject.anchorText,
          anchorNode: lastVerse.stateObject.anchorNode,
          focusOffset: lastVerse.stateObject.focusOffset,
          focusText: lastVerse.stateObject.focusText,
          focusNode: lastVerse.stateObject.focusNode,
          userSelectedText: lastVerse.stateObject.userSelectedText,
          selectedText: lastVerse.stateObject.selectedText,
        },
        () => this.openContextMenu(e),
      );
    }
  };
  /* eslint-disable no-param-reassign, no-unused-expressions, jsx-a11y/no-static-element-interactions */

  getTextComponents(domMethodsAvailable) {
    const {
      text: initialText,
      userSettings,
      formattedSource: initialFormattedSourceFromProps,
      highlights,
      activeChapter,
      activeBookName,
      verseNumber,
      userNotes,
      bookmarks,
      audioSource,
      userAuthenticated,
      activeBookId,
    } = this.props;

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
        // Find the verse node by its classname
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

    const chapterAlt = initialText[0] && initialText[0].chapter_alt;
    const verseIsActive =
      this.state.activeVerseInfo.verse && this.state.activeVerseInfo.isPlain;
    const activeVerse = this.state.activeVerseInfo.verse || 0;
    // Doing it like this may impact performance, but it is probably cleaner
    // than most other ways of doing it...
    let formattedSource = initialFormattedSource;

    if (
      this.applyNotes &&
      this.applyBookmarks &&
      this.applyWholeVerseHighlights
    ) {
      formattedSource = initialFormattedSource.main
        ? {
            ...initialFormattedSource,
            main: [initialFormattedSource.main]
              .map((s) => this.applyNotes(s, userNotes, this.handleNoteClick))
              .map((s) =>
                this.applyBookmarks(s, bookmarks, this.handleNoteClick),
              )
              .map((s) =>
                this.applyWholeVerseHighlights(
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
    let plainText = [];
    let formattedText = [];

    if (
      highlights.length &&
      userAuthenticated &&
      (!oneVersePerLine && !readersMode && formattedSource.main) &&
      this.createFormattedHighlights
    ) {
      // Use function for highlighting the formatted formattedText
      formattedText = this.createFormattedHighlights(
        highlights.filter((h) => h.chapter === activeChapter),
        formattedSource.main,
      );
    } else if (
      highlights.length &&
      userAuthenticated &&
      initialText.length &&
      this.createHighlights
    ) {
      // Use function for highlighting the plain plainText
      // TODO: Can remove filter once I fix the problem with the new highlights not being fetched
      plainText = this.createHighlights(
        highlights.filter((h) => h.chapter === activeChapter),
        initialText,
      );
    } else {
      plainText = initialText || [];
    }

    let textComponents;
    // Mapping the text again here because I need to apply a class for all highlights with a char count of null
    const mappedText = plainText.map((v) => {
      const highlightsInVerse = highlights.filter(
        (h) => v.verse_start === h.verse_start && !h.highlighted_words,
      );
      const wholeVerseHighlighted = !!highlightsInVerse.length;
      if (wholeVerseHighlighted) {
        const highlightedColor = highlightsInVerse[highlightsInVerse.length - 1]
          ? highlightsInVerse[highlightsInVerse.length - 1].highlighted_color
          : '';

        return { ...v, wholeVerseHighlighted, highlightedColor };
      }
      return v;
    });
    // Todo: Should handle each mode for formatted text and plain text in a separate component
    // Handle exception thrown when there isn't plain text but readers mode is selected
    /* eslint-disable react/no-danger */
    if (mappedText.length === 0 && !formattedSource.main) {
      if (audioSource) {
        textComponents = [
          <AudioOnlyMessage
            key={'no_text'}
            book={activeBookName}
            chapter={activeChapter}
          />,
        ];
      } else {
        textComponents = [
          <h5 key={'no_text'}>
            Text is not currently available for this version.
          </h5>,
        ];
      }
    } else if (readersMode) {
      textComponents = PlainTextVerses({
        textComponents: mappedText,
        onMouseUp: this.handleMouseUp,
        onMouseDown: this.getFirstVerse,
        onHighlightClick: this.handleHighlightClick,
        onNoteClick: this.handleNoteClick,
        readersMode,
        oneVersePerLine,
        activeVerse: parseInt(activeVerse, 10),
        verseIsActive: !!verseIsActive,
      });
    } else if (oneVersePerLine) {
      textComponents = PlainTextVerses({
        textComponents: mappedText,
        onMouseUp: this.handleMouseUp,
        onMouseDown: this.getFirstVerse,
        onHighlightClick: this.handleHighlightClick,
        onNoteClick: this.handleNoteClick,
        readersMode,
        oneVersePerLine,
        activeVerse: parseInt(activeVerse, 10),
        verseIsActive: !!verseIsActive,
      });
    } else if (
      formattedSource.main &&
      (!verseNumber || (verseNumber && formattedVerse))
    ) {
      // Need to run a function to highlight the formatted text if this option is selected
      if (!Array.isArray(formattedText)) {
        textComponents = (
          <div
            ref={this.setFormattedRefHighlight}
            className={justifiedText ? 'justify' : ''}
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      } else {
        textComponents = (
          <div
            ref={this.setFormattedRef}
            className={justifiedText ? 'justify' : ''}
            dangerouslySetInnerHTML={{ __html: formattedSource.main }}
          />
        );
      }
    } else {
      textComponents = PlainTextVerses({
        textComponents: mappedText,
        onMouseUp: this.handleMouseUp,
        onMouseDown: this.getFirstVerse,
        onHighlightClick: this.handleHighlightClick,
        onNoteClick: this.handleNoteClick,
        readersMode,
        oneVersePerLine,
        activeVerse: parseInt(activeVerse, 10),
        verseIsActive: !!verseIsActive,
      });
    }

    if (
      !formattedSource.main &&
      !readersMode &&
      !oneVersePerLine &&
      Array.isArray(textComponents) &&
      textComponents[0].key !== 'no_text'
    ) {
      textComponents.unshift(
        <span key={'chapterNumber'} className={'drop-caps'}>
          {chapterAlt || activeChapter}
        </span>,
      );
    }
    // Using parseInt to determine whether or not the verseNumber is a real number or if it is a series of characters
    if (verseNumber && Array.isArray(textComponents)) {
      return textComponents.filter(
        (c) => c.key === (parseInt(verseNumber, 10) ? verseNumber : '1'),
      );
    }

    return textComponents;
  }

  handleScrollOnMain = () => {
    if (this.state.contextMenuState) {
      this.setState({ contextMenuState: false, activeVerseInfo: { verse: 0 } });
    }
  };

  // This is a no-op to trick iOS devices
  handleHighlightClick = () => {
    // Unless there is a click event the mouseup and mousedown events won't fire for mobile devices
    // Left this blank since I actually don't need to do anything with it
  };

  handleMouseUp = (e) => {
    e.stopPropagation();

    this.getLastVerse(e);
    if (
      e.button === 0 &&
      this.state.footnoteState &&
      e.target.className !== 'key'
    ) {
      this.closeFootnote();
    }
  };

  handleArrowClick = () => {
    this.setState({ loadingNextPage: true });
  };

  handleNoteClick = (noteIndex, clickedBookmark) => {
    const userNotes = this.props.userNotes;
    const existingNote = userNotes[noteIndex];

    if (!this.props.notesActive) {
      this.setActiveNote({ existingNote });
      if (clickedBookmark) {
        this.props.setActiveNotesView('bookmarks');
      } else {
        this.props.setActiveNotesView('edit');
      }
      this.closeContextMenu();
      this.props.toggleNotesModal();
    } else {
      this.setActiveNote({ existingNote });
      if (clickedBookmark) {
        this.props.setActiveNotesView('bookmarks');
      } else {
        this.props.setActiveNotesView('edit');
      }
      this.closeContextMenu();
    }
  };

  handleAddBookmark = () => {
    const {
      activeBookId,
      userId,
      userAuthenticated,
      activeChapter,
      bibleId,
    } = this.props;
    const { firstVerse, lastVerse } = this.state;
    // Need to make first verse and last verse integers for the < comparison
    const fv = parseInt(firstVerse, 10);
    const lv = parseInt(lastVerse, 10);
    // This takes into account RTL and LTR selections
    const verseStart = fv < lv ? fv : lv;
    const verseEnd = fv < lv ? lv : fv;

    // Only add the bookmark if there is a userId to add it too
    if (userAuthenticated && userId) {
      this.props.addBookmark({
        book_id: activeBookId,
        chapter: activeChapter,
        user_id: userId,
        bible_id: bibleId,
        reference: getReference(
          verseStart || verseEnd,
          verseEnd,
          this.props.activeBookName,
          this.props.activeChapter,
        ),
        verse_start: verseStart || verseEnd,
        verse_end: verseEnd,
      });
    }
  };

  // Probably need to stop doing this here
  callSetStateNotInUpdate = (footnotes) => this.setState({ footnotes });

  domMethodsAvailable = () =>
    this.setState({ domMethodsAvailable: true, formattedVerse: true });

  openPopup = (coords) => {
    this.setState({ popupOpen: true, popupCoords: coords });
    setTimeout(() => this.setState({ popupOpen: false }), 2500);
  };

  deleteHighlights = (highlightObject, highlights) => {
    const space =
      highlightObject.highlightStart + highlightObject.highlightedWords;
    const highsToDelete = highlights
      .filter(
        (high) =>
          high.verse_start === parseInt(highlightObject.verseStart, 10) &&
          (high.highlight_start <= space &&
            high.highlight_start + high.highlighted_words >=
              highlightObject.highlightStart),
      )
      .reduce((a, h) => [...a, h.id], []);

    this.props.deleteHighlights({ ids: highsToDelete });
  };

  addHighlight = ({ color, popupCoords }) => {
    addHighlight({
      color,
      popupCoords,
      // Props
      userAuthenticated: this.props.userAuthenticated,
      userId: this.props.userId,
      text: this.props.text,
      highlights: this.props.highlights,
      formattedSource: this.props.formattedSource,
      userSettings: this.props.userSettings,
      activeTextId: this.props.activeTextId,
      activeBookId: this.props.activeBookId,
      activeBookName: this.props.activeBookName,
      activeChapter: this.props.activeChapter,
      addHighlight: this.props.addHighlight,
      // State
      wholeVerseIsSelected: this.state.wholeVerseIsSelected,
      activeVerseInfo: this.state.activeVerseInfo,
      firstVerseState: this.state.firstVerse,
      lastVerseState: this.state.lastVerse,
      anchorOffsetState: this.state.anchorOffset,
      focusOffsetState: this.state.focusOffset,
      focusTextState: this.state.focusText,
      anchorTextState: this.state.anchorText,
      anchorNodeState: this.state.anchorNode,
      focusNodeState: this.state.focusNode,
      selectedTextState: this.state.selectedText,
      // Methods
      main: this.main,
      format: this.format,
      openPopup: this.openPopup,
      setParentState: this.setState,
      formatHighlight: this.formatHighlight,
      deleteHighlights: this.deleteHighlights,
      closeContextMenu: this.closeContextMenu,
      // External Functions
      getReference,
      calcDistance,
      getClosestParent,
      replaceCharsRegex,
      getPlainParentVerse,
      getFormattedChildIndex,
      getFormattedParentVerse,
      getOffsetNeededForPsalms,
      getFormattedElementVerseId,
      getFormattedParentVerseNumber,
      getPlainParentVerseWithoutNumber,
    });
  };

  addFacebookLike = () => {
    if (typeof this.window !== 'undefined') {
      const fb = this.window.FB;
      fb.api(
        `${process.env.FB_APP_ID}?metadata=1`,
        {
          access_token: process.env.FB_ACCESS,
        },
        (res) => res,
      );
    }
    this.closeContextMenu();
  };

  openFootnote = ({ id, coords }) => {
    this.setState({
      footnoteState: true,
      contextMenuState: false,
      footnotePortal: {
        message: this.state.footnotes[id],
        closeFootnote: this.closeFootnote,
        coords,
      },
    });
  };

  openContextMenu = (e) => {
    if (typeof this.window !== 'undefined') {
      const rightEdge = this.window.innerWidth - 250;
      const bottomEdge = this.window.innerHeight - 297;
      const x = rightEdge < e.clientX ? rightEdge : e.clientX;
      const y = bottomEdge < e.clientY ? bottomEdge : e.clientY;
      // Using setTimeout 0 so that the check for the selection happens in the next frame and not this one
      // That allows the function that updates the selection to run before this one does
      if (this.timer) {
        clearTimeout(this.timer);
      }
      setTimeout(() => {
        if (
          typeof this.window !== 'undefined' &&
          !this.window.getSelection().toString()
        ) {
          this.closeContextMenu();
        } else {
          this.setState({
            coords: { x, y },
            contextMenuState: true,
          });
        }
      }, 0);
    }
  };

  closeFootnote = () => this.setState({ footnoteState: false });

  closeContextMenu = () => {
    this.setState({
      contextMenuState: false,
      activeVerseInfo: { verse: 0, isPlain: false },
    });
  };

  selectedWholeVerse = (verse, isPlain, clientX, clientY, userSelectedText) => {
    if (typeof this.window !== 'undefined') {
      const rightEdge =
        this.window.innerWidth < 500
          ? this.window.innerWidth - 295
          : this.window.innerWidth - 250;
      const bottomEdge =
        this.window.innerHeight < 900
          ? this.window.innerHeight - 317
          : this.window.innerHeight - 297;
      const x = rightEdge < clientX ? rightEdge : clientX;
      const y = bottomEdge < clientY ? bottomEdge : clientY;

      if (isPlain) {
        this.setState((currentState) => ({
          coords: { x, y },
          wholeVerseIsSelected: !(
            currentState.wholeVerseIsSelected &&
            currentState.activeVerseInfo.verse === verse
          ),
          contextMenuState: currentState.activeVerseInfo.verse !== verse,
          lastVerse: currentState.firstVerse,
          activeVerseInfo: {
            verse: currentState.activeVerseInfo.verse !== verse ? verse : 0,
            isPlain,
          },
          userSelectedText,
        }));
      } else {
        // is formatted
        this.setState((currentState) => ({
          coords: { x, y },
          wholeVerseIsSelected: !(
            currentState.wholeVerseIsSelected &&
            currentState.activeVerseInfo.verse === verse
          ),
          contextMenuState: currentState.activeVerseInfo.verse !== verse,
          lastVerse: currentState.firstVerse,
          activeVerseInfo: {
            verse: currentState.activeVerseInfo.verse !== verse ? verse : 0,
            isPlain,
          },
          userSelectedText,
        }));
      }
    }
  };

  shareHighlightToFacebook = () => {
    const { activeBookName: book, activeChapter: chapter } = this.props;
    const { firstVerse: v1, lastVerse: v2, selectedText: sl } = this.state;
    const verseRange =
      v1 === v2
        ? `${book} ${chapter}:${v1}\n${sl}`
        : `${book} ${chapter}:${v1}-${v2}\n"${sl}"`;

    shareHighlightToFacebook(verseRange, this.closeContextMenu);
  };

  mainWrapperRef = (el) => {
    this.mainWrapper = el;
  };

  render() {
    const {
      activeChapter,
      toggleNotesModal,
      notesActive,
      setActiveNotesView,
      formattedSource,
      text,
      loadingNewChapterText,
      loadingAudio,
      userSettings,
      verseNumber,
      activeTextId,
      activeBookId,
      books,
      menuIsOpen,
      isScrollingDown,
      audioPlayerState,
      subFooterOpen,
      textDirection,
      chapterTextLoadingState,
      videoPlayerOpen,
      hasVideo,
    } = this.props;

    const {
      coords,
      contextMenuState,
      footnoteState,
      footnotePortal,
      formattedVerse,
      userSelectedText,
    } = this.state;
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
    const chapterAlt = text[0] && text[0].chapter_alt;

    if (
      loadingNewChapterText ||
      loadingAudio ||
      this.state.loadingNextPage ||
      chapterTextLoadingState ||
      (!formattedVerse && formattedSource.main)
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
        <Link
          as={getPreviousChapterUrl({
            books,
            chapter: activeChapter,
            bookId: activeBookId.toLowerCase(),
            textId: activeTextId.toLowerCase(),
            verseNumber,
            text,
            isHref: false,
          })}
          href={getPreviousChapterUrl({
            books,
            chapter: activeChapter,
            bookId: activeBookId.toLowerCase(),
            textId: activeTextId.toLowerCase(),
            verseNumber,
            text,
            isHref: true,
          })}
        >
          <div
            onClick={
              !isStartOfBible(books, activeBookId, activeChapter) && !menuIsOpen
                ? this.handleArrowClick
                : () => {}
            }
            className={
              !isStartOfBible(books, activeBookId, activeChapter) && !menuIsOpen
                ? 'arrow-wrapper'
                : 'arrow-wrapper disabled'
            }
          >
            {!isStartOfBible(books, activeBookId, activeChapter) ? (
              <SvgWrapper className="prev-arrow-svg" svgid="arrow_left" />
            ) : null}
          </div>
        </Link>
        <div ref={this.mainWrapperRef} className={'main-wrapper'}>
          <main
            ref={this.setMainRef}
            className={getClassNameForMain(
              formattedSource,
              userSettings,
              textDirection,
              menuIsOpen,
            )}
            onScroll={this.handleScrollOnMain}
          >
            {(formattedSource.main && !readersMode && !oneVersePerLine) ||
            text.length === 0 ||
            (!readersMode && !oneVersePerLine) ? null : (
              <div className="active-chapter-title">
                <h1 className="active-chapter-title">
                  {chapterAlt || activeChapter}
                </h1>
              </div>
            )}
            {this.getTextComponents(this.state.domMethodsAvailable)}
            {verseNumber ? (
              <ReadFullChapter
                activeTextId={activeTextId}
                activeBookId={activeBookId}
                activeChapter={activeChapter}
              />
            ) : null}
            <Information />
          </main>
        </div>
        <Link
          as={getNextChapterUrl({
            books,
            chapter: activeChapter,
            bookId: activeBookId.toLowerCase(),
            textId: activeTextId.toLowerCase(),
            verseNumber,
            text,
            isHref: false,
          })}
          href={getNextChapterUrl({
            books,
            chapter: activeChapter,
            bookId: activeBookId.toLowerCase(),
            textId: activeTextId.toLowerCase(),
            verseNumber,
            text,
            isHref: true,
          })}
        >
          <div
            onClick={
              !isEndOfBible(books, activeBookId, activeChapter) && !menuIsOpen
                ? this.handleArrowClick
                : () => {}
            }
            className={
              !isEndOfBible(books, activeBookId, activeChapter) && !menuIsOpen
                ? 'arrow-wrapper'
                : 'arrow-wrapper disabled'
            }
          >
            {!isEndOfBible(books, activeBookId, activeChapter) ? (
              <SvgWrapper className="next-arrow-svg" svgid="arrow_right" />
            ) : null}
          </div>
        </Link>
        {contextMenuState ? (
          <ContextPortal
            handleAddBookmark={this.handleAddBookmark}
            addHighlight={this.addHighlight}
            addFacebookLike={this.addFacebookLike}
            shareHighlightToFacebook={this.shareHighlightToFacebook}
            setActiveNote={this.setActiveNote}
            setActiveNotesView={setActiveNotesView}
            closeContextMenu={this.closeContextMenu}
            toggleNotesModal={toggleNotesModal}
            notesActive={notesActive}
            coordinates={coords}
            selectedText={userSelectedText}
          />
        ) : null}
        {footnoteState ? <FootnotePortal {...footnotePortal} /> : null}
        {this.state.popupOpen ? (
          <PopupMessage
            message={<PleaseSignInMessage message={'toUseFeature'} />}
            x={this.state.popupCoords.x}
            y={this.state.popupCoords.y}
          />
        ) : null}
      </div>
    );
  }
}
/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */

Text.propTypes = {
  text: PropTypes.array,
  books: PropTypes.array,
  userNotes: PropTypes.array,
  bookmarks: PropTypes.array,
  highlights: PropTypes.array,
  userSettings: PropTypes.object,
  formattedSource: PropTypes.object,
  addBookmark: PropTypes.func,
  addHighlight: PropTypes.func,
  setActiveNote: PropTypes.func,
  deleteHighlights: PropTypes.func,
  toggleNotesModal: PropTypes.func,
  setActiveNotesView: PropTypes.func,
  setTextLoadingState: PropTypes.func,
  activeChapter: PropTypes.number,
  hasVideo: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  notesActive: PropTypes.bool,
  loadingAudio: PropTypes.bool,
  subFooterOpen: PropTypes.bool,
  isScrollingDown: PropTypes.bool,
  videoPlayerOpen: PropTypes.bool,
  chapterTextLoadingState: PropTypes.bool,
  audioPlayerState: PropTypes.bool,
  userAuthenticated: PropTypes.bool,
  loadingNewChapterText: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bibleId: PropTypes.string,
  verseNumber: PropTypes.string,
  activeTextId: PropTypes.string,
  activeBookId: PropTypes.string,
  audioSource: PropTypes.string,
  activeBookName: PropTypes.string,
  textDirection: PropTypes.string,
};

export default Text;
