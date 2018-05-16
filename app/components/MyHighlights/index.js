/**
*
* MyHighlights
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';

class MyHighlights extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			highlights,
			getReference,
		} = this.props;

		return highlights.map((highlight) => (
			<Link to={`/${highlight.bible_id}/${highlight.book_id}/${highlight.chapter}/${highlight.verse_start}`} role="button" tabIndex={0} key={highlight.id} className="list-item">
				<div className="title-text">
					<h4 className="title">{getReference(highlight)}</h4>
				</div>
			</Link>
		));
	}
}

MyHighlights.propTypes = {
	highlights: PropTypes.array,
	getReference: PropTypes.func,
};

export default MyHighlights;
