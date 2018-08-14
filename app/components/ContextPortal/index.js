/**
 *
 * ContextPortal
 *
 */

import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
	FacebookShareButton,
	GooglePlusShareButton,
	TwitterShareButton,
	EmailShareButton,
	FacebookShareCount,
} from 'react-share';
import SvgWrapper from '../SvgWrapper';
import HighlightColors from '../HighlightColors';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import PopupMessage from '../PopupMessage';

// TODO: Clean up this component
// Remove use of styled components
// change to pure component and handle outside clicks instead of click handler
// on each item
class ContextPortal extends React.PureComponent {
	state = {
		highlightOpen: false,
		openPopup: false,
		popupCoords: { x: 0, y: 0 },
	};

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(
			this.componentRef,
			this.props.closeContextMenu,
		);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setComponentRef = (el) => {
		this.componentRef = el;
	};

	handleNoteClick = (e) => {
		if (!this.props.notesActive) {
			this.props.setActiveNotesView('edit');
			this.props.toggleNotesModal();
			this.props.closeContextMenu();
			this.props.setActiveNote({ coords: { x: e.clientX, y: e.clientY } });
		}
	};

	handleBookmarkClick = (e) => {
		if (!this.props.notesActive) {
			// Todo: Function chains like this should be promisified so they will return in the expected order
			this.props.setActiveNotesView('bookmarks');
			this.props.toggleNotesModal();
			this.props.setActiveNote({
				bookmark: true,
				coords: { x: e.clientX, y: e.clientY },
			});
			this.props.handleAddBookmark();
			this.props.closeContextMenu();
		} else {
			this.props.setActiveNotesView('bookmarks');
			this.props.setActiveNote({
				bookmark: true,
				coords: { x: e.clientX, y: e.clientY },
			});
			this.props.closeContextMenu();
		}
	};

	handleHighlightClick = ({ color, popupCoords }) => {
		// toggle the colors sub menu
		this.props.addHighlight({ color, popupCoords });
	};

	handleCopy = (e) => {
		// console.log('before setting clipboard data');
		e.clipboardData.setData('text/plain', window.location.href);
		// console.log('clipboard data', e.clipboardData);
		e.preventDefault();
	};

