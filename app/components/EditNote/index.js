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
	state = {
		textarea: this.props.note.text || 'CLICK TO ADD TEXT',
		titleText: this.props.note.title || 'CLICK TO ADD TITLE',
	}

	componentWillUnmount() {
		// Dispatch api call to save the user note and hope nothing hiccups
	}

	getCurrentDate = () => {
		const date = new Date();
		const day = date.getDate();
		const year = date.getFullYear().toFixed().slice(2);
		const month = (date.getMonth() + 1).toFixed();

		return `${month.length === 1 ? `0${month}` : month}.${day}.${year}`;
	}

	handleTextareaChange = (e) => {
		this.setState({ textarea: e.target.value });
	}

	handleNoteTitleChange = (e) => {
		this.setState({ titleText: e.target.value });
	}

	handleSave = () => {
		this.props.addNote({
			note: this.state.textarea,
			reference_id: this.props.note.get('referenceId'),
			title: this.state.titleText,
			versionId: this.props.activeTextId,
		});
	}

	get verseReference() {
		const bookChapterVerse = this.props.note.get('referenceId').split('_');
		return `${bookChapterVerse[0]} ${bookChapterVerse[1]}:${bookChapterVerse[2]}`;
	}

	render() {
		const {
			toggleVerseText,
			toggleAddVerseMenu,
			note,
			isAddVerseExpanded,
			isVerseTextVisible,
			getChapterText,
			setActiveChapter,
			setActiveBookName,
			setSelectedBookName,
			books,
			activeTextId,
			activeChapter,
			activeBookName,
			selectedBookName,
			notePassage,
		} = this.props;

		return (
			<section className="edit-notes">
				<div className="date-title">
					<span className="date">{note.get('date') || this.getCurrentDate()}</span>
					<input onChange={this.handleNoteTitleChange} className="title" value={this.state.titleText} />
				</div>
				<div className={`verse-dropdown${isVerseTextVisible ? ' open' : ''}`}>
					<SvgWrapper onClick={toggleVerseText} className="svg" height="20px" width="20px" svgid="go-right" />
					<span className="text">{this.verseReference}</span>
					<span className="version-dropdown">{activeTextId}</span>
				</div>
				{
					isVerseTextVisible ? (
						<div className="verse-text">
							{notePassage}
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
				<textarea onChange={this.handleTextareaChange} value={this.state.textarea} className="note-text" />
				<span className="save-button" role="button" tabIndex={0} onClick={this.handleSave}>SAVE</span>
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
	getChapterText: PropTypes.func,
	setActiveChapter: PropTypes.func,
	setActiveBookName: PropTypes.func,
	setSelectedBookName: PropTypes.func,
	books: PropTypes.array,
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
	activeBookName: PropTypes.string,
	selectedBookName: PropTypes.string,
	addNote: PropTypes.func,
	notePassage: PropTypes.string,
};

export default EditNote;
