/**
*
* FootnotePortal
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
// Need to make sure that the box doesn't extend off the screen
const StyledDiv = styled.div`
	display: block;
	position: absolute;
	z-index: 4;
	top: ${(props) => props.y}px;
	left: ${(props) => props.x}px;
	min-height: 50px;
	box-shadow: 0 0 10px rgba(0,0,0,0.5),
		inset 0 0 30px #eee;
	max-height: 150px;
	width: 300px;
	padding: 15px;
	background-color: #9a9a9a;
`;
const StyledX = styled.span`
	width: 25px;
	height: 25px;
	cursor: pointer;
	&:hover {
		opacity: 0.65;
	};
	font-size: 1.3em;	
	float: right;
	text-align: center;
	line-height: 1.3em;
`;
const P = styled.p`
	padding: 5px;
	margin-right: 5px;
	margin-top: 5px;
`;
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function FootnotePortal({ parentNode, message, coords, closeFootnote }) {
	const component = (
		<StyledDiv x={coords.x} y={coords.y}>
			<StyledX onClick={closeFootnote}>X</StyledX>
			<P>{message}</P>
		</StyledDiv>
	);
	return ReactDOM.createPortal(component, parentNode);
}

FootnotePortal.propTypes = {

};

export default FootnotePortal;
