/**
 *
 * TextSelection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LanguageList from 'components/LanguageList';
import VersionList from 'components/VersionList';
import BooksTable from 'components/BooksTable';
import menu from 'images/menu.svg';
import {
	toggleVersionList,
	toggleLanguageList,
	setActiveIsoCode,
	setBookListState,
	getBooks,
	getLanguages,
	getTexts,
	setActiveText,
} from './actions';
import makeSelectTextSelection, { selectLanguages, selectTexts } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

export class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const { activeTextId } = this.props.textselection;
		this.props.dispatch(getBooks({ textId: activeTextId }));
		this.props.dispatch(getLanguages());
		this.props.dispatch(getTexts());
	}

	getBooksForText = ({ textId }) => this.props.dispatch(getBooks({ textId }));

	setBookListState = ({ state }) => this.props.dispatch(setBookListState({ state }));

	setActiveIsoCode = ({ iso, name }) => this.props.dispatch(setActiveIsoCode({ iso, name }));

	setActiveText = ({ textName, textId }) => this.props.dispatch(setActiveText({ textName, textId }));

	toggleLanguageList = () => this.props.dispatch(toggleLanguageList());

	toggleVersionList = () => this.props.dispatch(toggleVersionList());

	render() {
		const {
			activeIsoCode,
			languageListActive,
			versionListActive,
			activeLanguageName,
			bookTableActive,
			activeTextId,
			books,
			activeTextName,
		} = this.props.textselection;
		const {
			bibles,
			languages,
			setActiveBookName,
			activeBookName,
			toggleTextSelection,
			getChapters,
		} = this.props;
		let sectionTitle = 'LANGUAGE';
		if (versionListActive) {
			sectionTitle = 'VERSION';
		} else if (bookTableActive) {
			sectionTitle = 'BOOK';
		}
		return (
			<aside className="settings">
				<header>
					<h2 className="section-title text-selection">{`${sectionTitle} SELECTION`}</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={toggleTextSelection}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				<LanguageList active={languageListActive} setBookListState={this.setBookListState} toggleVersionList={this.toggleVersionList} activeLanguageName={activeLanguageName} toggleLanguageList={this.toggleLanguageList} languages={languages} setActiveIsoCode={this.setActiveIsoCode} />
				<VersionList active={versionListActive} setBookListState={this.setBookListState} activeTextName={activeTextName} toggleVersionList={this.toggleVersionList} activeIsoCode={activeIsoCode} setActiveText={this.setActiveText} getBooksForText={this.getBooksForText} bibles={bibles} />
				<BooksTable activeTextId={activeTextId} toggleTextSelection={toggleTextSelection} active={bookTableActive} getChapterText={getChapters} setActiveBookName={setActiveBookName} activeBookName={activeBookName} books={books} />
			</aside>
		);
	}
}

TextSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bibles: PropTypes.object,
	languages: PropTypes.object,
	toggleTextSelection: PropTypes.func,
	setActiveBookName: PropTypes.func,
	getChapters: PropTypes.func,
	activeBookName: PropTypes.string,
	activeTextName: PropTypes.string,
	textselection: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	textselection: makeSelectTextSelection(),
	languages: selectLanguages(),
	bibles: selectTexts(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'textSelection', reducer });
const withSaga = injectSaga({ key: 'textSelection', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(TextSelection);
