/**
*
* CustomCell
*
*/

import React from 'react';
import { Cell } from 'fixed-data-table-2';
import PropTypes from 'prop-types';

const CustomCell = ({ rowIndex, abbr, content, getBooksForText, setActiveText, ...props }) => (
	<Cell {...props}>
		<div
			tabIndex="0"
			role="button"
			onClick={() => {
				setActiveText({ textId: abbr, textName: abbr });
				getBooksForText({ textId: abbr });
			}}
		>
			<h1>{content}</h1>
		</div>
	</Cell>
);

CustomCell.propTypes = {
	rowIndex: PropTypes.number,
	abbr: PropTypes.string,
	content: PropTypes.string,
	getBooksForText: PropTypes.func,
	setActiveText: PropTypes.func,
};

export default CustomCell;
