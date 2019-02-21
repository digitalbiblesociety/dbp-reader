import React from 'react';
// import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import NavigationBar from '..';

const props = {
	theme: 'red',
	userAgent: '',
	activeTextId: 'ENGESV',
	activeBookName: 'Matthew',
	activeTextName: 'English Standard Version',
	textDirection: 'ltr',
	toggleChapterSelection: jest.fn(),
	toggleVersionSelection: jest.fn(),
	activeChapter: 1,
	isChapterSelectionActive: false,
	isVersionSelectionActive: false,
};

describe('<NavigationBar /> component', () => {
	it('should match snapshot with default props', () => {
		const tree = renderer.create(<NavigationBar {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with chapter selection active', () => {
		const tree = renderer
			.create(<NavigationBar {...props} isChapterSelectionActive />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with version selection active', () => {
		const tree = renderer
			.create(<NavigationBar {...props} isVersionSelectionActive />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with ms as the user agent', () => {
		const tree = renderer
			.create(<NavigationBar {...props} userAgent={'ms'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with paper theme', () => {
		const tree = renderer
			.create(<NavigationBar {...props} theme={'paper'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with paper theme and ms as the user agent', () => {
		const tree = renderer
			.create(<NavigationBar {...props} theme={'paper'} userAgent={'ms'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
