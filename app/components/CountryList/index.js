/**
 *
 * CountryList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer } from 'react-virtualized';
import LoadingSpinner from '../LoadingSpinner';

class CountryList extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		startY: 0,
		distance: 0,
		endY: 0,
		pulling: false,
	};

	getFilteredCountries(width, height) {
		const {
			countries,
			setCountryName,
			toggleLanguageList,
			activeCountryName,
			setCountryListState,
			getCountry,
			filterText,
		} = this.props;
		const filteredCountryMap = filterText
			? countries.filter((country) => this.filterFunction(country, filterText))
			: countries;
		const filteredCountries = filteredCountryMap.valueSeq();

		if (countries.size === 0) {
			return (
				<div className={'country-error-message'}>
					There was an error fetching this resource, an Admin has been notified.
					We apologize for the inconvenience.
				</div>
			);
		}

		const renderARow = ({ index, style, key }) => {
			const country = filteredCountries.get(index);

			return (
				<div
					className="country-name"
					key={key}
					style={style}
					role="button"
					tabIndex={0}
					title={country.get('name')}
					onClick={() => {
						setCountryName({
							name: country.get('name'),
							languages: country.get('languages'),
						});
						getCountry({ iso: country.getIn(['codes', 'iso']) });
						setCountryListState();
						toggleLanguageList();
					}}
				>
					<svg className="icon" height="25px" width="25px">
						<use
							xmlnsXlink="http://www.w3.org/1999/xlink"
							xlinkHref={`/static/flags.svg#${country.getIn([
								'codes',
								'iso_a2',
							])}`}
						/>
					</svg>
					<h4
						className={
							activeCountryName === country.get('name')
								? 'active-language-name'
								: 'inactive-country'
						}
					>
						{country.get('name')}
					</h4>
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
				id={'list-element'}
				estimatedRowSize={32 * filteredCountries.size}
				height={height}
				rowRenderer={renderARow}
				rowCount={filteredCountries.size}
				overscanRowCount={0}
				rowHeight={32}
				scrollToIndex={getActiveIndex()}
				width={width}
				scrollToAlignment={'start'}
			/>
		) : (
			<div className={'country-error-message'}>
				There are no matches for your search.
			</div>
		);
	}

	// If a swipe happened
	// Check if list's scroll top is 0
	// If it is at 0 then activate the logic for refreshing the countries
	// Otherwise do not do anything
	handleStart = (clientY) => {
		if (this.listScrollTop() === 0) {
			this.setState({ startY: clientY, pulling: true });
		}
	};

	handleMove = (clientY) => {
		// Difference between this move position and the start position
		// is the distance the refresh message should be from where it started
		const maxDistance = 80;
		const minDistance = 0;
		if (
			this.listScrollTop() === 0 &&
			this.state.startY === 0 &&
			!this.state.pulling
		) {
			this.setState({ startY: clientY, pulling: true });
		} else if (
			clientY - this.state.startY <= maxDistance &&
			clientY - this.state.startY >= minDistance &&
			this.state.pulling
		) {
			this.setState((cs) => ({ distance: clientY - cs.startY }));
		}
	};

	handleEnd = (clientY) => {
		// User must have pulled at least 40px
		const minDistance = 40;
		if (
			this.state.startY < clientY &&
			this.state.pulling &&
			this.state.distance > minDistance
		) {
			this.setState({
				startY: 0,
				distance: 0,
				endY: 0,
				pulling: false,
			});
			this.props.getCountries();
		} else {
			this.setState({
				startY: 0,
				distance: 0,
				endY: 0,
				pulling: false,
			});
		}
	};

	handleTouchStart = (touchStartEvent) => {
		this.handleStart(touchStartEvent.targetTouches[0].clientY);
	};

	handleTouchMove = (touchMoveEvent) => {
		this.handleMove(touchMoveEvent.targetTouches[0].clientY);
	};

	handleTouchEnd = (e) => {
		this.handleEnd(e.changedTouches[0].clientY);
	};

	handleMouseDown = (mouseDownEvent) => {
		this.handleStart(mouseDownEvent.clientY);
		this.container.addEventListener('mousemove', this.handleMouseMove);
	};

	handleMouseMove = (mouseMoveEvent) => {
		this.handleMove(mouseMoveEvent.clientY);
	};

	handleMouseUp = (e) => {
		this.handleEnd(e.clientY);
		this.container.removeEventListener('mousemove', this.handleMouseMove);
	};

	handleMouseLeave = (e) => {
		this.handleMouseUp(e);
	};

	listScrollTop = () =>
		document && document.getElementById('list-element')
			? document.getElementById('list-element').scrollTop
			: 0;

	filterFunction = (country, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (
			country
				.getIn(['codes', 'iso_a2'])
				.toLowerCase()
				.includes(lowerCaseText)
		) {
			return true;
		} else if (
			country.get('name') !== '' &&
			country
				.get('name')
				.toLowerCase()
				.includes(lowerCaseText)
		) {
			return true;
		}
		return false;
	};

	handleRef = (el) => {
		this.container = el;
	};

	render() {
		const { active, loadingCountries } = this.props;
		const { distance } = this.state;
		/* eslint-disable jsx-a11y/no-static-element-interactions */
		if (active) {
			return (
				<div className="text-selection-section">
					<div
						ref={this.handleRef}
						onTouchStart={this.handleTouchStart}
						onTouchEnd={this.handleTouchEnd}
						onTouchMove={this.handleTouchMove}
						onMouseDown={this.handleMouseDown}
						onMouseUp={this.handleMouseUp}
						onMouseLeave={this.handleMouseLeave}
						className="country-name-list"
					>
						<div
							style={{ height: distance, maxHeight: distance }}
							className={
								distance ? 'pull-down-refresh pulling' : 'pull-down-refresh'
							}
						>
							<span style={{ textAlign: 'center', width: '100%' }}>
								{`${distance > 40 ? 'Release' : 'Pull'} to Refresh`}
							</span>
						</div>
						{loadingCountries ? (
							<LoadingSpinner />
						) : (
							<AutoSizer>
								{({ width, height }) =>
									this.getFilteredCountries(width, height)
								}
							</AutoSizer>
						)}
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
	getCountry: PropTypes.func,
	getCountries: PropTypes.func,
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingCountries: PropTypes.bool,
	activeCountryName: PropTypes.string,
};

export default CountryList;
