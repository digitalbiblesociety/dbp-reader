/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';

class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
				<main className="chapter">
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
