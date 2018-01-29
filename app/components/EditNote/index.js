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
		textarea: this.props.note.get('notes') || '',
		titleText: this.props.note.get('title') || '',
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
	//
	handleSave = () => {
		this.props.addNote({
			notes: this.state.textarea,
			reference_id: this.props.note.get('referenceId'),
			title: this.state.titleText,
			bible_id: this.props.activeTextId,
		});
	}

	get verseReference() {
		if (this.props.note.get('referenceId')) {
			const bookChapterVerse = this.props.note.get('referenceId').split('_');
			return `${bookChapterVerse[0]} ${bookChapterVerse[1]}:${bookChapterVerse[2]}`;
		}
		return 'Please Add a Verse';
	}

	render() {
		const {
			toggleVerseText,
			toggleAddVerseMenu,
			note,
			isAddVerseExpanded,
			isVerseTextVisible,
			setActiveChapter,
			setActiveBookName,
			activeTextId,
			notePassage,
		} = this.props;

		return (
			<section className="edit-notes">
				<div className="date-title">
					<span className="date">{note.get('date') || this.getCurrentDate()}</span>
					<input onChange={this.handleNoteTitleChange} placeholder="CLICK TO ADD TITLE" className="title" value={this.state.titleText} />
				</div>
				<div className={`verse-dropdown${isVerseTextVisible ? ' open' : ''}`}>
					<SvgWrapper onClick={toggleVerseText} className="svg" height="20px" width="20px" svgid="go-right" />
					<span className="text">{this.verseReference}</span>
					<span className="version-dropdown">{activeTextId}</span>
				</div>
				{
					isVerseTextVisible ? (
						<div className="verse-text">
							&quot;&nbsp;{notePassage}&nbsp;&quot;
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
									setActiveChapter={setActiveChapter}
									setActiveBookName={setActiveBookName}
									closeBookTable={toggleAddVerseMenu}
								/>
							</div>
						</div>
					) : (
						<div className="add-verse">
							<SvgWrapper className="plus" width="20px" height="20px" svgid="plus" />
							<span className="text">ADD VERSE</span>
						</div>
					)
				}
				<textarea onChange={this.handleTextareaChange} placeholder="CLICK TO ADD NOTE" value={this.state.textarea} className="note-text" />
				<span className="save-button" role="button" tabIndex={0} onClick={this.handleSave}>SAVE</span>
			</section>
		);
	}
}
// TODO: Add toggleAddVerseMenu as click handler for 104 svg
EditNote.propTypes = {
	toggleVerseText: PropTypes.func.isRequired,
	toggleAddVerseMenu: PropTypes.func.isRequired,
	note: PropTypes.object.isRequired,
	isAddVerseExpanded: PropTypes.bool.isRequired,
	isVerseTextVisible: PropTypes.bool.isRequired,
	setActiveChapter: PropTypes.func,
	setActiveBookName: PropTypes.func,
	activeTextId: PropTypes.string,
	addNote: PropTypes.func,
	notePassage: PropTypes.string,
};

export default EditNote;
