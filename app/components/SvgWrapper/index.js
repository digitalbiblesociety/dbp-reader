/**
*
* SvgWrapper
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import svgs from 'images/svglist.svg';
// import styled from 'styled-components';


function SvgWrapper({ svgid, ...props }) {
	return (
		<svg {...props}>
			<use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${svgs}#${svgid}`}></use>
		</svg>
	);
}

SvgWrapper.propTypes = {
	svgid: PropTypes.string,
};

export default SvgWrapper;
