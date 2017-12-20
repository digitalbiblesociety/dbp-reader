/**
*
* NavigationBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/Logo';
import LocaleToggle from 'containers/LocaleToggle';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class NavigationBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
      // toggleVersionSelect,
			activeBookName,
      toggleTextSelection,
			toggleMenuBar,
			toggleProfile,
			activeChapter,
    } = this.props;

		return (
			<div className="nav-container">
				<div className="menu">
					<span role="button" tabIndex={0} onClick={toggleMenuBar}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="menu" /></span>
				</div>
				<div className="logo">
					<Logo />
				</div>
				<div className="chapter-selector">
					<span role="button" tabIndex={0} onClick={toggleTextSelection} className="text">{`${activeBookName} ${activeChapter}`}</span>
				</div>
				<div className="buttons">
					<span><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="search" /></span>
					<span role="button" tabIndex={0} onClick={toggleProfile}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="profile" /></span>
					<LocaleToggle />
				</div>
			</div>
		);
	}
}

NavigationBar.propTypes = {
	activeBookName: PropTypes.string,
	toggleTextSelection: PropTypes.func,
	toggleMenuBar: PropTypes.func,
	toggleProfile: PropTypes.func,
	activeChapter: PropTypes.number,
};

export default NavigationBar;
