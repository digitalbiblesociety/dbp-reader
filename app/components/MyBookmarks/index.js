/**
 *
 * MyBookmarks
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SvgWrapper from 'components/SvgWrapper';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class MyBookmarks extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			bookmarks,
			deleteNote,
			getNoteReference,
			toggleNotesModal,
			getFormattedNoteDate,
		} = this.props;
		return bookmarks.map((listItem) => (
			<div key={listItem.id} className={'highlight-item'}>
				<Link
					to={`/${listItem.bible_id}/${listItem.book_id}/${listItem.chapter}/${
						listItem.verse_start
					}`}
					onClick={toggleNotesModal}
					role="button"
					tabIndex={0}
					className="list-item"
				>
					<div className="title-text">
						<h4 className="title">
							<span className="date">
								{getFormattedNoteDate(listItem.created_at)}
							</span>{' '}
							| {getNoteReference(listItem)}
						</h4>
						<p className="text">{listItem.bible_id}</p>
					</div>
				</Link>
				<div
					onClick={() => deleteNote({ noteId: listItem.id, isBookmark: true })}
					className={'delete-highlight'}
					tabIndex={0}
					role={'button'}
				>
					<SvgWrapper className={'icon'} svgid={'delete'} />
					<span>Delete</span>
				</div>
			</div>
		));
	}
}

MyBookmarks.propTypes = {
	bookmarks: PropTypes.array,
	getFormattedNoteDate: PropTypes.func,
	getNoteReference: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	deleteNote: PropTypes.func,
};

export default MyBookmarks;
