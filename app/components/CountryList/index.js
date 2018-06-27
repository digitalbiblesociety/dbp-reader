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
		top: 0,
		originalOffset: 0,
		velocity: 0,
		timeOfLastDragEvent: 0,
		touchStartX: 0,
		prevTouchX: 0,
		beingTouched: false,
		height: 0,
		intervalId: null,
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
	handleStart = (clientX) => {
		if (this.state.intervalId !== null) {
			clearInterval(this.state.intervalId);
		}
		this.setState({
			originalOffset: this.state.top,
			velocity: 0,
			timeOfLastDragEvent: Date.now(),
			touchStartX: clientX,
			beingTouched: true,
			intervalId: null,
		});
	};

	animateSlidingToZero = () => {
		let { top, velocity } = this.state;
		const beingTouched = this.state.beingTouched;
		if (!beingTouched && top < -0.01) {
			velocity += 10 * 0.033;
			top += velocity;
			if (top < -350) {
				clearInterval(this.state.intervalId);
				// console.log('Caught the swipe');
			}
			this.setState({ top, velocity });
		} else if (!beingTouched) {
			top = 0;
			velocity = 0;
			clearInterval(this.state.intervalId);
			this.setState({ top, velocity, intervalId: null, originalOffset: 0 });
		}
	};

	handleMove = (clientX) => {
		if (this.state.beingTouched) {
			const touchX = clientX;
			const currTime = Date.now();
			const elapsed = currTime - this.state.timeOfLastDragEvent;
			const velocity = (20 * (touchX - this.state.prevTouchX)) / elapsed;
			let deltaX =
				touchX - (this.state.touchStartX + this.state.originalOffset);
			if (deltaX < -350) {
				// console.log('Caught the swipe');
			} else if (deltaX > 0) {
				deltaX = 0;
			}
			this.setState({
				top: deltaX,
				velocity,
				timeOfLastDragEvent: currTime,
				prevTouchX: touchX,
			});
		}
	};

	handleEnd = () => {
		this.setState({
			velocity: this.state.velocity,
			touchStartX: 0,
			beingTouched: false,
			intervalId: setInterval(this.animateSlidingToZero.bind(this), 33),
		});
	};

	handleTouchStart = (touchStartEvent) => {
		touchStartEvent.preventDefault();
		this.handleStart(touchStartEvent.targetTouches[0].clientY);
	};

	handleTouchMove = (touchMoveEvent) => {
		this.handleMove(touchMoveEvent.targetTouches[0].clientY);
	};

	handleTouchEnd = () => {
		this.handleEnd();
	};
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

		if (active) {
			return (
				<div className="text-selection-section">
					<div
						ref={this.handleRef}
						onTouchStart={this.handleTouchStart}
						onTouchEnd={this.handleTouchEnd}
						onTouchMove={this.handleTouchMove}
						className="country-name-list"
					>
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
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingCountries: PropTypes.bool,
	activeCountryName: PropTypes.string,
};

export default CountryList;
