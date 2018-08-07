/**
 *
 * SearchContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import SvgWrapper from '../../components/SvgWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import SearchResult from '../../components/SearchResult';
import RecentSearches from '../../components/RecentSearches';
import {
	getSearchResults,
	viewError,
	stopLoading,
	startLoading,
} from './actions';
import makeSelectSearchContainer, { selectSearchResults } from './selectors';
import reducer from './reducer';
import saga from './saga';

export class SearchContainer extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		filterText: '',
		firstSearch: true,
	};

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(
			this.ref,
			this.props.toggleSearchModal,
		);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
		this.props.dispatch(viewError());
		this.props.dispatch(stopLoading());
	}

	setRef = (node) => {
		this.ref = node;
	};

	getSearchResults = (props) => this.props.dispatch(getSearchResults(props));

	handleSearchModalToggle = () => {
		// document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSearchModal();
	};

	handleSearchInputEnter = (e) => {
		const searchText = e.target.value;
		if (
			((e.keyCode && e.keyCode === 13) || (e.which && e.which === 13)) &&
			searchText
		) {
			if (this.timer) {
				clearTimeout(this.timer);
			}

			const refObject = this.checkInputForReference(searchText);

			if (refObject.isReference) {
				this.handleReferenceRedirect({ ...refObject, searchText });
			} else {
				this.getSearchResults({
					bibleId: this.props.bibleId,
					searchText: e.target.value,
				});
				this.setState({ firstSearch: false });
			}
		}
	};

	handleSearchInputChange = (e) => {
		// console.log('is a reference changed', this.checkInputForReference(e.target.value));
		const val = e.target.value;
		const { bibleId, loadingResults } = this.props;
		const refObject = this.checkInputForReference(e.target.value);

		this.setState({ filterText: val, firstSearch: !val });
		// May want to not control the loading state with redux and just use setState instead
		if (!loadingResults && val) {
			this.props.dispatch(startLoading());
		} else if (!val) {
			this.props.dispatch(stopLoading());
		}
		// Clears the timeout so that at most there will only be one request per second
		if (this.timer) {
			clearTimeout(this.timer);
		}

		// Don't have to bind 'this' bc of the arrow function
		this.timer = setTimeout(() => {
			if (!val) {
				return;
			}
			if (refObject.isReference) {
				this.handleReferenceRedirect({ ...refObject, searchText: val });
			} else {
				this.getSearchResults({ bibleId, searchText: val });
				this.setState({ firstSearch: false });
			}
		}, 1500);
	};

	handleSearchOptionClick = (filterText) => {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		if (!filterText) {
			return;
		}
		const refObject = this.checkInputForReference(filterText);

		if (refObject.isReference) {
			// Navigate to the verse url
			// probably need to have access to push
			// Iterate over the book list
			// if any of the books match the book given && the book has the chapter given && the chapter has the verse given
			// push the url of the book id, chapter, verse in the current bible
			// display error saying that we could not find what they were searching for
			this.handleReferenceRedirect({ ...refObject, searchText: filterText });
		} else {
			this.getSearchResults({
				bibleId: this.props.bibleId,
				searchText: filterText,
			});
		}

		this.setState({ firstSearch: false, filterText });
	};

	handleReferenceRedirect = ({ book, chapter, firstVerse, searchText }) => {
		const books = this.props.books;
		const bibleId = this.props.bibleId;
		const lBook = book.toLowerCase();
		const bookObject = books.find(
			(b) =>
				((b.name && b.name.toLowerCase() === lBook) ||
					(b.book_id && b.book_id.toLowerCase() === lBook) ||
					(b.name_short && b.name_short.toLowerCase() === lBook)) &&
				b.chapters.includes(chapter),
		);
		// console.log('handling redirect', books);
		// Todo: Use next router for the programatic navigation here
		if (bookObject) {
			// console.log('url to be pushed...', `/${bibleId}/${bookObject.book_id.toLowerCase()}/${chapter}${firstVerse ? `/${firstVerse}` : ''}`);
			this.props.toggleSearchModal();
			this.props.history.push(
				`/${bibleId.toLowerCase()}/${bookObject.book_id.toLowerCase()}/${chapter}${
					firstVerse ? `/${firstVerse}` : ''
				}`,
			);
		} else {
			this.getSearchResults({
				bibleId,
				searchText,
			});
		}
	};

	checkInputForReference = (searchText) => {
		// Regular expression for testing whether a user entered a reference
		// book | chapter(s) | chapter separator | start verse | verse separator | end verse
		// es2016 ([\p{L}]+\p{Z}*)(\p{N}+)\p{P}*(\p{N}*)\p{P}*(\p{N}*) - multi-lingual (Does not work for Arabic)

		// book | chapter(s) | chapter separator | start verse | verse separator | end verse
		// es2015 \w+\s*[0-9]+[:.]*[0-9]*[-.]*[0-9]* - english only
		// There must be at least a word then whitespace then a number
		const regex = /(.*?)\s*(\d+):?(\d+)?.*/;

		const isReference = regex.test(searchText);
		/* Leaving the logs below in on the off chance that we need to do a unicode regex */
		// console.log('isReference', isReference);
		// console.log('regex', regex);
		// console.log('searchText.match(regex, g)', searchText.match(regex, 'g'));

		// const unicodeRegex = new RegExp('([\u{L}]+\u{Z}*)', '(\u{N}+)', '\u{P}*', '(\u{N}*)', '\u{P}*', '(\u{N}*)');
		// const unicodeReg = new XRegExp('([\\p{L}]+)\\p{Z}*(\\p{N}+)\\p{P}*(\\p{N}*)\\p{P}*(\\p{N}*)');
		// console.log('unicodeReg', unicodeReg);
		// console.log('unicodeReg test', unicodeReg.test(searchText));
		// console.log('unicodeReg match', searchText.match(unicodeReg, 'g'));

		// console.log('es2016', /([\p{L}]+\p{Z}*)(\p{N}+)\p{P}*(\p{N}*)\p{P}*(\p{N}*)/u.test(searchText));
		// console.log('searchText', searchText);
		// console.log('isReference', isReference);

		if (isReference) {
			// Return the whether it was a reference plus the book, chapter and verse(s)
			const match = searchText.match(regex);
			// console.log('match', match);

			// Using trim to remove any whitespace
			// Using parseInt to turn the numbers into integers
			return {
				isReference,
				book: match[1] && match[1],
				chapter: match[2] && parseInt(match[2], 10),
				firstVerse: match[3] && parseInt(match[3], 10),
			};
		}

		return {
			isReference,
		};
	};

	get formattedResults() {
		const {
			// searchResults,
			showError,
			trySearchOptions,
			lastFiveSearches,
			loadingResults,
		} = this.props.searchcontainer;
		const { bibleId, searchResults } = this.props;
		// console.log('selectedRes', searchResults);
		const { firstSearch } = this.state;

		if (firstSearch) {
			return (
				<div className={'search-history-wrapper'}>
					<div className={'search-history'}>
						<div className={'starting'}>
							<h2>Need a place to start? Try Searching:</h2>
							{trySearchOptions.map((o) => (
								<button
									key={o.id}
									className={'search-history-item'}
									onClick={() => this.handleSearchOptionClick(o.searchText)}
								>
									{o.searchText}
								</button>
							))}
						</div>
						<div className={'history'}>
							<div className={'header'}>
								<h2>Search History:</h2>
							</div>
							<RecentSearches
								searches={lastFiveSearches}
								clickHandler={this.handleSearchOptionClick}
							/>
						</div>
					</div>
				</div>
			);
		}

		if (loadingResults) {
			return <LoadingSpinner />;
		}

		return (
			<div className={'search-results'}>
				{searchResults.size && !showError ? (
					searchResults.toIndexedSeq().map((res) => (
						<div className={'book-result-section'} key={res.get('name')}>
							<div className={'header'}>
								<h1>{res.get('name')}</h1>
							</div>
							{res
								.get('results')
								.map((r) => (
									<SearchResult
										bibleId={bibleId}
										key={`${r.get('book_id')}${r.get('chapter')}${r.get(
											'verse_start',
										)}`}
										result={r}
									/>
								))}
						</div>
					))
				) : (
					<section className={'no-matches'}>
						There were no matches for your search
					</section>
				)}
			</div>
		);
	}

	render() {
		const { filterText } = this.state;
		const { loadingResults } = this.props.searchcontainer;
		// Need a good method of telling whether there are no results because a user hasn't searched
		// or if it was because this was the first visit to the tab
		return (
			<aside className={'search-wrapper'}>
				<aside ref={this.setRef} className="search">
					<header>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<input
							onChange={this.handleSearchInputChange}
							onKeyPress={this.handleSearchInputEnter}
							value={filterText}
							className={'input-class'}
							placeholder={'Search'}
						/>
						<SvgWrapper
							onClick={this.handleSearchModalToggle}
							className={'icon'}
							svgid={'arrow_left'}
						/>
					</header>
					{loadingResults ? <LoadingSpinner /> : this.formattedResults}
				</aside>
			</aside>
		);
	}
}

SearchContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleSearchModal: PropTypes.func.isRequired,
	bibleId: PropTypes.string,
	history: PropTypes.object,
	searchResults: PropTypes.object,
	searchcontainer: PropTypes.object,
	loadingResults: PropTypes.bool,
	books: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
	searchcontainer: makeSelectSearchContainer(),
	searchResults: selectSearchResults(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'searchContainer', reducer });
const withSaga = injectSaga({ key: 'searchContainer', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(SearchContainer);
