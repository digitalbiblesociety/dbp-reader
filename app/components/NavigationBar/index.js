/**
*
* NavigationBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/Logo';
// import LocaleToggle from 'containers/LocaleToggle';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class NavigationBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			activeBookName,
			activeTextId,
      toggleChapterSelection,
			toggleVersionSelection,
			toggleMenuBar,
			toggleProfile,
			activeChapter,
    } = this.props;

		return (
			<div className="nav-container">
				<div className="small-1 menu">
					<span role="button" tabIndex={0} onClick={toggleMenuBar}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="menu" /></span>
				</div>
				<div className="small-1 logo">
					<Logo />
				</div>
				<div className="small-8 chapter-selector">
					<span role="button" tabIndex={0} onClick={toggleChapterSelection} className="text">{`${activeBookName} ${activeChapter}`}<SvgWrapper className="svg" height="15px" width="15px" fill="#fff" svgid="go-down" opacity=".5" /></span>
					<span role="button" tabIndex={0} onClick={toggleVersionSelection} className="text version">{activeTextId}<SvgWrapper className="svg" height="15px" width="15px" fill="#fff" svgid="go-down" opacity=".5" /></span>
				</div>
				<div className="small-2 buttons">
					<span><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="search" /></span>
					<span role="button" tabIndex={0} onClick={toggleProfile}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="profile_circle" /></span>
				</div>
			</div>
		);
	}
}

NavigationBar.propTypes = {
	activeBookName: PropTypes.string,
	activeTextId: PropTypes.string,
	toggleChapterSelection: PropTypes.func,
	toggleVersionSelection: PropTypes.func,
	toggleMenuBar: PropTypes.func,
	toggleProfile: PropTypes.func,
	activeChapter: PropTypes.number,
};

export default NavigationBar;
