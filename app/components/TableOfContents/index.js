/**
*
* TableOfContents
*
*/

import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class TableOfContents extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      textTitles,
    } = this.props;

    return (
      <Table
        rowHeight={30}
        rowsCount={textTitles.length || 1}
        width={5000}
        height={5000}
        headerHeight={50}
      >
        <Column
          header={<Cell>Text Name</Cell>}
          cell={({ rowIndex, ...props }) => (
            <Cell {...props}>
              {textTitles[rowIndex]}
            </Cell>
          )}
          width={2000}
        />
      </Table>
    );
  }
}

TableOfContents.propTypes = {
  textTitles: PropTypes.array,
};

export default TableOfContents;
