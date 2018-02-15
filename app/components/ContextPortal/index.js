/**
*
* ContextPortal
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SvgWrapper from 'components/SvgWrapper';

const StyledDiv = styled.div`
	width:160px;
	height:80px;
	position:absolute;
	left:${(props) => props.x}px;
	top:${(props) => props.y}px;
	background-color:#fff;
	border:1px solid grey;
	box-shadow: 1px 2px 1px 1px grey;
`;

const Row = styled.div`
	display:flex;
	height:40px;
	width:100%;
`;

const Item = styled.div`
	display:flex;
	align-items:center;
	justify-content:center;
	background-color:rgb(204,178,165);
	fill:#fff;
	width:40px;
	height:40px;
	cursor:pointer;
	&:hover {
		opacity: 0.6;
		fill:rgba(0,0,0,0.65);
	}
`;
// TODO: Clean up this component
// Remove use of styled components
// change to pure component and handle outside clicks instead of click handler
// on each item
function ContextPortal({ shareHighlightToFacebook, addHighlight, addFacebookLike, setActiveNote, coordinates, parentNode, toggleNotesModal, notesActive, closeContextMenu, setActiveNotesView }) {
	const handleNoteClick = () => {
		if (!notesActive) {
			setActiveNotesView('edit');
			toggleNotesModal();
			closeContextMenu();
			setActiveNote();
		}
	};

	const handleBookmarkClick = () => {
		if (!notesActive) {
			setActiveNotesView('edit');
			toggleNotesModal();
			closeContextMenu();
		}
	};

	const component = (
		<StyledDiv x={coordinates.x} y={coordinates.y}>
			<Row>
				<Item onClick={handleNoteClick}><SvgWrapper height="25px" width="25px" svgid="note-list" /></Item>
				<Item onClick={addHighlight}><SvgWrapper height="25px" width="25px" svgid="highlights" /></Item>
				<Item onClick={handleBookmarkClick}><SvgWrapper height="25px" width="25px" svgid="bookmarks" /></Item>
				<Item onClick={addFacebookLike} className="facebook"><SvgWrapper height="35px" width="35px" svgid="fb-thumb" /></Item>
			</Row>
			<Row>
				<Item onClick={shareHighlightToFacebook} data-layout="button_count" data-href={window.location.href} className="facebook fb-share-button"><SvgWrapper height="25px" width="25px" svgid="facebook" /></Item>
				<Item onClick={closeContextMenu} className="google"><SvgWrapper height="25px" width="25px" svgid="google_plus" /></Item>
				<Item onClick={closeContextMenu} className="twitter"><SvgWrapper height="35px" width="35px" svgid="twitter" /></Item>
				<Item onClick={closeContextMenu}><SvgWrapper height="25px" width="25px" svgid="email" /></Item>
			</Row>
		</StyledDiv>
	);
	if (parentNode instanceof HTMLElement || parentNode instanceof Node) {
		return ReactDOM.createPortal(component, parentNode);
	}
	return null;
}

ContextPortal.propTypes = {
	parentNode: PropTypes.object,
	coordinates: PropTypes.object,
	notesActive: PropTypes.bool,
	toggleNotesModal: PropTypes.func,
	closeContextMenu: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	setActiveNote: PropTypes.func,
	shareHighlightToFacebook: PropTypes.func,
	addFacebookLike: PropTypes.func,
	addHighlight: PropTypes.func,
};

export default ContextPortal;
