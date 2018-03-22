/**
 *
 * ChapterSelection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
	setActiveChapter,
	setActiveBookName,
	toggleChapterSelection,
} from 'containers/HomePage/actions';
import BooksTable from 'components/BooksTable';
// import SvgWrapper from 'components/SvgWrapper';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
import {
	selectActiveBookName,
	selectActiveChapter,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
/* eslint-disable jsx-a11y/no-static-element-interactions */

export class ChapterSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.aside, this.toggleChapterSelection);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
	}

	setAsideRef = (el) => {
		this.aside = el;
	}

	setActiveChapter = (props) => this.props.dispatch(setActiveChapter(props))

	setActiveBookName = (props) => this.props.dispatch(setActiveBookName(props))

	stopClickProp = (e) => e.stopPropagation()

	stopTouchProp = (e) => e.stopPropagation()

	toggleChapterSelection = (props) => this.props.dispatch(toggleChapterSelection(props))

	// handleClickOutside = (event) => {
	// 	const bounds = this.aside.getBoundingClientRect();
	// 	const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
	// 	const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;
	//
	// 	if (this.aside && !(insideWidth && insideHeight)) {
	// 		this.toggleChapterSelection();
	// 		document.removeEventListener('click', this.handleClickOutside);
	// 	}
	// }

	handleChapterToggle = () => {
		document.removeEventListener('click', this.handleClickOutside);

		this.toggleChapterSelection();
	}

	render() {
		const {
			activeBookName,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="ChapterSelection">
				<aside ref={this.setAsideRef} onTouchEnd={this.stopTouchProp} onClick={this.stopClickProp} className="chapter-text-dropdown">
					{
						activeBookName ? (
							<BooksTable
								setActiveChapter={this.setActiveChapter}
								closeBookTable={this.toggleChapterSelection}
								setActiveBookName={this.setActiveBookName}
								initialBookName={activeBookName}
							/>
						) : 'There was an error retrieving this resource. We apologize for the inconvenience. An admin has been notified. '
					}
				</aside>
			</GenericErrorBoundary>
		);
	}
}

ChapterSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	activeBookName: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
	activeBookName: selectActiveBookName(),
	activeChapter: selectActiveChapter(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'chapterSelection', reducer });
const withSaga = injectSaga({ key: 'chapterSelection', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(ChapterSelection);
