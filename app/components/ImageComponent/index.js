/**
*
* ImageHoc
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* do the following to any images wrapped in this component
  var imgDefer = $( "img" );
  $.each(imgDefer, function( index, img ) {
    if($(img).attr('data-src')) {
      $(img).attr('src', $(img).attr('data-src'));
      $(img).addClass("loaded");
    }
  });
  const imgDefer = document.getElementsByTagName('img');
  const imgArray = [...imgDefer];

  imgArray.forEach((img) => {
    if (img.getAttribute('data-src')) {
      img.setAttribute('src', img.getAttribute('data-src'));
      img.setAttribute('class', 'loaded');
    }
  });
*/

function ImageComponent({ dataSrc, src, classes, alt }) {
	if (dataSrc) {
		return (<img src={dataSrc} className={`${classes} loaded`} alt={alt} />);
	}
	return (<img src={src} alt={alt} className={classes} />);
}

ImageComponent.propTypes = {
	dataSrc: PropTypes.string,
	src: PropTypes.string,
	classes: PropTypes.string,
	alt: PropTypes.string,
};

export default ImageComponent;
