/**
 *
 * NavigationBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import SvgWrapper from '../SvgWrapper';
const TextSelection = dynamic(import('../../containers/TextSelection'), {
	loading: () => null,
});
const ChapterSelection = dynamic(import('../../containers/ChapterSelection'), {
	loading: () => null,
});

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
			isChapterSelectionActive,
			isVersionSelectionActive,
			theme,
			userAgent,
			textDirection,
		} = this.props;
		// may need to wrap each of these in a container div to fix the hover issues
		return (
			<div id={'navigation-bar'} className={'nav-background'}>
				<div className="nav-container">
					<a
						className="logo"
						href={'http://www.bible.is'}
						title={'http://www.bible.is'}
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
					<div
						id={'version-dropdown-button'}
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
							title={activeTextName || `${activeTextId} Version`}
							className={'version-text'}
						>
							{activeTextName
								? `${
										activeTextId.slice(0, 3) === 'ENG'
											? `${activeTextId.slice(3)} - `
											: ''
								  }${activeTextName}`
								: `${activeTextId} Version`}
						</h1>
						{isVersionSelectionActive && (
							<TextSelection active={isVersionSelectionActive} />
						)}
					</div>
					<div
						id={'chapter-dropdown-button'}
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
							className={
								textDirection === 'rtl'
									? 'book-chapter-text rtl'
									: 'book-chapter-text'
							}
						>
							{activeBookName
								? `${activeBookName} ${activeChapter}`
								: 'No Book Selected'}
						</h1>
						{isChapterSelectionActive && (
							<ChapterSelection active={isChapterSelectionActive} />
						)}
					</div>
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
	textDirection: PropTypes.string,
	toggleChapterSelection: PropTypes.func,
	toggleVersionSelection: PropTypes.func,
	activeChapter: PropTypes.number,
	isChapterSelectionActive: PropTypes.bool,
	isVersionSelectionActive: PropTypes.bool,
};

export default NavigationBar;
