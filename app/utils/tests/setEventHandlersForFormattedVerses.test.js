import setEventHandlersForFormattedVerses from '../requiresDom/setEventHandlersForFormattedVerses';
import ref from '../testUtils/footnoteChapterText';

function triggerMouseEvent(node, eventType) {
	const event = document.createEvent('MouseEvents');
	event.initEvent(eventType, true, true);
	node.dispatchEvent(event);
}

describe('setEventHandlersForFormattedVerses utility function', () => {
	it('should register the click handlers', () => {
		const mouseDown = jest.fn();
		const mouseUp = jest.fn();
		const bookmarkClick = jest.fn();
		const noteClick = jest.fn();
		const node = document.createElement('div');

		node.innerHTML = ref;
		setEventHandlersForFormattedVerses(node, {
			mouseDown,
			mouseUp,
			bookmarkClick,
			noteClick,
		});
		const verses = [...node.querySelectorAll('[data-id]')];
		const noteIcon = node.getElementsByClassName('note-in-verse')[0];
		const bookmarkIcon = node.getElementsByClassName('bookmark-in-verse')[0];

		triggerMouseEvent(verses[1], 'mousedown');
		triggerMouseEvent(verses[2], 'mouseup');
		triggerMouseEvent(noteIcon, 'click');
		triggerMouseEvent(bookmarkIcon, 'click');

		expect(mouseDown).toHaveBeenCalled();
		expect(mouseUp).toHaveBeenCalled();
		expect(noteClick).toHaveBeenCalled();
		expect(bookmarkClick).toHaveBeenCalled();
	});
});
