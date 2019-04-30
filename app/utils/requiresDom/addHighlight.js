/** Generates, validates and sends highlight information to api
	@ref is a dom element
  @handler is the desired event handler
  @param {String} color Color that was clicked in context menu
  @param {Object} popupCoords Object with x, y values for opening an error message
  | State |
  @param {String} firstVerseState The verse number assigned to the start of the user interaction
  @param {String} lastVerseState The verse number assigned to the end of the user interaction
  @param {String} anchorOffsetState Offset of mousedown|mouseup location within the anchor text
  @param {String} focusOffsetState Offset of mousedown|mouseup location within the focus text
  @param {String} focusTextState Text in the anchor node
  @param {String} anchorTextState Text in the focused node
  @param {String} anchorNodeState The node that is the anchor (start) for the selected text
  @param {String} focusNodeState The node that was focused (eneded on) in the user selection
  @param {String} selectedTextState The text string that the user selected
  @param {Boolean} wholeVerseIsSelected Tells whether the verse was clicked or whether there was a user selection
  @param {Object} activeVerseInfo Information about the active verse (only applies if whole verse was selected)
  | props |
  @param {Boolean} userAuthenticated
  @param {String|Number} userId
  @param {Array} text Array of all the verses
  @param {Array} highlights Array of all the highlights that already exist
  @param {String} formattedSource Object containing the formatted html source and footnotes source
  @param {Object} userSettings
  @param {String} activeTextId
  @param {String} activeBookId
  @param {String} activeBookName
  @param {Number} activeChapter
  | Methods / Refs |
  @param {Object} main
  @param {Object} format
  @param {Function} openPopup
  @param {Function} setParentState
  @param {Function} formatHighlight
  @param {Function} deleteHighlights
  @param {Function} closeContextMenu
  @param {Function} addHighlight
  | External Functions |
  @param {Function} getReference Find the book|chapter|verse reference for the highlight
  @param {Function} calcDistance Get the number that needs to be subtracted from the highlight length
  @param {Function} getClosestParent Get the closet parent in the DOM tree
  @param {Function} replaceCharsRegex Remove the characters that are not selectable
  @param {Function} getPlainParentVerse Get the parent of a plain text verse that matches the current verse number
  @param {Function} getFormattedChildIndex Get the index of the child for a formatted text
  @param {Function} getFormattedParentVerse Get the first node that has a verse number and is a parent of the selected node
  @param {Function} getOffsetNeededForPsalms Verses in Psalms have a different amount of spaces compared to normal verses
  @param {Function} getFormattedElementVerseId Get the id for a formatted verse
  @param {Function} getFormattedParentVerseNumber Get the verse number of the parent verse for the selected node
  @param {Function} getPlainParentVerseWithoutNumber Get the verse number of the parent verse that doesn't need to match verse number
 */

