/**
 *
 * TextSelection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LanguageList from 'components/LanguageList';
import VersionList from 'components/VersionList';
import BooksTable from 'components/BooksTable';
import {
	toggleVersionList,
	toggleLanguageList,
	setActiveIsoCode,
	getBooks,
	getLanguages,
	getTexts,
	getChapterText,
	setActiveText,
} from './actions';
import makeSelectTextSelection, { selectLanguages, selectTexts } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const { activeTextId } = this.props.textselection;
		this.props.dispatch(getBooks({ textId: activeTextId }));
		this.props.dispatch(getLanguages());
		this.props.dispatch(getTexts());
	}

	getBooksForText = ({ textId }) => this.props.dispatch(getBooks({ textId }));

	getChapterText = ({ bible, book, chapter }) => this.props.dispatch(getChapterText({ bible, book, chapter }));

	setActiveIsoCode = ({ iso, name }) => this.props.dispatch(setActiveIsoCode({ iso, name }));

	setActiveText = ({ textName, textId }) => this.props.dispatch(setActiveText({ textName, textId }));

	toggleLanguageList = () => this.props.dispatch(toggleLanguageList());

	toggleVersionList = () => this.props.dispatch(toggleVersionList());

	render() {
		const {
			activeIsoCode,
			toggleTextSelection,
			languageListActive,
			versionListActive,
			activeLanguageName,
			bookTableActive,
			activeTextId,
			books,
		} = this.props.textselection;
		const { bibles, languages, setActiveBookName, activeBookName } = this.props;
		return (
			<aside>
				<LanguageList active={languageListActive} activeLanguageName={activeLanguageName} toggleLanguageList={this.toggleLanguageList} languages={languages} setActiveIsoCode={this.setActiveIsoCode} />
				<VersionList active={versionListActive} toggleVersionList={this.toggleVersionList} activeIsoCode={activeIsoCode} setActiveText={this.setActiveText} getBooksForText={this.getBooksForText} bibles={bibles} />
				<BooksTable activeTextId={activeTextId} toggleTextSelection={toggleTextSelection} active={bookTableActive} getChapterText={this.getChapterText} setActiveBookName={setActiveBookName} activeBookName={activeBookName} books={books} />
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
	activeBookName: PropTypes.string,
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
