/**
*
* TextSelection
*
*/

import React from 'react';
import BiblesTable from 'components/BiblesTable';
import BooksTable from 'components/BooksTable';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class TextSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			isBibleTableActive,
			bibles,
			books,
			activeBookName,
			setActiveBookName,
			getChapterText,
			getBooksForText,
			setActiveText,
		} = this.props;
		return (
			<React.Fragment>
				{
					isBibleTableActive ? (
						<BiblesTable setActiveText={setActiveText} getBooksForText={getBooksForText} bibles={bibles} />
					) : (
						<BooksTable getChapterText={getChapterText} setActiveBookName={setActiveBookName} activeBookName={activeBookName} books={books} />
					)
				}
			</React.Fragment>
		);
	}
}

TextSelection.propTypes = {
	isBibleTableActive: PropTypes.bool,
	bibles: PropTypes.object,
	books: PropTypes.array,
	activeBookName: PropTypes.string,
	setActiveBookName: PropTypes.func,
	getChapterText: PropTypes.func,
	getBooksForText: PropTypes.func,
	setActiveText: PropTypes.func,
};

export default TextSelection;
