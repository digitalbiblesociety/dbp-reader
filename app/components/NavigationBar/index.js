/**
*
* NavigationBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/Logo';
import ChapterButton from 'components/ChapterButton';
import SearchButton from 'components/SearchButton';
import LocaleToggle from 'containers/LocaleToggle';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class NavigationBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
      // toggleVersionSelect,
      activeTextName,
      toggleBibleNames,
      toggleBookNames,
    } = this.props;

		return (
			<nav>
				<div className="small-2 columns">
					<Logo />
				</div>
				<div className="small-6 columns">
					<button className="version-button" onClick={toggleBibleNames} >{activeTextName}</button>
					<ChapterButton toggleBookNames={toggleBookNames} />
					<form id="search-form" method="post" action="/search" _lpchecked="1">
						<input type="hidden" name="_token" value="c7sP4piHloj4OtAJaujus64WWylkp5OxR1leypxZ" />
						<input className="search" type="text" name="search" placeholder="Romanos 10:17 or Jesus" />
						<input type="hidden" name="bible_id" id="volume" value="ENGNIV" />
						<SearchButton />
					</form>
				</div>
				<div className="small-2 columns">
					<button className="font-button">Aa</button>
				</div>
				<div className="small-2 columns">
					<LocaleToggle />
				</div>
			</nav>
		);
	}
}

NavigationBar.propTypes = {
	activeTextName: PropTypes.string,
	toggleBibleNames: PropTypes.func,
	toggleBookNames: PropTypes.func,
};

export default NavigationBar;
