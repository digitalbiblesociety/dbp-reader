import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import PlainTextVerse from '../index';

jest.mock('../../IconsInText', () => () => <div id="mockIcons">mockIcons</div>);

const onMouseUp = jest.fn();
const onMouseDown = jest.fn();
const onHighlightClick = jest.fn();
const onNoteClick = jest.fn();
const verse = {
	book_id: 'GEN',
	book_name: 'Genesis',
	book_name_alt: 'Genesis',
	chapter: 1,
	chapter_alt: '1',
	verse_end: 1,
	verse_end_alt: '1',
	verse_start: 1,
	verse_start_alt: '1',
	verse_text: 'In the beginning God created the heavens and the earth.',
	wholeVerseHighlighted: true,
};
const activeVerse = 0;
const verseIsActive = false;
const oneVerse = false;

describe('PlainTextVerse', () => {
	it('should return correct component', () => {
		const wrapper = mount(
			<PlainTextVerse
				onMouseUp={onMouseUp}
				onMouseDown={onMouseDown}
				onHighlightClick={onHighlightClick}
				onNoteClick={onNoteClick}
				verse={verse}
				activeVerse={activeVerse}
				verseIsActive={verseIsActive}
				oneVerse={oneVerse}
			/>,
		);

		expect(wrapper.find('#mockIcons').length).toEqual(1);
		expect(wrapper.contains(verse.verse_text)).toEqual(true);
	});
	it('Should match the old snapshot', () => {
		const tree = renderer
			.create(
				<PlainTextVerse
					onMouseUp={onMouseUp}
					onMouseDown={onMouseDown}
					onHighlightClick={onHighlightClick}
					onNoteClick={onNoteClick}
					verse={verse}
					activeVerse={activeVerse}
					verseIsActive={verseIsActive}
					oneVerse={oneVerse}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match the old snapshot for oneVerse option', () => {
		const tree = renderer
			.create(
				<PlainTextVerse
					onMouseUp={onMouseUp}
					onMouseDown={onMouseDown}
					onHighlightClick={onHighlightClick}
					onNoteClick={onNoteClick}
					verse={verse}
					activeVerse={activeVerse}
					verseIsActive={verseIsActive}
					oneVerse
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should render one verse per line if oneVerse is true', () => {
		const wrapper = mount(
			<PlainTextVerse
				onMouseUp={onMouseUp}
				onMouseDown={onMouseDown}
				onHighlightClick={onHighlightClick}
				onNoteClick={onNoteClick}
				verse={verse}
				activeVerse={activeVerse}
				verseIsActive={verseIsActive}
				oneVerse
			/>,
		);
		expect(wrapper.props().oneVerse).toBe(true);
		expect(wrapper.find('#mockIcons').length).toEqual(1);
		expect(wrapper.contains(verse.verse_text)).toEqual(true);
		expect(wrapper.find('br').length).toEqual(1);
	});
});
