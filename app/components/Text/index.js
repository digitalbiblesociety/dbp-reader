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
		} = this.props;

		return (
			<div className="text-container">
				<SvgWrapper className="prev-arrow-svg" svgid="prev-arrow" />
				<main className="chapter">
					{
						text.map((verse) => (
							<span key={verse.verse_start}>&nbsp;<sup>{verse.verse_start}</sup>&nbsp;{verse.verse_text}</span>
						))
					}
				</main>
				<SvgWrapper className="next-arrow-svg" svgid="next-arrow" />
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
};

export default Text;
