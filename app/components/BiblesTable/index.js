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
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
		};
	}

	filterFunction = (bible, filterText) => {
		const lowerCaseText = filterText.toLowerCase();

		if (bible.get('language').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (bible.get('abbr').toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (bible.get('name').toLowerCase().includes(lowerCaseText)) {
			return true;
		}
		return false;
	}

	handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const { bibles, getBooksForText, setActiveText } = this.props;
		const { filterText } = this.state;

		if (filterText) {
			const filteredBibles = bibles.filter((bible) => this.filterFunction(bible, filterText));
			return (
				<div className="centered">
					<input onChange={this.handleChange} placeholder="Filter by language" />
					<Table rowHeight={50} rowsCount={filteredBibles.size || 1} width={820} height={750} headerHeight={50}>
						<Column
							header={<Cell>Name</Cell>}
							cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={filteredBibles.getIn([rowIndex, 'abbr'])} content={filteredBibles.getIn([rowIndex, 'name'])} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
							allowCellsRecycling
							width={400}
						/>
						<Column
							header={<Cell>Abbreviation</Cell>}
							cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={filteredBibles.getIn([rowIndex, 'abbr'])} content={filteredBibles.getIn([rowIndex, 'abbr'])} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
							allowCellsRecycling
							width={120}
						/>
						<Column
							header={<Cell>Language</Cell>}
							cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={filteredBibles.getIn([rowIndex, 'abbr'])} content={filteredBibles.getIn([rowIndex, 'language'])} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
							allowCellsRecycling
							width={300}
						/>
					</Table>
				</div>
			);
		}
		return (
			<div className="centered">
				<input type="text" className="search" name="filter" onChange={this.handleChange} placeholder="Filter by language" />
				<Table rowHeight={50} rowsCount={bibles.size || 1} width={820} height={750} headerHeight={50}>
					<Column
						header={<Cell>Name</Cell>}
						cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={bibles.getIn([rowIndex, 'abbr'])} content={bibles.getIn([rowIndex, 'name'])} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
						allowCellsRecycling
						width={400}
					/>
					<Column
						header={<Cell>Abbreviation</Cell>}
						cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={bibles.getIn([rowIndex, 'abbr'])} content={bibles.getIn([rowIndex, 'abbr'])} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
						allowCellsRecycling
						width={120}
					/>
					<Column
						header={<Cell>Language</Cell>}
						cell={({ rowIndex, ...props }) => (<CustomCell rowIndex={rowIndex} abbr={bibles.getIn([rowIndex, 'abbr'])} content={bibles.getIn([rowIndex, 'language'])} getBooksForText={getBooksForText} setActiveText={setActiveText} {...props} />)}
						allowCellsRecycling
						width={300}
					/>
				</Table>
			</div>
		);
	}
}

BiblesTable.propTypes = {
	bibles: PropTypes.object,
	getBooksForText: PropTypes.func,
	setActiveText: PropTypes.func,
};

export default BiblesTable;
