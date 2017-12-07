/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';

class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			text,
		} = this.props;

		return (
			<main className="chapter">
				{
					text.map((verse) => (
						<span key={verse.verse_start}>&nbsp;<sup>{verse.verse_start}</sup>&nbsp;{verse.verse_text}</span>
					))
				}
			</main>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
};

export default Text;
