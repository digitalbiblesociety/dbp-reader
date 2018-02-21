/**
*
* CountryList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';
import flags from 'images/flags.svg';

class CountryList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.active && nextProps.active !== this.props.active) {
			this.setState({ filterText: '' });
		}
	}

	get filteredCountries() {
		const {
			countries,
			setCountryName,
			toggleLanguageList,
			activeCountryName,
			setCountryListState,
			toggleVersionList,
		} = this.props;
		const { filterText } = this.state;
		const filteredCountries = filterText ? countries.filter((country) => this.filterFunction(country, filterText)) : countries;

		const components = filteredCountries.valueSeq().map((country) => (
			<div
				className="country-name"
				key={country.getIn(['codes', 'iso_a2']) || 'ANY'}
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
					<use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${flags}#${country.getIn(['codes', 'iso_a2'])}`}></use>
				</svg>
				<h4 className={activeCountryName === country.get('name') ? 'active-language-name' : 'inactive-country'}>{country.get('name')}</h4>
			</div>
		));

		if (countries.size === 0) {
			return <span>There was an error fetching this resource, an Admin has been notified. We apologize for the inconvenience</span>;
		}

		return components.size ? components : <span>There are no matches for your search.</span>;
	}

	filterFunction = (country, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (country.getIn(['codes', 'iso_a2']).toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (country.get('name') !== '' && country.get('name').toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

	handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			active,
			toggleLanguageList,
			activeCountryName,
			setCountryListState,
			toggleVersionList,
			loadingCountries,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div role={'button'} tabIndex={0} onClick={() => { setCountryListState({ state: false }); toggleLanguageList({ state: true }); }} className="text-selection-title">
						<SvgWrapper height="25px" width="25px" fill="#fff" svgid="globe" />
						<span className="text">COUNTRY:</span>
						{/* <span className="active-header-name">{activeCountryName || 'ANY'}</span> */}
					</div>
					<input className="text-selection-input" onChange={this.handleChange} placeholder="SEARCH COUNTRIES" value={this.state.filterText} />
					<div className="language-name-list">
						{
							loadingCountries ? (
								<LoadingSpinner />
							) : this.filteredCountries
						}
					</div>
				</div>
			);
		}
		return (
			<div className="text-selection-section closed" role="button" tabIndex={0} onClick={() => { setCountryListState({ state: true }); toggleVersionList({ state: false }); toggleLanguageList({ state: false }); }}>
				<div className="text-selection-title">
					<SvgWrapper height="25px" width="25px" fill="#fff" svgid="globe" />
					<span className="text">COUNTRY:</span>
					<span className="active-header-name">{activeCountryName || 'ANY'}</span>
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
	loadingCountries: PropTypes.bool,
	activeCountryName: PropTypes.string,
};

export default CountryList;
