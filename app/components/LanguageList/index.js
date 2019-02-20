/**
 *
 * LanguageList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer } from 'react-virtualized';
import matchSorter from 'match-sorter';
import LoadingSpinner from '../LoadingSpinner';

class LanguageList extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		startY: 0,
		distance: 0,
		endY: 0,
		pulling: false,
	};

	// Try to reduce the number of times language list is iterated over
	getFilteredLanguages(width, height) {
		const { languages, languageCode, filterText } = this.props;
		const filteredLanguages = filterText
			? matchSorter(languages, filterText, {
					threshold: matchSorter.rankings.ACRONYM,
					keys: [
						'name',
						'iso',
						{
							maxRanking: matchSorter.rankings.STARTS_WITH,
							key: 'alt_names',
						},
					],
			  })
			: languages;

		if (languages.length === 0) {
			return null;
		}

		const renderARow = ({ index, style, key }) => {
			const language = filteredLanguages[index];

			return (
				<div
					style={style}
					key={key}
					className="language-name"
					role="button"
					tabIndex={0}
					title={language.englishName || language.name}
					onClick={(e) => this.handleLanguageClick(e, language)}
				>
					<h4
						className={
							language.id === languageCode ? 'active-language-name' : ''
						}
					>
						{language.alt_names && language.alt_names.includes(filterText)
							? filterText
							: language.autonym || language.englishName || language.name}
						{language.autonym &&
						language.autonym !== (language.englishName || language.name)
							? ` - ( ${language.englishName || language.name} )`
							: null}
					</h4>
				</div>
			);
		};

		const getActiveIndex = () => {
			let activeIndex = 0;

			filteredLanguages.forEach((l, i) => {
				if (l.id === languageCode) {
					activeIndex = i;
				}
			});

			return activeIndex;
		};

		return filteredLanguages.length ? (
			<List
				id={'list-element'}
				estimatedRowSize={34 * filteredLanguages.length}
				height={height}
				rowRenderer={renderARow}
				rowCount={filteredLanguages.length}
				overscanRowCount={2}
				rowHeight={34}
				scrollToIndex={getActiveIndex()}
				width={width}
				scrollToAlignment={'start'}
			/>
		) : (
			<div className={'language-error-message'}>
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
			this.props.getLanguages();
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

	filterFunction = (language, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (language.iso.toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (language.name.toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	};

	handleLanguageClick = (e, language) => {
		if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
			e.stopPropagation();
		} else if ('cancelBubble' in e) {
			e.cancelBubble = true;
		}
		const {
			setActiveIsoCode,
			toggleLanguageList,
			toggleVersionList,
		} = this.props;
		if (language) {
			setActiveIsoCode({
				iso: language.iso,
				name: language.name,
				languageCode: language.id,
			});
			toggleLanguageList();
			toggleVersionList();
		}
	};

	handleRef = (el) => {
		this.container = el;
	};

	render() {
		const { active, loadingLanguages, languages } = this.props;
		const distance = this.state.distance;

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
						className="language-name-list"
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
						{!loadingLanguages ? (
							<AutoSizer>
								{({ width, height }) =>
									this.getFilteredLanguages(width, height)
								}
							</AutoSizer>
						) : (
							<LoadingSpinner />
						)}
						{languages.length === 0 && !loadingLanguages ? (
							<span className={'language-error-message'}>
								There was an error fetching this resource, an Admin has been
								notified. We apologize for the inconvenience.
							</span>
						) : null}
					</div>
				</div>
			);
		}
		return null;
	}
}

LanguageList.propTypes = {
	languages: PropTypes.array,
	setActiveIsoCode: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	toggleVersionList: PropTypes.func,
	getLanguages: PropTypes.func,
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingLanguages: PropTypes.bool,
	languageCode: PropTypes.number,
};

export default LanguageList;
