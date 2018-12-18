/**
 *
 * SearchResult
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

function SearchResult({ result: r, bibleId }) {
	// Dont know of a better way to differentiate between words because two of the
	// same word could be in the text, this way at least their index in the array is different
	return (
		<div
			key={`${r.get('book_id')}${r.get('chapter')}${r.get('verse_start')}`}
			className={'single-result'}
		>
			<h4>
				<Link
					as={`/bible/${bibleId}/${r.get('book_id')}/${r.get(
						'chapter',
					)}/${r.get('verse_start')}`}
					href={`/bible/${bibleId}/${r.get('book_id')}/${r.get(
						'chapter',
					)}/${r.get('verse_start')}`}
				>
					<a>{`${r.get('chapter_alt')}:${r.get('verse_start_alt')}`}</a>
				</Link>
			</h4>
			<p>{r.get('verse_text')}</p>
		</div>
	);
}

SearchResult.propTypes = {
	result: PropTypes.object,
	bibleId: PropTypes.string,
};

export default SearchResult;
