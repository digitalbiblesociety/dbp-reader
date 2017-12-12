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
		} = this.props;
		return (
			<div>
				<LanguageList languages={languages} setActiveIsoCode={setActiveIsoCode} />
				<VersionList activeIsoCode={activeIsoCode} setActiveText={setActiveText} getBooksForText={getBooksForText} bibles={bibles} />
				<BooksTable getChapterText={getChapterText} setActiveBookName={setActiveBookName} activeBookName={activeBookName} books={books} />
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
};

export default TextSelection;
