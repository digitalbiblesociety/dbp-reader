/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer } from 'react-virtualized';
import matchSorter from 'match-sorter';
import LoadingSpinner from 'components/LoadingSpinner';

class LanguageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		filterText: '',
	//
	// 	};
	// }
	// Try to reduce the number of times language list is iterated over
	getFilteredLanguages(width, height) {
		const {
			languages,
			// activeLanguageName,
			activeIsoCode,
			filterText,
		} = this.props;
		// const { filterText } = this.state;
		// console.log('languages', languages);
		// console.log('match-sorter languages', matchSorter(languages, filterText, { keys: ['name', 'iso'] }));
		const filteredLanguages = filterText ? matchSorter(languages, filterText, { keys: ['name', 'iso'] }) : languages;

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
			// const language = filteredLanguages.get(index);
			// key={language.get('iso')}
			// if (isScrolling) {
			// 	return <div key={key} style={style}>scrolling...</div>;
			// }
			// return (
			// 	<div style={style} key={key} className="language-name" role="button" tabIndex={0} onClick={() => this.handleLanguageClick(language)}>
			// 		<h4 className={language.get('iso') === activeIsoCode ? 'active-language-name' : ''}>{language.get('name')}</h4>
			// 	</div>
			// );
			return (
				<div style={style} key={key} className="language-name" role="button" tabIndex={0} onClick={(e) => this.handleLanguageClick(e, language)}>
					<h4 className={language.iso === activeIsoCode ? 'active-language-name' : ''}>{language.name}</h4>
				</div>
			);
		};

		const getActiveIndex = () => {
			let activeIndex = 0;

			filteredLanguages.forEach((l, i) => {
				if (l.iso === activeIsoCode) {
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
				estimatedRowSize={28 * filteredLanguages.length}
				height={height}
				rowRenderer={renderARow}
				rowCount={filteredLanguages.length}
				overscanRowCount={2}
				rowHeight={28}
				scrollToIndex={getActiveIndex()}
				width={width}
				scrollToAlignment={'start'}
			/>
		) : <div className={'language-error-message'}>There are no matches for your search.</div>;

		// return components.length ? components : <span>There are no matches for your search.</span>;
	}

	filterFunction = (language, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (language.iso.toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (language.name.toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

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
			setActiveIsoCode({ iso: language.iso, name: language.name });
			// console.log('Toggling languageList');
			toggleLanguageList();
			// this.setState({ filterText: '' });
			toggleVersionList();
		}
	}

	// handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			active,
			loadingLanguages,
			languages,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div className="language-name-list">
						{
							!loadingLanguages ? (
								<AutoSizer>
									{({ width, height }) => this.getFilteredLanguages(width, height)}
								</AutoSizer>
							) : <LoadingSpinner />
						}
						{
							languages.length === 0 ? <span className={'language-error-message'}>There was an error fetching this resource, an Admin has been notified. We apologize for the inconvenience</span> : null
						}
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
	filterText: PropTypes.string,
	active: PropTypes.bool,
	loadingLanguages: PropTypes.bool,
	// activeLanguageName: PropTypes.string,
	activeIsoCode: PropTypes.string,
};

export default LanguageList;
