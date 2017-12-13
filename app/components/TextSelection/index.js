/**
*
* TextSelection
*
*/

import React from 'react';
import LanguageList from 'components/LanguageList';
import VersionList from 'components/VersionList';
import BooksTable from 'components/BooksTable';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			bibles,
			books,
			languages,
			activeBookName,
			activeIsoCode,
			setActiveIsoCode,
			setActiveBookName,
			getChapterText,
			getBooksForText,
			setActiveText,
			toggleTextSelection,
			toggleVersionList,
			toggleLanguageList,
			languageListActive,
			versionListActive,
		} = this.props;
		const bookTableActive = true;
		return (
			<div>
				<LanguageList active={languageListActive} toggleLanguageList={toggleLanguageList} languages={languages} setActiveIsoCode={setActiveIsoCode} />
				<VersionList active={versionListActive} toggleVersionList={toggleVersionList} activeIsoCode={activeIsoCode} setActiveText={setActiveText} getBooksForText={getBooksForText} bibles={bibles} />
				<BooksTable toggleTextSelection={toggleTextSelection} active={bookTableActive} getChapterText={getChapterText} setActiveBookName={setActiveBookName} activeBookName={activeBookName} books={books} />
			</div>
		);
	}
}

TextSelection.propTypes = {
	activeIsoCode: PropTypes.string,
	setActiveIsoCode: PropTypes.func,
	bibles: PropTypes.object,
	languages: PropTypes.object,
	books: PropTypes.array,
	activeBookName: PropTypes.string,
	setActiveBookName: PropTypes.func,
	getChapterText: PropTypes.func,
	getBooksForText: PropTypes.func,
	setActiveText: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	toggleVersionList: PropTypes.func,
	languageListActive: PropTypes.bool,
	versionListActive: PropTypes.bool,
};

export default TextSelection;
