import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { countries } from '../../../utils/testUtils/countryData';
import CountryList from '..';

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
	countries: fromJS(countries),
	setCountryName: jest.fn(),
	toggleLanguageList: jest.fn(),
	setCountryListState: jest.fn(),
	getCountry: jest.fn(),
	getCountries: jest.fn(),
	filterText: '',
	active: true,
	loadingCountries: false,
	activeCountryName: 'ANY',
};

describe('CountryList component', () => {
	it('should match snapshot of active list', () => {
		const tree = renderer.create(<CountryList {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot of active list with an applied filter', () => {
		const tree = renderer
			.create(<CountryList {...props} filterText={'uni'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
