/**
*
* LanguageList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { List, AutoSizer } from 'react-virtualized';
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
		const filteredLanguages = filterText ? languages.filter((language) => this.filterFunction(language, filterText)) : languages;

		// const components = () => filteredLanguages.map((language) => (
		// 	<div className="language-name" key={language.get('iso')} role="button" tabIndex={0} onClick={() => this.handleLanguageClick(language)}>
		// 		<h4 className={language.get('name') === activeLanguageName ? 'active-language-name' : ''}>{language.get('name')}</h4>
		// 	</div>
		// ));

		if (languages.size === 0) {
			return <span>There was an error fetching this resource, an Admin has been notified. We apologize for the inconvenience</span>;
		}

		const renderARow = ({ index, style, key }) => {
			const language = filteredLanguages.get(index);
			// key={language.get('iso')}
			// if (isScrolling) {
			// 	return <div key={key} style={style}>scrolling...</div>;
			// }
			return (
				<div style={style} key={key} className="language-name" role="button" tabIndex={0} onClick={() => this.handleLanguageClick(language)}>
					<h4 className={language.get('iso') === activeIsoCode ? 'active-language-name' : ''}>{language.get('name')}</h4>
				</div>
			);
		};

		const getActiveIndex = () => {
			let activeIndex = 0;

			filteredLanguages.forEach((l, i) => {
				if (l.get('iso') === activeIsoCode) {
					activeIndex = i;
				}
			});

			return activeIndex;
		};

		return filteredLanguages.size ? (
			<List
				estimatedRowSize={28 * filteredLanguages.size}
				height={height}
				rowRenderer={renderARow}
				rowCount={filteredLanguages.size}
				overscanRowCount={10}
				rowHeight={28}
				scrollToIndex={getActiveIndex()}
				width={width}
			/>
		) : <span>There are no matches for your search.</span>;

		// return components.size ? components : <span>There are no matches for your search.</span>;
	}

	filterFunction = (language, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (language.get('iso').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (language.get('name').toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

	handleLanguageClick = (language) => {
		const {
			setActiveIsoCode,
			toggleLanguageList,
			toggleVersionList,
			// setCountryListState,
			// active,
		} = this.props;
		// console.log('new language', language);
		if (language) {
			setActiveIsoCode({ iso: language.get('iso'), name: language.get('name') });
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
					</div>
				</div>
			);
		}
		return null;
	}
}

LanguageList.propTypes = {
	languages: PropTypes.object,
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
