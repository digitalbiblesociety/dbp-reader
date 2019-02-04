import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import ReadersModeVerse from '..';

const highlightMessage = 'clicked highlight';

describe('ReadersModeVerse tests', () => {
	let wrapper;
	let onMouseUp = jest.fn();
	let onMouseDown = jest.fn();
	let onHighlightClick = jest.fn();
	let verse = {
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
	let activeVerse = 0;
	let verseIsActive = false;

	beforeEach(() => {
		onMouseUp = jest.fn();
		onMouseDown = jest.fn();
		onHighlightClick = jest.fn(() => highlightMessage);
		verse = {
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
		activeVerse = 0;
		verseIsActive = false;
		wrapper = shallow(
			<ReadersModeVerse
				wrapper={wrapper}
				onMouseUp={onMouseUp}
				onMouseDown={onMouseDown}
				onHighlightClick={onHighlightClick}
				verse={verse}
				activeVerse={activeVerse}
				verseIsActive={verseIsActive}
			/>,
		);
	});
	afterEach(() => {
		wrapper = null;
	});
	it('Should match the old snapshot', () => {
		const tree = renderer
			.create(
				<ReadersModeVerse
					wrapper={wrapper}
					onMouseUp={onMouseUp}
					onMouseDown={onMouseDown}
					onHighlightClick={onHighlightClick}
					verse={verse}
					activeVerse={activeVerse}
					verseIsActive={verseIsActive}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('It should shallow render the component and have one verse span', () => {
		expect(wrapper.find('.align-left').length).toEqual(1);
	});
	/* eslint-disable no-underscore-dangle */
	it('It should render the text of the verse passed to it', () => {
		expect(
			wrapper.find('.align-left').props().dangerouslySetInnerHTML.__html,
		).toEqual(verse.verse_text);
	});
	/* eslint-enable no-underscore-dangle */
	it('It should call onHighlightClick when the verse span is clicked', () => {
		const verseNode = wrapper.find('.align-left');
		const spy = jest.spyOn(verseNode.props(), 'onClick');
		const clickResult = verseNode.props().onClick();
		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalled();
		expect(clickResult).toEqual(highlightMessage);
	});
});