const addHighlightUtil = ({
  color,
  popupCoords,
  // State
  firstVerseState,
  lastVerseState,
  anchorOffsetState,
  focusOffsetState,
  focusTextState,
  anchorTextState,
  anchorNodeState,
  focusNodeState,
  selectedTextState,
  wholeVerseIsSelected,
  activeVerseInfo,
  // props
  userAuthenticated,
  userId,
  text,
  highlights,
  formattedSource,
  userSettings,
  activeTextId,
  activeBookId,
  activeBookName,
  activeChapter,
  addHighlight,
  // Methods
  main,
  format,
  openPopup,
  setParentState,
  formatHighlight,
  deleteHighlights,
  closeContextMenu,
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
}) => {
  // Highlight object will be updated based on the parameters passed into function
  let highlightObject = {};

  // User must be signed in for the highlight to be added
  if (!userAuthenticated || !userId) {
    openPopup({ x: popupCoords.x, y: popupCoords.y });
    // Returning the highlightObject for testing purposes
    return highlightObject;
  }
  // needs to send an api request to the server that adds a highlight for this passage
  // Adds userId and bible in homepage container where action is dispatched
  // { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords }
  // Available data
  // text and node where highlight started,
  // text and node where highlight ended
  // verse number of highlight start
  // verse number of highlight end
  // text selected

  // formatted solution
  // get the dom node for the selection start
  // mark the index for selection start inside that dom node
  // go up the dom until I get the entire verse
  // This should accurately get the verse node no matter what node started on
  // split all the text nodes and join them into an array
  // find the index of the marked character
  // use that index as the highlight start
  // if the selected text starts at the end of the anchor node
  // else if the selected text starts at the end of the focus node
  if (wholeVerseIsSelected) {
    try {
      const verse = activeVerseInfo.verse;
      const isPlain = activeVerseInfo.isPlain;
      if (isPlain) {
        const highlightedWords = text.find((t) => t.verse_start === parseInt(verse, 10) || t.verse_start_alt === verse)
          .verse_text.length;

        highlightObject = {
          bible: activeTextId,
          userId,
          book: activeBookId,
          chapter: activeChapter,
          verseStart: verse,
          color,
          highlightStart: 0,
          highlightedWords,
          reference: getReference(verse, verse, activeBookName, activeChapter),
        };
      } else {
        const verseElements = main
          ? [...main.querySelectorAll(`[data-id="${activeBookId}${activeChapter}_${verse}"]`)]
          : [];
        const highlightedWords = verseElements
          .reduce((a, c) => a.concat(c.textContent), '')
          .replace(replaceCharsRegex, '').length;

        highlightObject = {
          bible: activeTextId,
          userId,
          book: activeBookId,
          chapter: activeChapter,
          verseStart: verse,
          color,
          highlightStart: 0,
          highlightedWords,
          reference: getReference(verse, verse, activeBookName, activeChapter),
        };
      }

      if (color === 'none') {
        deleteHighlights(highlightObject, highlights);
      } else if (highlightObject) {
        addHighlight(highlightObject);
      }

      setParentState({
        wholeVerseIsSelected: false,
        activeVerseInfo: { verse: 0 },
      });
    } catch (err) {
      // do stuff with err
    }
  } else {
    try {
      // Globals*
      const first = parseInt(firstVerseState, 10);
      const last = parseInt(lastVerseState, 10);
      const chapter = activeChapter;
      // Since a user can highlight "backwards" this makes sure the first verse is correct
      const firstVerse = first < last ? first : last;
      const lastVerse = last > first ? last : first;
      // Getting each offset to determine which is closest to the start of the passage
      const offset = anchorOffsetState;
      const focusOffset = focusOffsetState;
      const focusText = focusTextState;
      const aText = anchorTextState;
      const aNode = anchorNodeState;
      const eNode = focusNodeState;
      const selectedText = selectedTextState;
      // Setting my anchors with the data that is closest to the start of the passage
      let anchorOffset = offset < focusOffset ? offset : focusOffset;
      let anchorText = offset < focusOffset ? aText : focusText;
      let node = aNode;
      if (formattedSource.main) {
        if (aText !== focusText) {
          // if nodes are different
          // I have access to the parent node
          // if texts match
          // reverse order of anchor and focus
          // if texts dont match
          // find the parent of each that has a verse id
          const aParent = getFormattedParentVerse(aNode);
          const eParent = getFormattedParentVerse(eNode);
          // if the parents are different verses
          if (aParent.isSameNode(eParent)) {
            // It doesn't matter from this point which parent is used since they both reference the same object
            // take the offset that occurs first as a child of the verse
            const aIndex = getFormattedChildIndex(aParent, aNode);
            const eIndex = getFormattedChildIndex(aParent, eNode);
            // Use the text and offset of the node that was closest to the start of the verse
            if (aIndex < eIndex) {
              anchorText = aText;
              anchorOffset = offset;
              node = aNode;
            } else {
              anchorText = focusText;
              node = eNode;
              anchorOffset = focusOffset;
            }
          } else {
            // take the offset that matches the first(lowest) verse between the two
            const aVerseNumber = getFormattedElementVerseId(aParent);
            const eVerseNumber = getFormattedElementVerseId(eParent);
            // Need to check for which node comes first
            // Use the text and offset of the first verse
            if (aVerseNumber < eVerseNumber) {
              anchorText = aText;
              node = aNode;
              anchorOffset = offset;
              // If the verse numbers are the same but the verse nodes are different then I am dealing with a psalm
            } else if (aVerseNumber === eVerseNumber) {
              // Use prevChild until I get null and use that node
              const closestParent = getClosestParent({
                aParent,
                eParent,
                verse: firstVerse,
                chapter,
                book: activeBookId,
                refNode: formatHighlight || format,
              });
              // Find distance from each parent back until there is not a sibling with the same verse number
              // make sure both parents have the q class before searching backwards
              // Does not work when putting highlight in the second portion of a verse
              // Build verse - get the index of the text out of the built verse
              // I think I want to somehow either make the anchor offset based on the resulting text from
              // the previous function or to use the resulting text instead of aNode.textContent but
              // I am not exactly sure which one to do...
              if (aParent.isSameNode(closestParent)) {
                anchorText = aText;
                node = aNode;
                anchorOffset = offset;
              } else {
                anchorText = focusText;
                node = eNode;
                anchorOffset = focusOffset;
              }
            } else {
              anchorText = focusText;
              node = eNode;
              anchorOffset = focusOffset;
            }
          }
        }
      } else if (aText !== focusText) {
        const aParent = getPlainParentVerseWithoutNumber(aNode);
        const eParent = getPlainParentVerseWithoutNumber(eNode);
        // if the parents are different verses
        if (aParent.isSameNode(eParent)) {
          // It doesn't matter from this point which parent is used since they both reference the same object
          // take the offset that occurs first as a child of the verse
          const aIndex = getFormattedChildIndex(aParent, aNode);
          const eIndex = getFormattedChildIndex(aParent, eNode);
          // Use the text and offset of the node that was closest to the start of the verse
          if (aIndex < eIndex) {
            anchorText = aText;
            node = aNode;
            anchorOffset = offset;
          } else {
            anchorText = focusText;
            node = eNode;
            anchorOffset = focusOffset;
          }
          // (could potentially use next/prev sibling for this)
        } else {
          // take the offset that matches the first(lowest) verse between the two
          const aVerseNumber = aParent.attributes['data-verseid'].value;
          const eVerseNumber = eParent.attributes['data-verseid'].value;
          // Use the text and offset of the first verse
          if (aVerseNumber < eVerseNumber) {
            anchorText = aText;
            node = aNode;
            anchorOffset = offset;
          } else {
            anchorText = focusText;
            node = eNode;
            anchorOffset = focusOffset;
          }
        }
      }
      // Solves for formatted text
      // Not so sure about this, seems like in theory it should give me the node closest to the beginning but idk
      let highlightStart = 0;
      let highlightedWords = 0;
      const dist = calcDistance(lastVerse, firstVerse, !!formattedSource.main);
      // Also need to check for class="v" to ensure that this was the first verse
      if (
        formattedSource.main &&
        !userSettings.getIn(['toggleOptions', 'readersMode', 'active']) &&
        !userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active'])
      ) {
        // Issue with getting the correct parent node
        node = getFormattedParentVerseNumber(node, firstVerse);
        // At this point "node" is the first verse
        const nodeClassValue = (node.attributes && node.attributes.class && node.attributes.class.value) || undefined;

        if (nodeClassValue && nodeClassValue.slice(0, 1) === 'q') {
          // Get all of the nodes with the same data-id that come before this one in the dom
          // Add the textContent length of each node to the anchorOffset
          anchorOffset += getOffsetNeededForPsalms({
            node,
            verse: firstVerse,
            chapter,
            book: activeBookId,
            refNode: formatHighlight || format,
          });
        }
        // Need to subtract by 1 since the anchor offset isn't 0 based
        highlightStart = node.textContent.indexOf(anchorText) + anchorOffset;
        // I think this can stay the same as formatted, it could be made shorter potentially
        // need to remove all line breaks and note characters
        highlightedWords = selectedText.replace(replaceCharsRegex, '').length - dist;
      } else {
        node = getPlainParentVerse(node, firstVerse);
        // taking off the first 2 spaces and the verse number from the string
        // This should only be the case for the first highlight within that verse
        const newText = node.textContent.slice(0);
        if (userSettings.getIn(['toggleOptions', 'readersMode', 'active'])) {
          highlightStart = node.textContent.indexOf(anchorText) + anchorOffset;
          highlightedWords = selectedText.replace(/\n/g, '').length;
        } else {
          highlightStart = newText.indexOf(anchorText) + anchorOffset;
          highlightedWords = selectedText.replace(/\n/g, '').length - dist;
        }
      }
      // plain text 乁(✿ ͡° ͜ʖ ͡°)و
      if (userId && userAuthenticated) {
        // If the color is none then we are assuming that the user wants whatever they highlighted to be removed
        highlightObject.book = activeBookId;
        highlightObject.chapter = activeChapter;
        highlightObject.verseStart = firstVerse;
        highlightObject.color = color;
        highlightObject.highlightStart = highlightStart;
        highlightObject.highlightedWords = highlightedWords;
        if (color === 'none') {
          deleteHighlights(highlightObject, highlights);
        } else {
          addHighlight({
            bible: activeTextId,
            userId,
            book: activeBookId,
            chapter: activeChapter,
            verseStart: firstVerse,
            color,
            highlightStart,
            highlightedWords,
            reference: getReference(firstVerse, lastVerse, activeBookName, activeChapter),
          });
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error adding highlight', err); // eslint-disable-line no-console
      } else if (process.env.NODE_ENV === 'test') {
        console.error('Error adding highlight', err); // eslint-disable-line no-console
      }
      // dispatch action to log error and also show an error message
      closeContextMenu();
    }
  }

  closeContextMenu();
  // Returning the highlight for testing purposes
  return highlightObject;
};

export default addHighlightUtil;
