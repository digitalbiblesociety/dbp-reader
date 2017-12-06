/**
*
* Logo
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { changeLocale } from '../../containers/LanguageProvider/actions';
import { makeSelectLocale } from '../../containers/LanguageProvider/selectors';

class Logo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      locale: props.locale,
    };
  }

  render() {
    if (this.props.locale === 'en') {
      return (<svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" aria-labelledby="logo_en_title">
        <title id="logo_en_title">Bible.is</title>
        <path d="M234 377a69 69 0 0 1-45 40c-10 4-22 6-34 6H38V144h112c27 0 49 7 64 21s22 33 22 57a64 64 0 0 1-34 58l13 8 12 12a69 69 0 0 1 13 42c0 13-2 25-6 35zm-62-176c-6-6-15-9-26-9H92v64h54c11 1 20-2 26-8 7-6 10-14 10-24 0-9-3-17-10-23zm5 115c-6-7-15-10-28-10H92v68h57c13 0 22-3 28-10s9-15 9-24c0-10-3-18-9-24zm93 107V219h51v204h-51zm257-79l-2 23c-1 8-3 15-6 22s-7 13-12 18c-6 5-13 10-21 13a82 82 0 0 1-56 0c-8-3-16-9-23-17v20h-49V144h51v93c7-8 14-13 22-16a77 77 0 0 1 55 0c8 3 16 8 21 14 5 5 9 11 12 17a163 163 0 0 1 9 45v23l-1 24zm-52-47c0-7-2-13-4-18-3-5-6-9-10-12-5-3-11-5-18-5a32 32 0 0 0-29 17c-2 5-4 11-4 18a207 207 0 0 0 0 47l4 18c3 6 6 10 11 13 4 3 10 4 18 4 7 0 13-1 18-4 4-3 7-7 10-13 2-5 4-11 4-18a212 212 0 0 0 0-47zm139 126c-9 0-18-2-25-5a50 50 0 0 1-27-32c-2-7-3-14-3-22V144h47v217c0 6 2 11 4 14 3 3 7 5 13 5h3v43h-12zm84-87c0 14 3 25 11 33 8 9 19 13 33 13 11 0 20-2 27-5 6-3 13-8 19-14l31 30c-5 5-10 10-15 13a93 93 0 0 1-38 17 131 131 0 0 1-59-3c-12-3-22-8-31-16-8-8-15-19-21-33a150 150 0 0 1-1-95 80 80 0 0 1 46-53c11-5 23-7 36-7 14 0 27 3 38 7a81 81 0 0 1 45 52c4 12 6 25 6 39v22H698zm76-46l-4-10c-3-6-7-11-12-15-6-4-13-7-22-7s-15 2-21 6a39 39 0 0 0-16 26l-1 12h77l-1-12zm71 129v-50c0-3 1-4 4-4h49c2 0 4 1 4 4v50c0 2-2 4-4 4h-49c-3 0-4-2-4-4zm94 4V219h50v204h-50zm229-39c-4 8-10 15-18 21-8 5-17 9-28 12-10 3-22 4-34 4a256 256 0 0 1-45-5 97 97 0 0 1-42-24l34-34c8 9 17 14 27 16l27 3c5 1 9 0 13-1 5 0 8-2 12-3l8-7c2-2 3-6 3-10 0-5-2-9-5-12-3-4-8-6-16-6l-33-4c-18-1-33-7-43-16-11-8-16-22-16-41a58 58 0 0 1 24-48c7-6 15-10 25-13 9-2 19-4 30-4 15 0 30 2 43 5 13 4 25 10 34 19l-31 32c-6-5-13-9-21-11-9-2-17-3-26-3-10 0-18 2-22 6-5 4-7 8-7 14l1 5 3 6 6 4 11 2 32 3c21 3 36 9 46 19s15 24 15 41c0 12-2 21-7 30zM316 199h-41c-2 0-4-2-4-4v-41c0-3 2-4 4-4h41c2 0 4 1 4 4v41c0 2-2 4-4 4zm668 0h-41c-2 0-4-2-4-4v-41c0-3 2-4 4-4h41c2 0 4 1 4 4v41c0 2-2 4-4 4z" fill="#fff" />
      </svg>);
    }

    // Otherwise default to normal
    return <p>No Logo Found</p>;
  }
}

Logo.propTypes = {
  locale: PropTypes.string,
};

const mapStateToProps = createSelector(
    makeSelectLocale(),
    (locale) => ({ locale })
);

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: (evt) => dispatch(changeLocale(evt.target.value)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logo);
