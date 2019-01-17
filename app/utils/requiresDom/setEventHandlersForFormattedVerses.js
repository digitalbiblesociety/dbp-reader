/**
	@ref is a dom element
	@handlers is an object with up to four different functions for each event
 */
const setEventHandlersForFormattedVerses = (
	ref,
	{ mouseDown, mouseUp, bookmarkClick, noteClick },
) => {
	// Set mousedown and mouseup events on verse elements
	try {
		// Sets a "click" event on every formatted verse
		const verses = [...ref.querySelectorAll('[data-id]')].slice(1);

		verses.forEach((verse) => {
			/* eslint-disable no-param-reassign, no-unused-expressions, jsx-a11y/no-static-element-interactions */
			verse.onmousedown = (e) => {
				e.stopPropagation();
				mouseDown(e);
			};
			verse.onmouseup = (e) => {
				e.stopPropagation();
				mouseUp(e);
			};
			// No-op to get the mouse events to fire on iOS
			verse.onclick = () => {};
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error adding event handlers to formatted verses: ', err); // eslint-disable-line no-console
		}
	}

	// Set click events on bookmark icons
	try {
		const elements = [...ref.getElementsByClassName('bookmark-in-verse')];

		elements.forEach((el, i) => {
			el.onclick = (e) => {
				e.stopPropagation();

				bookmarkClick(i, true);
			};
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error adding event handlers to formatted verses: ', err); // eslint-disable-line no-console
		}
	}

	// Set click events on note icons
	try {
		const elements = [...ref.getElementsByClassName('note-in-verse')];

		elements.forEach((el, i) => {
			el.onclick = (e) => {
				e.stopPropagation();

				noteClick(i, false);
			};
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error adding event handlers to formatted verses: ', err); // eslint-disable-line no-console
		}
	}
};

export default setEventHandlersForFormattedVerses;
