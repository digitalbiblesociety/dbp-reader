/**
*
* ContextPortal
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
	FacebookShareButton,
	GooglePlusShareButton,
	TwitterShareButton,
	EmailShareButton,
	FacebookShareCount,
} from 'react-share';
import SvgWrapper from 'components/SvgWrapper';
import HighlightColors from 'components/HighlightColors';
import CloseMenuFunctions from 'utils/closeMenuFunctions';

// const StyledDiv = styled.div`
// 	width:250px;
// 	height:162px;
// 	position:absolute;
// 	left:${(props) => props.x}px;
// 	top:${(props) => props.y}px;
// 	background-color:#fff;
// 	border: 2px solid green;
// 	border-radius: 6px;
// `;
//
// const Row = styled.div`
// 	display:flex;
// 	height:40px;
// 	width:100%;
// `;
//
// const Item = styled.span`
// 	display:flex;
// 	align-items:center;
// 	justify-content:center;
// 	background-color:rgb(204,178,165);
// 	background-color:var(--context-menu-background-color);
// 	width:62px;
// 	height:54px;
// 	cursor:pointer;
// 	&:hover {
// 		opacity: 0.6;
// 		fill:rgba(0,0,0,0.65);
// 	}
// `;
// TODO: Clean up this component
// Remove use of styled components
// change to pure component and handle outside clicks instead of click handler
// on each item
class ContextPortal extends React.PureComponent {
	state = {
		highlightOpen: false,
	}

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

	handleHighlightClick = () => {
		// toggle the colors sub menu
		this.props.addHighlight();
	}

	handleCopy = (e) => {
		// console.log('before setting clipboard data');
		e.clipboardData.setData('text/plain', window.location.href);
		// console.log('clipboard data', e.clipboardData);
		e.preventDefault();
	}

	handleMouseEnter = (e) => {
		// console.log('mouse entered', e.target.id);
		if (e.target.id === 'copy-button') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			// textBox.focus();
			textBox.select();
			// console.log('input when mouse entered copy', textBox);
		} else if (e.target.id === 'link-to-copy') {
			// handle the link being the target
			// e.target.focus();
			e.target.select();
			// console.log('input when mouse entered input', e.target);
		} else if (e.target.id === 'copy-container') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			// textBox.focus();
			textBox.select();
			// console.log('input when mouse entered copy', textBox);
		}
	}

	handleMouseLeave = (e) => {
		// console.log('mouse left', e.target.id);
		if (e.target.id === 'copy-button') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			textBox.setSelectionRange(0, 0);
			// console.log(textBox);
		} else if (e.target.id === 'link-to-copy') {
			// handle the link being the target
			e.target.setSelectionRange(0, 0);
			// console.log(e.target);
		} else if (e.target.id === 'copy-container') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			textBox.setSelectionRange(0, 0);
			// console.log('input when mouse entered copy', textBox);
		}
	}

	copyLinkToClipboard = () => {
		// console.log('clicked the copy button');
		document.addEventListener('copy', this.handleCopy);
		document.execCommand('copy');
		document.removeEventListener('copy', this.handleCopy);
	}

	toggleHighlightColors = () => this.setState({ highlightOpen: !this.state.highlightOpen })

	render() {
		const {
			// shareHighlightToFacebook,
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
			<div style={{ left: `${coordinates.x}px`, top: `${coordinates.y}px` }} ref={this.setComponentRef} className={'context-menu shadow'}>
				<div className={'menu-row'}>
					<span role={'button'} tabIndex={0} className={'menu-item'} title={'Add a note'} onClick={this.handleNoteClick}>
						<SvgWrapper className={'icon'} svgid="notes" />
						<span className={'item-text'}>Notes</span>
					</span>
					<span role={'button'} tabIndex={0} className={this.state.highlightOpen ? 'menu-item active' : 'menu-item'} title={'Add a highlight'} onClick={this.toggleHighlightColors}>
						<SvgWrapper className={'icon'} svgid="highlight" />
						<span className={'item-text'}>Highlight</span>
						<div className={this.state.highlightOpen ? 'highlight-colors active' : 'highlight-colors'}>
							<HighlightColors />
						</div>
					</span>
					<span role={'button'} tabIndex={0} className={'menu-item'} title={'Add a bookmark'} onClick={this.handleBookmarkClick}>
						<SvgWrapper className={'icon'} svgid="bookmark" />
						<span className={'item-text'}>Bookmark</span>
					</span>
					<span role={'button'} tabIndex={0} className={'menu-item'} title={'Share with email'} onClick={closeContextMenu}>
						<EmailShareButton subject={document.title} body={`"${window.getSelection().toString()}"\n\nTo listen to the audio click here: ${window.location.href}`} url={window.location.href}>
							<SvgWrapper className={'icon'} svgid="e-mail" />
						</EmailShareButton>
						<span className={'item-text'}>E-mail</span>
					</span>
				</div>
				<div className={'menu-row'}>
					<span role={'button'} tabIndex={0} className={'menu-item social facebook'} title={'Share to Facebook'} onClick={closeContextMenu}>
						<FacebookShareButton className="facebook fb-share-button" quote={`"${window.getSelection().toString()}"`} url={window.location.href}>
							<SvgWrapper className={'icon'} svgid="facebook" />
						</FacebookShareButton>
					</span>
					<span role={'button'} tabIndex={0} className={'menu-item social google'} title={'Share to Google'} onClick={closeContextMenu}>
						<GooglePlusShareButton url={window.location.href}>
							<SvgWrapper className={'icon'} svgid="google" />
						</GooglePlusShareButton>
					</span>
					<span role={'button'} tabIndex={0} className={'menu-item social twitter'} title={'Share to Twitter'} onClick={closeContextMenu}>
						<TwitterShareButton title={document.title} hashtags={[`${document.title.split('|')[0].replace(/\s/g, '')}`]} url={window.location.href}>
							<SvgWrapper className={'icon'} svgid="twitter" />
						</TwitterShareButton>
					</span>
					<div role={'button'} tabIndex={0} className={'menu-item social like-button facebook'} title={'Like on Facebook'} onClick={addFacebookLike}>
						<span className={'share-count'}><FacebookShareCount url={window.location.href} /></span>
						<span className={'like-thumb'}><SvgWrapper height={'26px'} width={'26px'} svgid="like_one-color" /> Like</span>
					</div>
				</div>
				<div id={'copy-container'} role={'button'} tabIndex={0} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.copyLinkToClipboard} className={'menu-row'} title={'Copy selected text'}>
					<input readOnly id={'link-to-copy'} className={'copy-link'} value={window.location.href} />
					<span id={'copy-button'} className={'copy-button'}>Copy</span>
				</div>
			</div>
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
	// 			<Item onClick={handleNoteClick}><SvgWrapper className='icon height="25px" width="25px" svgid="note-list" /></Item>
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
