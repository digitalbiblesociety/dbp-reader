/**
*
* BooksTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Table, Column, Cell } from 'fixed-data-table-2';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class BooksTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const { books } = this.props;
		return (
			<Table rowHeight={50} rowsCount={books.length || 1} width={1200} height={750} headerHeight={50}>
				<Column
					header={<Cell>Name</Cell>}
					cell={({ rowIndex, ...props }) => (<Cell {...props}>{books[rowIndex].name}</Cell>)}
					allowCellsRecycling
					width={500}
				/>
				<Column
					header={<Cell>Chapters</Cell>}
					cell={({ rowIndex, ...props }) => (<Cell {...props}>{books[rowIndex].chapters}</Cell>)}
					allowCellsRecycling
					width={200}
				/>
			</Table>
		);
	}
}

BooksTable.propTypes = {
	books: PropTypes.array,
};

export default BooksTable;
