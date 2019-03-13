import setEventHandlersForFootnotes from '../requiresDom/setEventHandlersForFootnotes';
import ref from '../testUtils/sampleFormattedChapter';

describe('setEventHandlersForFootnotes utility function', () => {
	it('should register the click handlers', () => {
		const handler = jest.fn();
		const node = document.createElement('div');
		node.innerHTML = ref;
		setEventHandlersForFootnotes(node, handler);
		const notes = [...node.getElementsByClassName('note')];
		notes[0].click();

		expect(handler).toHaveBeenCalled();
	});
});
