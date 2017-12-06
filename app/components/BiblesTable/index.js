/**
*
* BiblesTable
*
*/

import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class BiblesTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const { bibles } = this.props;
		return (
			<Table rowHeight={50} rowsCount={bibles.length || 1} width={1200} height={750} headerHeight={50}>
				<Column
					header={<Cell>Name</Cell>}
					cell={({ rowIndex, ...props }) => (<Cell {...props}>{bibles[rowIndex].name}</Cell>)}
					allowCellsRecycling
					width={500}
				/>
				<Column
					header={<Cell>Abbreviation</Cell>}
					cell={({ rowIndex, ...props }) => (<Cell {...props}>{bibles[rowIndex].abbr}</Cell>)}
					allowCellsRecycling
					width={200}
				/>
				<Column
					header={<Cell>Language</Cell>}
					cell={({ rowIndex, ...props }) => (<Cell {...props}>{bibles[rowIndex].language}</Cell>)}
					allowCellsRecycling
					width={500}
				/>
			</Table>
		);
	}
}

BiblesTable.propTypes = {
	bibles: PropTypes.array,
};

export default BiblesTable;
