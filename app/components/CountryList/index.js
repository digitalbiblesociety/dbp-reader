/**
*
* CountryList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import flags from 'images/flags.svg';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class CountryList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
		};
	}

	filterFunction = (country, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (country.get('iso').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (country.get('name') !== '' && country.get('name').toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

	handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			countries,
			setCountryName,
			active,
			toggleLanguageList,
			activeCountryName,
			setCountryListState,
			toggleVersionList,
		} = this.props;
		const { filterText } = this.state;
		const filteredCountries = filterText ? countries.filter((country) => this.filterFunction(country, filterText)) : countries;
		if (active) {
			return (
				<div className="text-selection-section">
					<div className="text-selection-title">
						<SvgWrapper height="25px" width="25px" fill="#fff" svgid="globe" />
						<span className="text">COUNTRY:</span>
						<span className="active-header-name">{activeCountryName || 'ALL'}</span>
					</div>
					<input className="text-selection-input" onChange={this.handleChange} placeholder="SEARCH LANGUAGES" />
					<div className="language-name-list">
						{
							filteredCountries.valueSeq().map((country) => (
								<div
									className="country-name"
									key={country.get('iso')}
									role="button"
									tabIndex={0}
									onClick={() => {
										setCountryName({ name: country.get('name'), languages: country.get('languages') });
										setCountryListState({ state: false });
										toggleVersionList({ state: false });
										toggleLanguageList({ state: true });
									}}
								>
									<svg className="svg" height="25px" width="25px">
										<use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${flags}#${country.get('iso')}`}></use>
									</svg>
									<h4 className={activeCountryName === country.get('name') ? 'active-language-name' : 'inactive-country'}>{country.get('name')}</h4>
								</div>
							))
						}
					</div>
				</div>
			);
		}
		return (
			<div className="text-selection-section closed" role="button" tabIndex={0} onClick={() => { setCountryListState({ state: true }); toggleVersionList({ state: false }); toggleLanguageList({ state: false }); }}>
				<div className="text-selection-title">
					<SvgWrapper height="25px" width="25px" fill="#fff" svgid="world" />
					<span className="text">COUNTRY:</span>
					<span className="active-header-name">{activeCountryName || 'ALL'}</span>
				</div>
			</div>
		);
	}
}

CountryList.propTypes = {
	countries: PropTypes.object,
	setCountryName: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	setCountryListState: PropTypes.func,
	toggleVersionList: PropTypes.func,
	active: PropTypes.bool,
	activeCountryName: PropTypes.string,
};

export default CountryList;
