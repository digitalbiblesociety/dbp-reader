/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	handleRightClick = () => {
		// Can potentially use the below menu to activate the menu for note taking
		// if (e.button === 2) {}
		// Below code gets the highlighted text
		// window.getSelection().toString();
	}
	// Allows us to use the right mouse button to toggle menu's or perform different actions
	handleContext = (e) => e.preventDefault()

	render() {
		const {
			text,
			nextChapter,
			prevChapter,
			activeBookName,
			activeChapter,
		} = this.props;

		return (
			<div className="text-container">
				{
					activeBookName === 'Genesis' && activeChapter === 1 ? null : (
						<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
					)
				}
				<main onMouseUp={this.handleRightClick} className="chapter" onContextMenu={this.handleContext}>
					{
						text.map((verse) => (
							<span key={verse.verse_start}>&nbsp;<sup>{verse.verse_start}</sup>&nbsp;{verse.verse_text}</span>
						))
					}
				</main>
				{
					activeBookName === 'Revelation' && activeChapter === 22 ? null : (
						<SvgWrapper onClick={nextChapter} className="next-arrow-svg" svgid="next-arrow" />
					)
				}
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
	nextChapter: PropTypes.func,
	prevChapter: PropTypes.func,
	activeBookName: PropTypes.string,
	activeChapter: PropTypes.number,
};

export default Text;
