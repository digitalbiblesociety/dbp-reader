/**
*
* MyBookmarks
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class MyBookmarks extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			bookmarks,
			getNoteReference,
			getFormattedNoteDate,
		} = this.props;
		return bookmarks.map((listItem) => (
			<Link to={`/${listItem.bible_id}/${listItem.book_id}/${listItem.chapter}/${listItem.verse_start}`} role="button" tabIndex={0} key={listItem.id} className="list-item">
				<div className="date">{getFormattedNoteDate(listItem.created_at)}</div>
				<div className="title-text">
					<h4 className="title">{getNoteReference(listItem)}</h4>
				</div>
			</Link>
		));
	}
}

MyBookmarks.propTypes = {
	bookmarks: PropTypes.array,
	getFormattedNoteDate: PropTypes.func,
	getNoteReference: PropTypes.func,
};

export default MyBookmarks;
