/**
*
* MyNotes
*
*/

import React from 'react';
// import styled from 'styled-components';

class MyNotes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div className="my-notes">
				<div className="searchbar">
					<div className="add-note">+</div>
					<input placeholder="SEARCH NOTES" />
				</div>
				<section className="note-list"></section>
				<div className="pagination">
					<span>1</span>
					<input type="dropdown" placeholder="10 PER PAGE" />
				</div>
			</div>
		);
	}
}

MyNotes.propTypes = {

};

export default MyNotes;
