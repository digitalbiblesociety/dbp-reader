/**
 *
 * NewChapterArrow
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import SvgWrapper from '../SvgWrapper';

const NewChapterArrow = ({
	clickHandler,
	getNewUrl,
	disabled,
	svgid,
	svgClasses,
	containerClasses,
	urlProps,
	disabledContainerClasses,
}) => {
	if (disabled) {
		return (
			<div className={disabledContainerClasses || 'arrow-wrapper disabled'} />
		);
	}

	return (
		<Link
			as={getNewUrl({
				...urlProps,
				isHref: false,
			})}
			href={getNewUrl({
				...urlProps,
				isHref: true,
			})}
		>
			<div
				onClick={clickHandler}
				className={containerClasses || 'arrow-wrapper'}
			>
				<SvgWrapper className={svgClasses || 'arrow-svg'} svgid={svgid} />
			</div>
		</Link>
	);
};

NewChapterArrow.propTypes = {
	getNewUrl: PropTypes.func,
	disabled: PropTypes.bool,
	svgid: PropTypes.string,
	svgClasses: PropTypes.string,
	containerClasses: PropTypes.string,
	disabledContainerClasses: PropTypes.string,
	urlProps: PropTypes.object,
	clickHandler: PropTypes.func,
};

export default NewChapterArrow;
