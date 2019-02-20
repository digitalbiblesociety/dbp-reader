import React from 'react';
import renderer from 'react-test-renderer';
import { languages } from '../../../utils/testUtils/languageData';
import LanguageList from '..';

/* eslint-disable no-plusplus */
jest.mock('react-virtualized', () => ({
	List: ({ rowRenderer, rowCount }) => {
		const components = [];
		for (let i = 0; i < rowCount; i++) {
			components.push(rowRenderer({ index: i, style: '', key: `${i}_row` }));
		}
		return components;
	},
	AutoSizer: ({ children }) => children({ width: 150, height: 50 }),
}));
/* eslint-enable no-plusplus */

const props = {
	languages,
	setActiveIsoCode: jest.fn(),
	toggleLanguageList: jest.fn(),
	toggleVersionList: jest.fn(),
	getLanguages: jest.fn(),
	filterText: '',
	active: true,
	loadingLanguages: false,
	languageCode: 6414,
};

describe('LanguageList component', () => {
	it('should match snapshot of active list', () => {
		const tree = renderer.create(<LanguageList {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot of active list with an applied filter', () => {
		const tree = renderer
			.create(<LanguageList {...props} filterText={'en'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
