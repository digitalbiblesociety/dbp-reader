/**
*
* ContextPortal
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
	FacebookShareButton,
	GooglePlusShareButton,
	TwitterShareButton,
	EmailShareButton,
} from 'react-share';
import SvgWrapper from 'components/SvgWrapper';
import CloseMenuFunctions from 'utils/closeMenuFunctions';

const StyledDiv = styled.div`
	width:160px;
	height:80px;
	position:absolute;
	left:${(props) => props.x}px;
	top:${(props) => props.y}px;
	background-color:#fff;
`;

const Row = styled.div`
	display:flex;
	height:40px;
	width:100%;
`;

const Item = styled.span`
	display:flex;
	align-items:center;
	justify-content:center;
	background-color:rgb(204,178,165);
	background-color:var(--context-menu-background-color);
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
class ContextPortal extends React.PureComponent {
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.componentRef, this.props.closeContextMenu);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setComponentRef = (el) => {
		this.componentRef = el;
	}

	handleNoteClick = () => {
		if (!this.props.notesActive) {
			this.props.setActiveNotesView('edit');
			this.props.toggleNotesModal();
			this.props.closeContextMenu();
			this.props.setActiveNote();
		}
	};

	handleBookmarkClick = () => {
		if (!this.props.notesActive) {
			this.props.setActiveNotesView('edit');
			this.props.toggleNotesModal();
			this.props.closeContextMenu();
		}
	};

	render() {
		const {
			// shareHighlightToFacebook,
			addHighlight,
			addFacebookLike,
			// setActiveNote,
			coordinates,
			parentNode,
			// toggleNotesModal,
			// notesActive,
			closeContextMenu,
			// setActiveNotesView,
		} = this.props;

		const component = (
			<StyledDiv innerRef={this.setComponentRef} className={'shadow'} x={coordinates.x} y={coordinates.y}>
				<Row>
					<Item title={'Add a note'} onClick={this.handleNoteClick}><SvgWrapper height="25px" width="25px" svgid="note-list" /></Item>
					<Item title={'Add a highlight'} onClick={addHighlight}><SvgWrapper height="25px" width="25px" svgid="highlights" /></Item>
					<Item title={'Add a bookmark'} onClick={this.handleBookmarkClick}><SvgWrapper height="25px" width="25px" svgid="bookmarks" /></Item>
					<Item title={'Copy selected text'} onClick={addFacebookLike} className="facebook"><SvgWrapper height="35px" width="35px" svgid="fb-thumb" /></Item>
				</Row>
				<Row>
					<Item title={'Share to Facebook'} onClick={closeContextMenu} className="facebook">
						<FacebookShareButton className="facebook fb-share-button" quote={`"${window.getSelection().toString()}"`} url={window.location.href}>
							<SvgWrapper height="25px" width="25px" svgid="facebook" />
						</FacebookShareButton>
					</Item>
					<Item title={'Share to Google'} onClick={closeContextMenu} className="google">
						<GooglePlusShareButton url={window.location.href}>
							<SvgWrapper height="25px" width="25px" svgid="google_plus" />
						</GooglePlusShareButton>
					</Item>
					<Item title={'Share to Twitter'} onClick={closeContextMenu} className="twitter">
						<TwitterShareButton title={document.title} hashtags={[`${document.title.split('|')[0].replace(/\s/g, '')}`]} url={window.location.href}>
							<SvgWrapper height="25px" width="25px" svgid="twitter" />
						</TwitterShareButton>
					</Item>
					<Item title={'Share with email'} onClick={closeContextMenu}>
						<EmailShareButton subject={document.title} body={`"${window.getSelection().toString()}"\n\nTo listen to the audio click here: ${window.location.href}`} url={window.location.href}>
							<SvgWrapper height="25px" width="25px" svgid="email" />
						</EmailShareButton>
					</Item>
				</Row>
			</StyledDiv>
		);

		if (parentNode instanceof HTMLElement || parentNode instanceof Node) {
			return ReactDOM.createPortal(component, parentNode);
		}

		return null;
	}
	// Component if I go back to not using react-share
	// const component = (
	// 	<StyledDiv className={'shadow'} x={coordinates.x} y={coordinates.y}>
	// 		<Row>
	// 			<Item onClick={handleNoteClick}><SvgWrapper height="25px" width="25px" svgid="note-list" /></Item>
	// 			<Item onClick={addHighlight}><SvgWrapper height="25px" width="25px" svgid="highlights" /></Item>
	// 			<Item onClick={handleBookmarkClick}><SvgWrapper height="25px" width="25px" svgid="bookmarks" /></Item>
	// 			<Item onClick={addFacebookLike} className="facebook"><SvgWrapper height="35px" width="35px" svgid="fb-thumb" /></Item>
	// 		</Row>
	// 		<Row>
	// 			<Item onClick={shareHighlightToFacebook} data-layout="button_count" data-href={window.location.href} className="facebook fb-share-button"><SvgWrapper height="25px" width="25px" svgid="facebook" /></Item>
	// 			<Item onClick={closeContextMenu} className="google"><SvgWrapper height="25px" width="25px" svgid="google_plus" /></Item>
	// 			<Item onClick={closeContextMenu} className="twitter"><SvgWrapper height="35px" width="35px" svgid="twitter" /></Item>
	// 			<Item onClick={closeContextMenu}><SvgWrapper height="25px" width="25px" svgid="email" /></Item>
	// 		</Row>
	// 	</StyledDiv>
	// );
}

ContextPortal.propTypes = {
	parentNode: PropTypes.object,
	coordinates: PropTypes.object,
	notesActive: PropTypes.bool,
	toggleNotesModal: PropTypes.func,
	closeContextMenu: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	setActiveNote: PropTypes.func,
	// shareHighlightToFacebook: PropTypes.func,
	addFacebookLike: PropTypes.func,
	addHighlight: PropTypes.func,
};

export default ContextPortal;
