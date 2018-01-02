/**
*
* EditNote
*
*/

import React from 'react';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

class EditNote extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<section className="edit-notes">
				<div className="date-title">
					<span className="date">01.01.18</span>
					<span className="title">ADD TITLE</span>
				</div>
				<div className="verse-dropdown">
					<SvgWrapper className="svg" height="20px" width="20px" svgid="go-right" />
					<span className="text">GENESIS 12:13</span>
					<span className="version-dropdown">ENGESV</span></div>
				<div className="add-verse">
					<SvgWrapper className="plus" width="20px" height="20px" svgid="plus" />
					<span className="text">ADD VERSE</span>
				</div>
				<div className="note-text">CLICK TO ENTER TEXT</div>
			</section>
		);
	}
}

EditNote.propTypes = {

};

export default EditNote;
