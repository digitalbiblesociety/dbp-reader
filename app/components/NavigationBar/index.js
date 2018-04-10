/**
*
* NavigationBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import Logo from 'components/Logo';
// import LocaleToggle from 'containers/LocaleToggle';
import ChapterSelection from 'containers/ChapterSelection';
import TextSelection from 'containers/TextSelection';
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
			isChapterSelectionActive,
			isVersionSelectionActive,
			theme,
    } = this.props;
		// may need to wrap each of these in a container div to fix the hover issues
		return (
			<div className={'nav-background'}>
				<div className="nav-container">
					<a className="logo" href={'http://www.bible.is'} title={'http://www.bible.is'}>
						{
							theme === 'paper' ? <SvgWrapper className="svg" svgid={'bible.is_logo_light'} /> : null
						}
						{
							theme !== 'paper' ? <SvgWrapper className="svg" svgid={'bible.is_logo'} /> : null
						}
					</a>
					<span role="button" tabIndex={0} onClick={toggleVersionSelection} className="version">
						<SvgWrapper className="svg icon" fill="#fff" svgid="arrow_down" opacity=".5" />
						<span title={activeTextName} className={'version-text'}>{`${activeTextId.slice(0, 3) === 'ENG' && activeTextId.slice(3)} - ${activeTextName}`}</span>
						{
							isVersionSelectionActive ? <TextSelection /> : null
						}
					</span>
					<span role="button" tabIndex={0} onClick={toggleChapterSelection} className="book-chapter">
						<SvgWrapper className="svg icon" fill="#fff" svgid="arrow_down" opacity=".5" />
						<span title={activeBookName ? `${activeBookName} ${activeChapter}` : 'No Book Selected'} className={'book-chapter-text'}>{ activeBookName ? `${activeBookName} ${activeChapter}` : 'No Book Selected' }</span>
						{
							isChapterSelectionActive ? <ChapterSelection /> : null
						}
					</span>
				</div>
			</div>
		);
	}
}

NavigationBar.propTypes = {
	theme: PropTypes.string,
	activeTextId: PropTypes.string,
	activeBookName: PropTypes.string,
	activeTextName: PropTypes.string,
	toggleChapterSelection: PropTypes.func,
	toggleVersionSelection: PropTypes.func,
	activeChapter: PropTypes.number,
	isChapterSelectionActive: PropTypes.bool,
	isVersionSelectionActive: PropTypes.bool,
};

export default NavigationBar;
