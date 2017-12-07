/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			text,
		} = this.props;

		return (
			<div className="row small-10 centered main">
				{
					text.map((verse) => (
						<div key={verse.verse_start} className="text-container">
							<h5 className="verse-number">{verse.verse_start}</h5>
							<h3 className="verse-text">{verse.verse_text}</h3>
						</div>
					))
				}
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
};

export default Text;
