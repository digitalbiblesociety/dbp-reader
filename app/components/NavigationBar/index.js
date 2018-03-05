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
			activeTextName,
      toggleChapterSelection,
			toggleVersionSelection,
			toggleSearchModal,
			// toggleMenuBar,
			toggleProfile,
			activeChapter,
    } = this.props;

		return (
			<div className="nav-container">
				<div className="small-2 left-buttons">
					<a className="small-hide medium-6 logo button" href={'http://www.bible.is'}><Logo /></a>
				</div>
				<div className="small-8 chapter-selector">
					<span role="button" tabIndex={0} onClick={toggleChapterSelection} className="text">{ activeBookName ? `${activeBookName} ${activeChapter}` : 'No Book Selected' }<SvgWrapper className="svg" height="15px" width="15px" fill="#fff" svgid="go-down" opacity=".5" /></span>
					<span role="button" tabIndex={0} onClick={toggleVersionSelection} className="text version"><span title={activeTextName} className={'version-text'}>{activeTextName}</span><SvgWrapper className="svg" height="15px" width="15px" fill="#fff" svgid="go-down" opacity=".5" /></span>
				</div>
				<div className="small-2 right-buttons">
					<span className="small-6 button" role="button" tabIndex={0} onClick={toggleSearchModal}><SvgWrapper height="30px" width="30px" fill="#fff" svgid="search" /></span>
					<span className="small-hide medium-6 button" role="button" tabIndex={0} onClick={toggleProfile}><SvgWrapper height="30px" width="30px" fill="#fff" svgid="profile_circle" /></span>
				</div>
			</div>
		);
	}
}

NavigationBar.propTypes = {
	activeBookName: PropTypes.string,
	activeTextName: PropTypes.string,
	toggleChapterSelection: PropTypes.func,
	toggleVersionSelection: PropTypes.func,
	toggleSearchModal: PropTypes.func,
	// toggleMenuBar: PropTypes.func,
	toggleProfile: PropTypes.func,
	activeChapter: PropTypes.number,
};

export default NavigationBar;
