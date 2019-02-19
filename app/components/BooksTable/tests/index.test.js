import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { mount } from 'enzyme';
import { BooksTable } from '..';

import { bookData } from '../../../utils/testUtils/booksData';

const closeBookTable = jest.fn(() => (props.active = false));
const props = {
	dispatch: jest.fn(),
	closeBookTable,
	books: fromJS(bookData),
	audioObjects: [],
	userId: 609294,
	audioType: 'audio_drama',
	activeTextId: 'ENGESV',
	activeBookName: 'Matthew',
	initialBookName: 'Matthew',
	activeChapter: 3,
	loadingBooks: false,
	userAuthenticated: false,
	hasTextInDatabase: true,
	active: true,
	filesetTypes: {},
	textDirection: 'ltr',
};
let wrapper;

describe('BooksTable tests', () => {
	beforeEach(() => {
		wrapper = mount(<BooksTable {...props} />);
	});
	it('should match snapshot with all potential props', () => {
		const tree = renderer.create(<BooksTable {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with direction right to left', () => {
		const tree = renderer
			.create(<BooksTable {...props} textDirection={'rtl'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot when it is closed', () => {
		const tree = renderer
			.create(<BooksTable {...props} active={false} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot when it is loading', () => {
		const tree = renderer
			.create(<BooksTable {...props} loadingBooks />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should successfully mount', () => {
		expect(wrapper).toBeTruthy();
	});
	it('should successfully handle a chapter click', () => {
		const spy = jest.spyOn(wrapper.instance(), 'handleChapterClick');

		wrapper.instance().handleChapterClick();

		wrapper.setProps({ active: props.active });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(closeBookTable).toHaveBeenCalledTimes(1);
		expect(wrapper.props().active).toBe(false);
	});
	it('should successfully handle a book click where persist is a function', () => {
		const spy = jest.spyOn(wrapper.instance(), 'handleBookClick');

		wrapper.instance().handleBookClick(
			{
				persist: jest.fn(),
				target: { parentElement: { offsetTop: 10 } },
			},
			'Matthew',
		);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(wrapper.state('selectedBookName')).toBe('');
	});
	it('should successfully handle a book click where persist is not a function', () => {
		const spy = jest.spyOn(wrapper.instance(), 'handleBookClick');

		wrapper.instance().container.scrollTop = 50;
		wrapper.instance().handleBookClick(
			{
				target: { parentElement: { offsetTop: 60 } },
			},
			'Mark',
		);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(wrapper.state('selectedBookName')).toBe('Mark');
		expect(wrapper.instance().container.scrollTop).toEqual(50);
	});
	it('should successfully handle a book click where selected book name is different', () => {
		const spy = jest.spyOn(wrapper.instance(), 'handleBookClick');

		wrapper.instance().handleBookClick(
			{
				persist: jest.fn(),
				target: { parentElement: { offsetTop: 15 } },
			},
			'Luke',
		);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(wrapper.state('selectedBookName')).toBe('Luke');
	});
	it('should successfully handle the active prop change', () => {
		const spy = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
		wrapper.setProps({ active: false });
		expect(wrapper.props().active).toBe(false);
		wrapper.setProps({ active: true, activeBookName: 'Mark' });
		expect(wrapper.props().active).toBe(true);
		expect(spy).toHaveBeenCalledTimes(2);
		expect(wrapper.state('selectedBookName')).toBe('Mark');
	});
	it('should work with empty initialBookName prop', () => {
		const localWrapper = mount(<BooksTable {...props} initialBookName={''} />);
		expect(localWrapper.state('selectedBookName')).toEqual('Matthew');
	});
	it('should work with empty initialBookName and activeBookName props', () => {
		const localWrapper = mount(
			<BooksTable {...props} initialBookName={''} activeBookName={''} />,
		);
		expect(localWrapper.state('selectedBookName')).toEqual('');
	});
});
