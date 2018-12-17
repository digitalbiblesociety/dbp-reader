/**
 *
 * ImageHoc
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function ImageComponent({ dataSrc, src, classes, alt, ...props }) {
	if (dataSrc) {
		return (
			<img src={dataSrc} className={`${classes} loaded`} alt={alt} {...props} />
		);
	}
	return <img src={src} alt={alt} className={classes} {...props} />;
}

ImageComponent.propTypes = {
	dataSrc: PropTypes.string,
	src: PropTypes.string,
	classes: PropTypes.string,
	alt: PropTypes.string,
};

export default ImageComponent;
