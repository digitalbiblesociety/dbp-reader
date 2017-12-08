/**
*
* BiblesTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';
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
		const filteredBibles = filterText ? bibles.filter((bible) => this.filterFunction(bible, filterText)) : bibles;

		return (
			<div className="centered">
				<div className="row centered small-6">
					<div className="bibles_header">
						<h1>Name</h1>
						<input onChange={this.handleChange} placeholder="Filter by language" />
						<h1>Language</h1>
					</div>
					<div className="bibles_table">
						{
							filteredBibles.map((bible) => (
								<div
									tabIndex="0"
									role="button"
									className="bibles_row"
									onClick={() => {
										const abbr = bible.get('abbr');
										setActiveText({ textId: abbr, textName: abbr });
										getBooksForText({ textId: abbr });
									}}
								>
									<h3>{bible.get('name')}</h3>
									<span>{bible.get('language')}</span>
								</div>
							))
						}
					</div>
				</div>
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
