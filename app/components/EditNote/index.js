/**
*
* EditNote
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import BookTable from 'components/BooksTable';
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
		} = this.props;
		return (
			<section className="edit-notes">
				<div className="date-title">
					<span className="date">01.01.18</span>
					<span className="title">{note.title || 'ADD TITLE'}</span>
				</div>
				<div className="verse-dropdown">
					<SvgWrapper onClick={toggleVerseText} className="svg" height="20px" width="20px" svgid="go-right" />
					<span className="text">{note.verseTitle || 'Verse Title Goes Here'}</span>
					<span className="version-dropdown">ENGESV</span>
				</div>
				{
					isVerseTextVisible ? (
						<div className="verse-text">
							{note.verseText || 'Verse Text Goes Here'}
						</div>
					) : null
				}
				{
					isAddVerseExpanded ? (
						<div className="add-verse-expanded">
							<div className="plus-expanded">
								<SvgWrapper className="plus-expanded" width="20px" height="20px" svgid="plus" />
							</div>
							<div>
								<span>Need to reuse books table here but </span>
								<span>there is an issue with obtaining the state</span>
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
};

export default EditNote;
