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
			toggleSettingsModal,
			toggleMenuBar,
			activeChapter,
    } = this.props;

		return (
			<nav>
				<div className="small-1 columns">
					<span role="button" tabIndex={0} onClick={toggleMenuBar}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="menu" /></span>
				</div>
				<div className="small-2 columns">
					<Logo />
				</div>
				<div className="small-6 columns">
					<div className="navbar-active-chapter">
						<span role="button" tabIndex={0} onClick={toggleTextSelection} className="text">{`${activeBookName} ${activeChapter}`}</span>
					</div>
				</div>
				<div className="small-3 columns">
					<span><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="search" /></span>
					<span><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="info" /></span>
					<span role="button" tabIndex={0} onClick={toggleSettingsModal}><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="settings" /></span>
					<span><SvgWrapper className="navbar-button" height="30px" width="30px" fill="#fff" svgid="profile" /></span>
					<LocaleToggle />
				</div>
			</nav>
		);
	}
}

NavigationBar.propTypes = {
	activeBookName: PropTypes.string,
	toggleTextSelection: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
	toggleMenuBar: PropTypes.func,
	activeChapter: PropTypes.number,
};

export default NavigationBar;
