/**
*
* CountryList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer } from 'react-virtualized';
import LoadingSpinner from 'components/LoadingSpinner';
import flags from 'images/flags.svg';

class CountryList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		filterText: '',
	// 	};
	// }
	//
	// componentWillReceiveProps(nextProps) {
	// 	if (!nextProps.active && nextProps.active !== this.props.active) {
	// 		this.setState({ filterText: '' });
	// 	}
	// }

	getFilteredCountries(width, height) {
		const {
			countries,
			setCountryName,
			toggleLanguageList,
			activeCountryName,
			setCountryListState,
			// toggleVersionList,
			filterText,
		} = this.props;
		// const { filterText } = this.state;
		const filteredCountryMap = filterText ? countries.filter((country) => this.filterFunction(country, filterText)) : countries;
		const filteredCountries = filteredCountryMap.valueSeq();
		// console.log('filtered countries', filteredCountries);

		if (countries.size === 0) {
			return <div className={'country-error-message'}>There was an error fetching this resource, an Admin has been notified. We apologize for the inconvenience</div>;
		}

		const renderARow = ({ index, style, key }) => {
			const country = filteredCountries.get(index);
			// key={language.get('iso_code')}
			// if (isScrolling) {
			// 	return <div key={key} style={style}>scrolling...</div>;
			// }
			return (
				<div
					className="country-name"
					key={key}
					style={style}
					role="button"
					tabIndex={0}
					onClick={() => {
						setCountryName({ name: country.get('name'), languages: country.get('languages') });
						setCountryListState();
						toggleLanguageList();
					}}
				>
					<svg className="icon" height="25px" width="25px">
						<use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${flags}#${country.getIn(['codes', 'iso_a2'])}`}></use>
					</svg>
					<h4 className={activeCountryName === country.get('name') ? 'active-language-name' : 'inactive-country'}>{country.get('name')}</h4>
				</div>
			);
		};

		const getActiveIndex = () => {
			let activeIndex = 0;

			filteredCountries.forEach((l, i) => {
				if (l.get('name') === activeCountryName) {
					activeIndex = i;
				}
			});

			return activeIndex;
		};

		return filteredCountries.size ? (
			<List
				estimatedRowSize={28 * filteredCountries.size}
				height={height}
				rowRenderer={renderARow}
				rowCount={filteredCountries.size}
				overscanRowCount={10}
				rowHeight={28}
				scrollToIndex={getActiveIndex()}
				width={width}
			/>
		) : <div className={'country-error-message'}>There are no matches for your search.</div>;
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

	// handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			active,
			loadingCountries,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div className="country-name-list">
						{
							loadingCountries ? (
								<LoadingSpinner />
							) : (
								<AutoSizer>
									{({ width, height }) => this.getFilteredCountries(width, height)}
								</AutoSizer>
							)
						}
					</div>
				</div>
			);
		}
		return null;
	}
}

CountryList.propTypes = {
	countries: PropTypes.object,
	setCountryName: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	setCountryListState: PropTypes.func,
	// toggleVersionList: PropTypes.func,
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingCountries: PropTypes.bool,
	activeCountryName: PropTypes.string,
};

export default CountryList;
