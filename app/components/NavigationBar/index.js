/**
 *
 * NavigationBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import '../../styles/components/navbar.scss';
// import Logo from 'components/Logo';
// import LocaleToggle from 'containers/LocaleToggle';
import ChapterSelection from '../../containers/ChapterSelection';
import TextSelection from '../../containers/TextSelection';
import SvgWrapper from '../SvgWrapper';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class NavigationBar extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			activeTextId,
			activeBookName,
			activeTextName,
			toggleChapterSelection,
			toggleVersionSelection,
			activeChapter,
			isScrollingDown,
			isChapterSelectionActive,
			isVersionSelectionActive,
			theme,
			userAgent,
		} = this.props;
		// may need to wrap each of these in a container div to fix the hover issues
		return (
			<div
				id={'navigation-bar'}
				className={isScrollingDown ? 'nav-background closed' : 'nav-background'}
			>
				<div className="nav-container">
					<a
						className="logo"
						href={'http://www.bible.is'}
						title={'http://www.bible.is'}
						target={'_blank'}
						rel={'noopener'}
					>
						{theme === 'paper' && userAgent !== 'ms' ? (
							<SvgWrapper className="svg" svgid={'bible.is_logo_light'} />
						) : null}
						{theme !== 'paper' || userAgent === 'ms' ? (
							<SvgWrapper
								fill={userAgent === 'ms' ? '#fff' : ''}
								className="svg"
								svgid={'bible.is_logo'}
							/>
						) : null}
					</a>
					<span
						role="button"
						tabIndex={0}
						onClick={toggleVersionSelection}
						className="version"
					>
						<SvgWrapper
							className="svg icon"
							fill="#fff"
							svgid="arrow_down"
							opacity=".5"
						/>
						<h1
							title={activeTextName || 'No Version Selected'}
							className={'version-text'}
						>
							{activeTextName
								? `${
										activeTextId.slice(0, 3) === 'ENG'
											? `${activeTextId.slice(3)} - `
											: ''
								  }${activeTextName}`
								: 'No Version Selected'}
						</h1>
						<TextSelection active={isVersionSelectionActive} />
						{/* {isVersionSelectionActive ? <TextSelection /> : null} */}
					</span>
					<span
						role="button"
						tabIndex={0}
						onClick={toggleChapterSelection}
						className="book-chapter"
					>
						<SvgWrapper
							className="svg icon"
							fill="#fff"
							svgid="arrow_down"
							opacity=".5"
						/>
						<h1
							title={
								activeBookName
									? `${activeBookName} ${activeChapter}`
									: 'No Book Selected'
							}
							className={'book-chapter-text'}
						>
							{activeBookName
								? `${activeBookName} ${activeChapter}`
								: 'No Book Selected'}
						</h1>
						<ChapterSelection active={isChapterSelectionActive} />
						{/* {isChapterSelectionActive ? <ChapterSelection /> : null} */}
					</span>
				</div>
			</div>
		);
	}
}

NavigationBar.propTypes = {
	theme: PropTypes.string,
	userAgent: PropTypes.string,
	activeTextId: PropTypes.string,
	activeBookName: PropTypes.string,
	activeTextName: PropTypes.string,
	toggleChapterSelection: PropTypes.func,
	toggleVersionSelection: PropTypes.func,
	activeChapter: PropTypes.number,
	isScrollingDown: PropTypes.bool,
	isChapterSelectionActive: PropTypes.bool,
	isVersionSelectionActive: PropTypes.bool,
};

export default NavigationBar;
