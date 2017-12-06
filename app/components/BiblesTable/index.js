/**
*
* BiblesTable
*
*/

import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import PropTypes from 'prop-types';
import CustomCell from 'components/CustomCell';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class BiblesTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const { bibles, getBooksForText, setActiveText } = this.props;
		return (
			<Table rowHeight={50} rowsCount={bibles.length || 1} width={820} height={750} headerHeight={50}>
				<Column
					header={<Cell>Name</Cell>}
					cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={bibles[rowIndex].abbr} content={bibles[rowIndex].name} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
					allowCellsRecycling
					width={400}
				/>
				<Column
					header={<Cell>Abbreviation</Cell>}
					cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={bibles[rowIndex].abbr} content={bibles[rowIndex].abbr} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
					allowCellsRecycling
					width={120}
				/>
				<Column
					header={<Cell>Language</Cell>}
					cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={bibles[rowIndex].abbr} content={bibles[rowIndex].language} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
					allowCellsRecycling
					width={300}
				/>
			</Table>
		);
	}
}

BiblesTable.propTypes = {
	bibles: PropTypes.array,
	getBooksForText: PropTypes.func,
	setActiveText: PropTypes.func,
};

export default BiblesTable;
