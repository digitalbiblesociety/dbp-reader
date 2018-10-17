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
		const {
			languages,
			// activeLanguageName,
			// activeIsoCode,
			languageCode,
			filterText,
		} = this.props;
		// const { filterText } = this.state;
		// console.log('languages', languages);
		// console.log('match-sorter languages', matchSorter(languages, filterText, { keys: ['name', 'iso'] }));
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

		// const components = () => filteredLanguages.map((language) => (
		// 	<div className="language-name" key={language.get('iso')} role="button" tabIndex={0} onClick={() => this.handleLanguageClick(language)}>
		// 		<h4 className={language.get('name') === activeLanguageName ? 'active-language-name' : ''}>{language.get('name')}</h4>
		// 	</div>
		// ));

		if (languages.length === 0) {
			return null;
		}

		const renderARow = ({ index, style, key }) => {
			const language = filteredLanguages[index];
			// Use code below if there needs to be an intermediary state
			// key={language.get('iso')}
			// if (isScrolling) {
			// 	return <div key={key} style={style}>scrolling...</div>;
			// }
			// return (
			// 	<div style={style} key={key} className="language-name" role="button" tabIndex={0} onClick={() => this.handleLanguageClick(language)}>
			// 		<h4 className={language.get('iso') === activeIsoCode ? 'active-language-name' : ''}>{language.get('name')}</h4>
			// 	</div>
			// );

			// Code below as a potential solution for searching a name that is not displayed
			// const topNames = filterText ? matchSorter(language.alt_names, filterText) : [];
			// const topNamesLength = topNames.length;
			// topNames.slice(0, topNamesLength < 3 ? topNamesLength : 3).join(', ')
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
							: language.vernacular_name ||
							  language.englishName ||
							  language.name}
						{language.vernacular_name &&
						language.vernacular_name !== (language.englishName || language.name)
							? ` - ( ${language.englishName || language.name} )`
							: null}
					</h4>
				</div>
			);
		};

		const getActiveIndex = () => {
			let activeIndex = 0;
			// console.log(
			//   'searching for the active index for language list',
			//   languageCode,
			// );

			filteredLanguages.forEach((l, i) => {
				// if (l.iso === activeIsoCode) {
				if (l.id === languageCode) {
					// console.log('active index for language list');
					activeIndex = i;
				}
			});

			return activeIndex;
		};
		// Once somebody complains about the text overlapping use the links below to fix
		/*
		* https://github.com/bvaughn/react-virtualized/blob/master/source/CellMeasurer/CellMeasurer.example.js
		* https://stackoverflow.com/questions/43837279/dynamic-row-heights-with-react-virtualized-and-new-cellmeasurer
		* */
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

		// return components.length ? components : <span>There are no matches for your search.</span>;
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
			// console.log('ended and needs to send api call');
			this.setState({
				startY: 0,
				distance: 0,
				endY: 0,
				pulling: false,
			});
			this.props.getLanguages();
		} else {
			// console.log('ended but should not send api call');
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
			// console.log('Stopping prop');
			e.stopPropagation();
		} else if ('cancelBubble' in e) {
			// console.log('canceling bubble');
			e.cancelBubble = true;
		}
		const {
			setActiveIsoCode,
			toggleLanguageList,
			toggleVersionList,
			// setCountryListState,
			// active,
		} = this.props;
		// console.log('new language', language);
		if (language) {
			setActiveIsoCode({
				iso: language.iso,
				name: language.name,
				languageCode: language.id,
			});
			// console.log('Toggling languageList');
			toggleLanguageList();
			// this.setState({ filterText: '' });
			toggleVersionList();
		}
	};

	handleRef = (el) => {
		this.container = el;
	};
	// handleChange = (e) => this.setState({ filterText: e.target.value });

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
							<span style={{ textAlign: 'center', width: '100%' }}>{`${
								distance > 40 ? 'Release' : 'Pull'
							} to Refresh`}</span>
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
	// setCountryListState: PropTypes.func,
	toggleVersionList: PropTypes.func,
	getLanguages: PropTypes.func,
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingLanguages: PropTypes.bool,
	// activeLanguageName: PropTypes.string,
	// activeIsoCode: PropTypes.string,
	languageCode: PropTypes.number,
};

export default LanguageList;
