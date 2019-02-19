import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { countries } from '../../../utils/testUtils/countryData';
import CountryList from '..';

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
});
