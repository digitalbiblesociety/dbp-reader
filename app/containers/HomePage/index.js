/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import NavigationBar from 'components/NavigationBar';
import BiblesTable from 'components/BiblesTable';
import BooksTable from 'components/BooksTable';
import GenericErrorBoundary from 'components/GenericErrorBoundary';

import { getTexts, toggleBibleNames, toggleBookNames, setActiveBookName, getBooks } from './actions';
import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.props.dispatch(getTexts());
	}

	getBooksForText = ({ textId }) => this.props.dispatch(getBooks({ textId }));

	setActiveBookName = (bookName) => this.props.dispatch(setActiveBookName(bookName));

	toggleBibleNames = () => this.props.dispatch(toggleBibleNames());

	toggleBookNames = () => this.props.dispatch(toggleBookNames());

	render() {
		const {
			activeTextName,
			isBibleTableActive,
			isBookTableActive,
			texts,
			books,
			activeBookName,
		} = this.props.homepage;

		return (
			<GenericErrorBoundary>
				<Helmet>
					<title>Home Page</title>
					<meta name="description" content="Home page for bible.is" />
				</Helmet>
				<NavigationBar
					activeTextName={activeTextName}
					toggleBibleNames={this.toggleBibleNames}
					toggleBookNames={this.toggleBookNames}
				/>
				{
					isBibleTableActive ? (
						<BiblesTable getBooksForText={this.getBooksForText} bibles={texts} />
					) : null
				}
				{
					isBookTableActive ? (
						<BooksTable setActiveBookName={this.setActiveBookName} activeBookName={activeBookName} books={books} />
					) : null
				}
			</GenericErrorBoundary>
		);
	}
}

HomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	homepage: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'homepage', reducer });
const withSaga = injectSaga({ key: 'homepage', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(HomePage);
