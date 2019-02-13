/**
 *
 * MyBookmarks
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import SvgWrapper from '../SvgWrapper';

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
			<div key={listItem.id} id={listItem.id} className={'highlight-item'}>
				<Link
					as={`/bible/${listItem.bible_id}/${listItem.book_id}/${
						listItem.chapter
					}`}
					href={`/bible/${listItem.bible_id}/${listItem.book_id}/${
						listItem.chapter
					}`}
				>
					<a onClick={toggleNotesModal} className="list-item">
						<div className="title-text">
							<h4 className="title">
								<span className="date">
									{getFormattedNoteDate(listItem.created_at)}
								</span>{' '}
								| {getNoteReference(listItem, true)}
							</h4>
							<p className="text">{listItem.bible_id}</p>
						</div>
					</a>
				</Link>
				<div
					key={`${listItem.id}-delete`}
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
