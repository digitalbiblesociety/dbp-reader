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
} from '../HomePage/actions';
import BooksTable from '../../components/BooksTable';
import injectReducer from '../../utils/injectReducer';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import { selectActiveBookName, selectActiveChapter } from './selectors';
import reducer from './reducer';
/* eslint-disable jsx-a11y/no-static-element-interactions */

export class ChapterSelection extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// Need to only register this handler if the menu is in its active state
		if (this.props.active) {
			this.closeMenuController = new CloseMenuFunctions(
				this.aside,
				this.toggleChapterSelection,
			);
			this.closeMenuController.onMenuMount();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active && !this.props.active) {
			this.closeMenuController = new CloseMenuFunctions(
				this.aside,
				this.toggleChapterSelection,
			);
			this.closeMenuController.onMenuMount();
		} else if (!nextProps.active && this.props.active) {
			this.closeMenuController.onMenuUnmount();
		}
	}

	componentWillUnmount() {
		if (this.closeMenuController) {
			this.closeMenuController.onMenuUnmount();
		}
	}

	setAsideRef = (el) => {
		this.aside = el;
	};

	setActiveChapter = (props) => this.props.dispatch(setActiveChapter(props));

	setActiveBookName = (props) => this.props.dispatch(setActiveBookName(props));

	stopClickProp = (e) => e.stopPropagation();

	stopTouchProp = (e) => e.stopPropagation();

	toggleChapterSelection = (props) =>
		this.props.dispatch(toggleChapterSelection(props));

	render() {
		const { activeBookName, active } = this.props;

		return (
			<div
				style={{ display: active ? 'flex' : 'none' }}
				ref={this.setAsideRef}
				onTouchEnd={this.stopTouchProp}
				onClick={this.stopClickProp}
				className="chapter-text-dropdown"
				id={'chapter-dropdown-close-button'}
			>
				<BooksTable
					active={active}
					setActiveChapter={this.setActiveChapter}
					closeBookTable={this.toggleChapterSelection}
					setActiveBookName={this.setActiveBookName}
					initialBookName={activeBookName}
				/>
			</div>
		);
	}
}

ChapterSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	active: PropTypes.bool,
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

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'chapterSelection', reducer });

export default compose(
	withReducer,
	withConnect,
)(ChapterSelection);
