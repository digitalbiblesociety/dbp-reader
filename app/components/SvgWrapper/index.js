/**
 *
 * SvgWrapper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function SvgWrapper({ svgid, ...props }) {
	return (
		<svg {...props}>
			<use
				xmlnsXlink="http://www.w3.org/1999/xlink"
				xlinkHref={`/static/svglist.svg#${svgid}`}
			/>
		</svg>
	);
}

SvgWrapper.propTypes = {
	svgid: PropTypes.string,
};

export default SvgWrapper;
