/**
 *
 * Notes
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import SvgWrapper from 'components/SvgWrapper';
import EditNote from 'components/EditNote';
import MyBookmarks from 'components/MyBookmarks';
import MyHighlights from 'components/MyHighlights';
import MyNotes from 'components/MyNotes';
import menu from 'images/menu.svg';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { setActiveChild } from './actions';
import makeSelectNotes from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class Notes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	setActiveChild = (child) => this.props.dispatch(setActiveChild(child))

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleNotesModal();
		}
	}

	render() {
		const {
			activeChild,
		} = this.props.notes;
		const {
			toggleNotesModal,
		} = this.props;

		return (
			<aside ref={this.setRef} className="settings">
				<header>
					<h2 className="section-title">NOTEBOOK</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={() => { setActiveChild('notes'); toggleNotesModal(); }}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				<div className="top-bar">
					<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('edit')} className={activeChild === 'edit' ? 'svg' : 'svg active'} height="30px" width="30px" svgid="notes" />
					<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('bookmark')} className={activeChild === 'bookmark' ? 'svg' : 'svg active'} height="30px" width="30px" svgid="bookmarks" />
					<SvgWrapper role="button" tabIndex={0} onClick={() => this.setActiveChild('highlight')} className={activeChild === 'highlight' ? 'svg' : 'svg active'} height="30px" width="30px" svgid="highlights" />
				</div>
				{
					activeChild === 'edit' ? (
						<EditNote />
					) : null
				}
				{
					activeChild === 'highlight' ? (
						<MyHighlights />
					) : null
				}
				{
					activeChild === 'bookmark' ? (
						<MyBookmarks />
					) : null
				}
				{
					activeChild === 'notes' ? (
						<MyNotes />
					) : null
				}
			</aside>
		);
	}
}

Notes.propTypes = {
	dispatch: PropTypes.func.isRequired,
	notes: PropTypes.object.isRequired,
	toggleNotesModal: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	notes: makeSelectNotes(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'notes', reducer });
const withSaga = injectSaga({ key: 'notes', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Notes);
