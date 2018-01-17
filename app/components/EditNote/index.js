/**
*
* EditNote
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import BooksTable from 'components/BooksTable';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

class EditNote extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			toggleVerseText,
			toggleAddVerseMenu,
			note,
			isAddVerseExpanded,
			isVerseTextVisible,
			selectedText,
			getChapterText,
			setActiveChapter,
			setActiveBookName,
			setSelectedBookName,
			books,
			activeTextId,
			activeChapter,
			activeBookName,
			selectedBookName,
		} = this.props;

		return (
			<section className="edit-notes">
				<div className="date-title">
					<span className="date">01.01.18</span>
					<span className="title">{note.title || 'ADD TITLE'}</span>
				</div>
				<div className={`verse-dropdown${isVerseTextVisible ? ' open' : ''}`}>
					<SvgWrapper onClick={toggleVerseText} className="svg" height="20px" width="20px" svgid="go-right" />
					<span className="text">{note.verseTitle || 'Verse Title Goes Here'}</span>
					<span className="version-dropdown">ENGESV</span>
				</div>
				{
					isVerseTextVisible ? (
						<div className="verse-text">
							{note.verseText || selectedText}
						</div>
					) : null
				}
				{
					isAddVerseExpanded ? (
						<div className="add-verse-expanded">
							<div className="plus-expanded">
								<SvgWrapper onClick={toggleAddVerseMenu} width="20px" height="20px" svgid="plus" />
							</div>
							<div className="book-table">
								<BooksTable
									getChapterText={getChapterText}
									setActiveChapter={setActiveChapter}
									setActiveBookName={setActiveBookName}
									setSelectedBookName={setSelectedBookName}
									toggleChapterSelection={toggleAddVerseMenu}
									books={books}
									activeTextId={activeTextId}
									activeChapter={activeChapter}
									activeBookName={activeBookName}
									selectedBookName={selectedBookName}
								/>
							</div>
						</div>
					) : (
						<div className="add-verse">
							<SvgWrapper onClick={toggleAddVerseMenu} className="plus" width="20px" height="20px" svgid="plus" />
							<span className="text">ADD VERSE</span>
						</div>
					)
				}
				<div className="note-text">{note.text || 'CLICK TO ENTER TEXT'}</div>
			</section>
		);
	}
}

EditNote.propTypes = {
	toggleVerseText: PropTypes.func.isRequired,
	toggleAddVerseMenu: PropTypes.func.isRequired,
	note: PropTypes.object.isRequired,
	isAddVerseExpanded: PropTypes.bool.isRequired,
	isVerseTextVisible: PropTypes.bool.isRequired,
	selectedText: PropTypes.string,
	getChapterText: PropTypes.func,
	setActiveChapter: PropTypes.func,
	setActiveBookName: PropTypes.func,
	setSelectedBookName: PropTypes.func,
	books: PropTypes.array,
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
	activeBookName: PropTypes.string,
	selectedBookName: PropTypes.string,
};

export default EditNote;
