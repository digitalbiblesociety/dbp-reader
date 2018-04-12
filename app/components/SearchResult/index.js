/**
*
* SearchResult
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import some from 'lodash/some';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function SearchResult({ result: r, bibleId, filterText }) {
	// Dont know of a better way to differentiate between words because two of the
	// same word could be in the text, this way at least their index in the array is different
	/* eslint-disable react/no-array-index-key */
	let mainText = '';
	const splitText = filterText.split(' ');
	if (splitText.length > 1) {
		mainText = r.verse_text
			.split(' ')
			.map((w, i) => {
				const lowerCaseWord = w.toLowerCase();
				const wordHasSearch = some(splitText, (t) => lowerCaseWord.includes(t));
				if (wordHasSearch) {
					return <em key={`${w}_${i}`} className={'search-highlight'}>{w} </em>;
				}
				return `${w} `;
			});
	} else {
		mainText = r.verse_text
			.split(' ')
			.map((w, i) => w.toLowerCase().includes(filterText.toLowerCase()) ?
				<em key={`${w}_${i}`} className={'search-highlight'}>{w} </em> :
				`${w} `);
	}

	return (
		<div key={`${r.book_id}${r.chapter}${r.verse_start}`} className={'single-result'}>
			<h4><Link to={`/${bibleId}/${r.book_id}/${r.chapter}/${r.verse_start}`}>{`${r.book_name_alt} ${r.chapter_alt}:${r.verse_start_alt}`}</Link></h4>
			<p>{mainText}</p>
		</div>
	);
}

SearchResult.propTypes = {
	result: PropTypes.object,
	bibleId: PropTypes.string,
	filterText: PropTypes.string,
};

export default SearchResult;