	handleMouseEnter = (e) => {
		this.clonedRange = window
			.getSelection()
			.getRangeAt(0)
			.cloneRange();
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
	};

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
		// console.log(this.clonedRange);
		// Doing this so that if the user accidentally hovers over the copy link they won't have to reselect the text
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(this.clonedRange);
	};

	copyLinkToClipboard = (e) => {
		const coords = { x: e.clientX, y: e.clientY };
		this.setState({ openPopup: true, coords });
		setTimeout(() => this.setState({ openPopup: false }), 1000);
		// console.log('clicked the copy button');
		document.addEventListener('copy', this.handleCopy);
		document.execCommand('copy');
		document.removeEventListener('copy', this.handleCopy);
	};

	toggleHighlightColors = (e) => {
		e.preventDefault();
		this.setState({ highlightOpen: !this.state.highlightOpen });
	};

	render() {
		const {
			// shareHighlightToFacebook,
			addFacebookLike,
			// setActiveNote,
			coordinates,
			// parentNode,
			// toggleNotesModal,
			// notesActive,
			closeContextMenu,
			// setActiveNotesView,
			selectedText,
		} = this.props;

		// console.log('selectedText', selectedText);

		const component = (
			<div
				style={{
					position: 'absolute',
					left: `${coordinates.x}px`,
					top: `${coordinates.y}px`,
				}}
				ref={this.setComponentRef}
				className={'context-menu shadow'}
			>
				<div className={'menu-row'}>
					<span
						role={'button'}
						tabIndex={0}
						className={'menu-item normal'}
						title={'Add a note'}
						onClick={this.handleNoteClick}
					>
						<SvgWrapper className={'icon'} svgid="notes" />
						<span className={'item-text'}>Notes</span>
					</span>
					<span
						role={'button'}
						tabIndex={0}
						className={
							this.state.highlightOpen ? 'menu-item active' : 'menu-item normal'
						}
						title={'Add a highlight'}
						onClick={this.toggleHighlightColors}
					>
						<SvgWrapper className={'icon'} svgid="highlight" />
						<span className={'item-text'}>Highlight</span>
						<div
							className={
								this.state.highlightOpen
									? 'highlight-colors active'
									: 'highlight-colors'
							}
						>
							<HighlightColors addHighlight={this.handleHighlightClick} />
						</div>
					</span>
					<span
						role={'button'}
						tabIndex={0}
						className={'menu-item normal'}
						title={'Add a bookmark'}
						onClick={this.handleBookmarkClick}
					>
						<SvgWrapper className={'icon'} svgid="bookmark" />
						<span className={'item-text'}>Bookmark</span>
					</span>
					<EmailShareButton
						className={'menu-item normal'}
						onShareWindowClose={closeContextMenu}
						subject={document.title}
						body={`"${selectedText}"\n\nTo listen to the audio click here: ${
							window.location.href
						}`}
						url={window.location.href}
					>
						<SvgWrapper className={'icon'} svgid="e-mail" />
						<span className={'item-text'}>E-mail</span>
					</EmailShareButton>
				</div>
				<div className={'menu-row'}>
					<FacebookShareButton
						onShareWindowClose={closeContextMenu}
						className="menu-item social facebook fb-share-button"
						quote={`"${selectedText}"`}
						url={window.location.href}
					>
						<SvgWrapper className={'icon'} svgid="facebook" />
					</FacebookShareButton>
					<GooglePlusShareButton
						onShareWindowClose={closeContextMenu}
						className={'menu-item social google'}
						url={window.location.href}
					>
						<SvgWrapper className={'icon'} svgid="google" />
					</GooglePlusShareButton>
					<TwitterShareButton
						onShareWindowClose={closeContextMenu}
						className={'menu-item social twitter'}
						title={document.title}
						hashtags={[`${document.title.split('|')[0].replace(/\s/g, '')}`]}
						url={window.location.href}
					>
						<SvgWrapper className={'icon'} svgid="twitter" />
					</TwitterShareButton>
					<div
						role={'button'}
						tabIndex={0}
						className={'menu-item social like-button facebook'}
						title={'Like on Facebook'}
						onClick={addFacebookLike}
					>
						<span className={'share-count'}>
							<FacebookShareCount url={window.location.href} />
						</span>
						<span className={'like-thumb'}>
							<SvgWrapper
								height={'24px'}
								width={'24px'}
								svgid="like_one-color"
							/>{' '}
							Like
						</span>
					</div>
				</div>
				<div
					id={'copy-container'}
					role={'button'}
					tabIndex={0}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					onClick={this.copyLinkToClipboard}
					className={'menu-row'}
					title={'Copy link to page'}
				>
					<input
						readOnly
						id={'link-to-copy'}
						className={'copy-link'}
						value={window.location.href}
					/>
					<span id={'copy-button'} className={'copy-button'}>
						Copy
					</span>
				</div>
				{this.state.openPopup ? (
					<PopupMessage
						message={'Link Copied!'}
						x={this.state.coords.x}
						y={this.state.coords.y}
					/>
				) : null}
			</div>
		);

		// if (parentNode instanceof HTMLElement || parentNode instanceof Node) {
		// 	return ReactDOM.createPortal(component, parentNode);
		// }

		return component;
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
	// parentNode: PropTypes.object,
	selectedText: PropTypes.string,
	coordinates: PropTypes.object,
	notesActive: PropTypes.bool,
	addHighlight: PropTypes.func,
	// shareHighlightToFacebook: PropTypes.func,
	setActiveNote: PropTypes.func,
	addFacebookLike: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	closeContextMenu: PropTypes.func,
	handleAddBookmark: PropTypes.func,
	setActiveNotesView: PropTypes.func,
};

export default ContextPortal;
