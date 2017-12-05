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
import TableOfContents from 'components/TableOfContents';

import { getTexts } from './actions';
import makeSelectHomePage, { selectTextTitles } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.dispatch(getTexts());
  }

  render() {
    const {
      activeTextName,
    } = this.props.homepage;
    const {
      textTitles,
    } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="Home page for bible.is" />
        </Helmet>
        <NavigationBar activeTextName={activeTextName} />
        <TableOfContents textTitles={textTitles} />
      </React.Fragment>
    );
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  homepage: PropTypes.object.isRequired,
  textTitles: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  homepage: makeSelectHomePage(),
  textTitles: selectTextTitles(),
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
