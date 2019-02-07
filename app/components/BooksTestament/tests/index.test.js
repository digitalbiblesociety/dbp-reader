import React from 'react';
// import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import renderer from 'react-test-renderer';
import BooksTestament from '..';

const books = fromJS({});
const handleRef = jest.fn();
const handleBookClick = jest.fn();
const handleChapterClick = jest.fn();
const activeChapter = 1;
const testamentPrefix = '';
const selectedBookName = '';
const activeBookName = '';
const activeTextId = '';
const audioType = '';

describe('<BooksTestament />', () => {
	it('Should match the old snapshot', () => {
		const tree = renderer
			.create(
				<BooksTestament
					books={books}
					handleRef={handleRef}
					handleBookClick={handleBookClick}
					handleChapterClick={handleChapterClick}
					activeChapter={activeChapter}
					testamentPrefix={testamentPrefix}
					selectedBookName={selectedBookName}
					activeBookName={activeBookName}
					activeTextId={activeTextId}
					audioType={audioType}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
