/**
 *
 * Chapter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const Chapter = ({ as, active, chapter, clickHandler, href }) => {
	if (active) {
		return (
			<a className={'chapter-box'} onClick={clickHandler}>
				<span className={'active-chapter'}>{chapter}</span>
			</a>
		);
	}
	return (
		<Link href={href} as={as}>
			<a className={'chapter-box'} onClick={clickHandler}>
				<span>{chapter}</span>
			</a>
		</Link>
	);
};

Chapter.propTypes = {
	chapter: PropTypes.number,
	active: PropTypes.bool,
	href: PropTypes.string,
	as: PropTypes.string,
	clickHandler: PropTypes.func,
};

export default Chapter;
