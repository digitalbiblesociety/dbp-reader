/**
 *
 * ContextPortal
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
	FacebookShareButton,
	TwitterShareButton,
	EmailShareButton,
	FacebookShareCount,
} from 'react-share';
import SvgWrapper from '../SvgWrapper';
import GooglePlusShare from '../GooglePlusShare';
import HighlightColors from '../HighlightColors';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import PopupMessage from '../PopupMessage';
import { selectIeState } from './selectors';
import injectReducer from '../../utils/injectReducer';
import homepageReducer from '../../containers/HomePage/reducer';
import Ieerror from '../Ieerror';

// TODO: Clean up this component
// Remove use of styled components
// change to pure component and handle outside clicks instead of click handler
// on each item
export class ContextPortal extends React.PureComponent {
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
		e.clipboardData.setData('text/plain', window.location.href);
		e.preventDefault();
	};

	handleMouseEnter = (e) => {
		this.clonedRange = window
			.getSelection()
			.getRangeAt(0)
			.cloneRange();
		if (e.target.id === 'copy-button') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			textBox.select();
		} else if (e.target.id === 'link-to-copy') {
			// handle the link being the target
			e.target.select();
		} else if (e.target.id === 'copy-container') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			textBox.select();
		}
	};

	handleMouseLeave = (e) => {
		if (e.target.id === 'copy-button') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			textBox.setSelectionRange(0, 0);
		} else if (e.target.id === 'link-to-copy') {
			// handle the link being the target
			e.target.setSelectionRange(0, 0);
		} else if (e.target.id === 'copy-container') {
			// handle the button being the target
			const textBox = document.getElementById('link-to-copy');
			textBox.setSelectionRange(0, 0);
		}
		// Doing this so that if the user accidentally hovers over the copy link they won't have to reselect the text
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(this.clonedRange);
	};

	copyLinkToClipboard = (e) => {
		const coords = { x: e.clientX, y: e.clientY };
		this.setState({ openPopup: true, coords });
		setTimeout(() => this.setState({ openPopup: false }), 1000);
		document.addEventListener('copy', this.handleCopy);
		document.execCommand('copy');
		document.removeEventListener('copy', this.handleCopy);
	};

	toggleHighlightColors = (e) => {
		e.preventDefault();
		this.setState((cs) => ({ highlightOpen: !cs.highlightOpen }));
	};

	render() {
		const {
			addFacebookLike,
			coordinates,
			closeContextMenu,
			selectedText,
			isIe,
		} = this.props;

		if (isIe) {
			return (
				<div
					style={{
						position: 'absolute',
						left: `${coordinates.x}px`,
						top: `${coordinates.y}px`,
					}}
					ref={this.setComponentRef}
					className={'context-menu shadow'}
				>
					<Ieerror />
				</div>
			);
		}

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
						id={'add-note'}
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
						id={'add-highlight'}
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
						id={'add-bookmark'}
					>
						<SvgWrapper className={'icon'} svgid="bookmark" />
						<span className={'item-text'}>Bookmark</span>
					</span>
					<EmailShareButton
						className={'menu-item normal email-share'}
						onShareWindowClose={closeContextMenu}
						subject={document.title}
						body={`"${selectedText}"\n\nTo listen to the audio click here: ${
							window.location.href
						}`}
						url={window.location.href}
						id={'email-share-button'}
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
						id={'facebook-share-button'}
					>
						<SvgWrapper className={'icon'} svgid="facebook" />
					</FacebookShareButton>
					<GooglePlusShare className={'google-share'} quote={selectedText} />
					<TwitterShareButton
						onShareWindowClose={closeContextMenu}
						className={'menu-item social twitter'}
						title={document.title}
						hashtags={[`${document.title.split('|')[0].replace(/\s/g, '')}`]}
						url={window.location.href}
						id={'twitter-share-button'}
					>
						<SvgWrapper className={'icon'} svgid="twitter" />
					</TwitterShareButton>
					<div
						role={'button'}
						tabIndex={0}
						className={'menu-item social like-button'}
						title={'Like on Facebook'}
						id={'like-facebook'}
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

		return component;
	}
}

ContextPortal.propTypes = {
	selectedText: PropTypes.string,
	coordinates: PropTypes.object,
	notesActive: PropTypes.bool,
	isIe: PropTypes.bool,
	addHighlight: PropTypes.func,
	setActiveNote: PropTypes.func,
	addFacebookLike: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	closeContextMenu: PropTypes.func,
	handleAddBookmark: PropTypes.func,
	setActiveNotesView: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	isIe: selectIeState(),
});

const withConnect = connect(mapStateToProps);
const withHomepage = injectReducer({
	key: 'homepage',
	reducer: homepageReducer,
});

export default compose(
	withConnect,
	withHomepage,
)(ContextPortal);
