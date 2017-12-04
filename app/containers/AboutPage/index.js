/**
 *
 * AboutPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import messages from './messages';

function AboutPage() {
  return (
    <div>
      <Helmet>
        <title>About Page</title>
        <meta name="description" content="About the Koinos App" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

AboutPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(AboutPage);
