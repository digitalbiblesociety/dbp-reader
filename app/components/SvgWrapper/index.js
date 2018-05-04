/**
*
* SvgWrapper
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import svgs from 'images/svglist.svg';
// import styled from 'styled-components';

/* May need some or all of the script below if we try to support IE

bottom script after #svgdefs targeting IE/Edge < 13 and U3 0.8 (UCWeb 11 or more) by userAgent, server side
(function(doc) {
	if (doc.getElementById('svgdefs')){ //loop through inlined svg <defs>
		Array.prototype.slice.call(doc.getElementsByTagName('use')).forEach(function(e){
			var svg, symbol, viewBox, id = e.getAttribute('xlink:href').split("#")[1];
			//get the viewbox from symbol node if we have a symbol id-to-fragment match
			if (id && (viewBox = (symbol = doc.getElementById(id)) ? symbol.getAttribute('viewBox') : '')){
				svg = e.parentNode;//svg container
				svg.setAttribute('viewBox', viewBox);//inline viewBox to svg node
				svg.removeChild(e);//remove <use> node, and replace with <symbol>'s svg content
				Array.prototype.slice.call(symbol.childNodes).forEach(function(e){ svg.appendChild(e); });
			}
		});
	}
})(document); */

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
