/**
*
* NavigationBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/Logo';
import LocaleToggle from 'containers/LocaleToggle';
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
    } = this.props;

		return (
			<nav>
				<div className="small-2 columns">
					<Logo />
				</div>
				<div className="small-4 columns">
					<div role="button" tabIndex={0} onClick={toggleTextSelection}>{activeBookName}</div>
				</div>
				<div role="button" tabIndex="0" className="small-2 columns" onClick={toggleSettingsModal}>
					Settings Icon
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
	activeBookName: PropTypes.string,
	toggleTextSelection: PropTypes.func,
	toggleSettingsModal: PropTypes.func,
};

export default NavigationBar;
