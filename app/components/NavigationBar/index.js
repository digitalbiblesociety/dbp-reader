/**
*
* NavigationBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import Logo from 'components/Logo';
// import LocaleToggle from 'containers/LocaleToggle';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class NavigationBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			activeTextId,
			activeBookName,
			activeTextName,
      toggleChapterSelection,
			toggleVersionSelection,
			activeChapter,
    } = this.props;

		return (
			<div className="nav-container">
				<a className="logo" href={'http://www.bible.is'} title={'http://www.bible.is'}>
					<SvgWrapper fill={'#fff'} className="svg" svgid={'bible.is_logo'} />
				</a>
				<span role="button" tabIndex={0} onClick={toggleVersionSelection} className="version" title={activeTextName}>
					<SvgWrapper className="svg icon" fill="#fff" svgid="arrow_down" opacity=".5" />
					<span className={'version-text'}>{`${activeTextId.slice(0, 3) === 'ENG' ? activeTextId.slice(3) : activeTextId} - ${activeTextName}`}</span>
				</span>
				<span role="button" tabIndex={0} onClick={toggleChapterSelection} className="book-chapter" title={activeBookName ? `${activeBookName} ${activeChapter}` : 'No Book Selected'}>
					<SvgWrapper className="svg icon" fill="#fff" svgid="arrow_down" opacity=".5" />
					<span className={'book-chapter-text'}>{ activeBookName ? `${activeBookName} ${activeChapter}` : 'No Book Selected' }</span>
				</span>
			</div>
		);
	}
}

NavigationBar.propTypes = {
	activeTextId: PropTypes.string,
	activeBookName: PropTypes.string,
	activeTextName: PropTypes.string,
	toggleChapterSelection: PropTypes.func,
	toggleVersionSelection: PropTypes.func,
	activeChapter: PropTypes.number,
};

export default NavigationBar;
