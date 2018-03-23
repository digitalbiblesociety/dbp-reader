/**
*
* VersionListSection
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';

function VersionListSection({ items }) {
	return items.map((item) => {
		// console.log('item in section component', item);
		if (item.types.length > 1) {
			// make accordion
		}
		return (
			<Link
				to={item.path}
				className="version-item-button"
				key={item.key}
				onClick={item.clickHandler}
			>
				<h4 className={item.className}>{item.text}</h4>
			</Link>
		);
	});
}

VersionListSection.propTypes = {
	items: PropTypes.array,
};

export default VersionListSection;
