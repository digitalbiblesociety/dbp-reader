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
			// toggleVersionList,
			getCountry,
			filterText,
		} = this.props;
		// const { filterText } = this.state;
		const filteredCountryMap = filterText
			? countries.filter((country) => this.filterFunction(country, filterText))
			: countries;
		const filteredCountries = filteredCountryMap.valueSeq();
		// console.log('filtered countries', filteredCountries);

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
							xlinkHref={`${flags}#${country.getIn(['codes', 'iso_a2'])}`}
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
				estimatedRowSize={28 * filteredCountries.size}
				height={height}
				rowRenderer={renderARow}
				rowCount={filteredCountries.size}
				overscanRowCount={10}
				rowHeight={28}
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
			this.setState({ distance: clientY - this.state.startY });
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
			console.log('ended and needs to send api call');
			this.setState({
				startY: 0,
				distance: 0,
				endY: 0,
				pulling: false,
			});
			this.props.getCountries();
		} else {
			console.log('ended but should not send api call');
			this.setState({
				startY: 0,
				distance: 0,
				endY: 0,
				pulling: false,
			});
		}
	};

	handleTouchStart = (touchStartEvent) => {
		// touchStartEvent.preventDefault();
		this.handleStart(touchStartEvent.targetTouches[0].clientY);
	};

	handleTouchMove = (touchMoveEvent) => {
		this.handleMove(touchMoveEvent.targetTouches[0].clientY);
	};

	handleTouchEnd = (e) => {
		this.handleEnd(e.changedTouches[0].clientY);
	};

	handleMouseDown = (mouseDownEvent) => {
		// mouseDownEvent.preventDefault();
		this.handleStart(mouseDownEvent.clientY);
	};

	handleMouseMove = (mouseMoveEvent) => {
		this.handleMove(mouseMoveEvent.clientY);
	};

	handleMouseUp = (e) => {
		this.handleEnd(e.clientY);
	};

	handleMouseLeave = (e) => {
		this.handleMouseUp(e);
	};

	listScrollTop = () =>
		document && document.getElementById('list-element')
			? document.getElementById('list-element').scrollTop
			: 0;
	// handleListTouch = (e) => {
	// 	console.log('touch started');
	//
	// 	// this.container.addEventListener('touchend', this.handleTouchEnd);
	// 	// this.container.addEventListener('touchcancel', this.handleTouchEnd);
	// 	// this.container.addEventListener('touchmove', this.handleTouchMove);
	// 	const touches = e.targetTouches;
	// 	let list = {};
	// 	if (document) {
	// 		list = document.getElementById('list-element');
	// 	}
	//
	// 	if (list.scrollTop === 0) {
	// 		this.setState({ listIsAtTop: true }, function startListState() {
	// 			this.container.addEventListener('touchend', this.handleTouchEnd);
	// 			this.container.addEventListener('touchcancel', this.handleTouchEnd);
	// 			this.container.addEventListener('touchmove', this.handleTouchMove);
	// 		});
	// 	} else {
	// 		this.setState({ listIsAtTop: false }, function stopListState() {
	// 			this.container.removeEventListener('touchend', this.handleTouchEnd);
	// 			this.container.removeEventListener('touchcancel', this.handleTouchEnd);
	// 			this.container.removeEventListener('touchmove', this.handleTouchMove);
	// 		});
	// 	}
	// 	console.log('this.container', this.container);
	//
	// 	console.log('list', list);
	//
	// 	console.log('touches', touches);
	// 	console.log('this.container.scrollTop', this.container.scrollTop);
	// 	console.log('this.container.scrollHeight', this.container.scrollHeight);
	// }
	//
	// handleTouchEnd = () => {
	// 	this.container.removeEventListener('touchend', this.handleTouchEnd);
	// 	this.container.removeEventListener('touchcancel', this.handleTouchEnd);
	// 	this.container.removeEventListener('touchmove', this.handleTouchMove);
	// }
	//
	// handleTouchMove = (e) => {
	// 	console.log('e.targetTouches in move', e.targetTouches);
	// }

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

		if (active) {
			return (
				<div className="text-selection-section">
					<div
						ref={this.handleRef}
						onTouchStart={this.handleTouchStart}
						onTouchEnd={this.handleTouchEnd}
						onTouchMove={this.handleTouchMove}
						onMouseDown={this.handleMouseDown}
						onMouseMove={this.handleMouseMove}
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
							<span style={{ textAlign: 'center', width: '100%' }}>{`${
								distance > 40 ? 'Release' : 'Pull'
							} to Refresh`}</span>
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
	// toggleVersionList: PropTypes.func,
	getCountry: PropTypes.func,
	getCountries: PropTypes.func,
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingCountries: PropTypes.bool,
	// Using two different loading variables to keep the
	// list from disappearing on a manual refresh
	// finishedLoadingCountries: PropTypes.bool,
	activeCountryName: PropTypes.string,
};

export default CountryList;
