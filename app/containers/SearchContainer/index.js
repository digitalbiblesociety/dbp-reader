/**
 *
 * SearchContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import { getSearchResults, viewError, stopLoading } from './actions';
import makeSelectSearchContainer from './selectors';
import reducer from './reducer';
import saga from './saga';

export class SearchContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		filterText: '',
	}

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleSearchModal);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
		this.props.dispatch(viewError());
		this.props.dispatch(stopLoading());
	}

	setRef = (node) => {
		this.ref = node;
	}

	getSearchResults = (props) => this.props.dispatch(getSearchResults(props))

	handleSearchModalToggle = () => {
		// document.removeEventListener('click', this.handleClickOutside);

		this.props.toggleSearchModal();
	}

	handleSearchInputChange = (e) => {
		const val = e.target.value;
		const { bibleId } = this.props;

		this.setState({ filterText: val });
		// Clears the timeout so that at most there will only be one request per second
		if (this.timer) {
			clearTimeout(this.timer);
		}
		// Don't have to bind 'this' bc of the arrow function
		this.timer = setTimeout(() => {
			if (!val) {
				return;
			}
			this.getSearchResults({ bibleId, searchText: val });
		}, 1000);
	}

	get formattedResults() {
		const { searchResults, bibleId } = this.props.searchcontainer;
		const { filterText } = this.state;
		// Dont know of a better way to differentiate between words because two of the
		// same word could be in the text, this way at least their index in the array is different
		/* eslint-disable react/no-array-index-key */
		return searchResults.map((r) => (
			<div key={`${r.book_id}${r.chapter}${r.verse_start}`} className={'single-result'}>
				<h4><Link to={`/${bibleId}/${r.book_id}/${r.chapter}/${r.verse_start}`}>{`${r.book_name_alt} ${r.chapter_alt}:${r.verse_start_alt}`}</Link></h4>
				<p>{r.verse_text.split(' ').map((w, i) => w.toLowerCase().includes(filterText.toLowerCase()) ? <em key={`${w}_${i}`} className={'search-highlight'}>{w} </em> : `${w} `)}</p>
			</div>
		));
	}

	render() {
		const { filterText } = this.state;
		const { searchResults, loadingResults, showError } = this.props.searchcontainer;
		// console.log('last five', this.props.searchcontainer.lastFiveSearches);
		// Need a good method of telling whether there are no results because a user hasn't searched
		// or if it was because this was the first visit to the tab
		return (
			<GenericErrorBoundary affectedArea="Search">
				<aside ref={this.setRef} className="search">
					<header>
						<h1 className="section-title">Search</h1>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<SvgWrapper onClick={this.handleSearchModalToggle} className={'icon'} svgid={'arrow_left'} />
					</header>
					<div className={'search-input-bar'}>
						<SvgWrapper className={'icon'} svgid={'search'} />
						<input
							onChange={this.handleSearchInputChange}
							value={filterText}
							className={'input-class'}
							placeholder={'Search'}
						/>
					</div>
					{
						loadingResults ? <LoadingSpinner /> : (
							<div className={'search-results'}>
								<h2>Search Results</h2>
								{
									(searchResults.length && !showError) ? this.formattedResults : <div>There were no matches for your search</div>
								}
							</div>
						)
					}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

SearchContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleSearchModal: PropTypes.func.isRequired,
	bibleId: PropTypes.string,
	searchcontainer: PropTypes.object,
	loadingResults: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	searchcontainer: makeSelectSearchContainer(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'searchContainer', reducer });
const withSaga = injectSaga({ key: 'searchContainer', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(SearchContainer);
