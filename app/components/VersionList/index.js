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

	filterFunction = (bible, filterText, iso) => {
		const lowerCaseText = filterText.toLowerCase();

		if (!(bible.get('iso') === iso)) {
			return false;
		}

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
		const { bibles, getBooksForText, setActiveText, activeIsoCode, active, toggleVersionList } = this.props;
		const { filterText } = this.state;
		const filteredBibles = filterText ? bibles.filter((bible) => this.filterFunction(bible, filterText, activeIsoCode)) : bibles.filter((bible) => bible.get('iso') === activeIsoCode);
		if (active) {
			return (
				<div className="centered bibles-table">
					<div className="bibles-header">
						<h1>Name</h1>
						<input onChange={this.handleChange} placeholder="Filter by language" />
						<h1>Language</h1>
					</div>
					<div className="bibles-list">
						{
							filteredBibles.map((bible) => (
								<div
									tabIndex="0"
									role="button"
									key={`${bible.get('abbr')}${bible.get('date')}`}
									className="bibles-row"
									onClick={() => {
										const abbr = bible.get('abbr');
										setActiveText({ textId: abbr, textName: abbr });
										getBooksForText({ textId: abbr });
										toggleVersionList();
									}}
								>
									<h4>{bible.get('name')}</h4>
									<span className="language-text">{bible.get('language')}</span>
								</div>
							))
						}
					</div>
				</div>
			);
		}
		return (
			<div tabIndex="0" role="button" onClick={toggleVersionList}>SELECTED TEXT</div>
		);
	}
}

BiblesTable.propTypes = {
	bibles: PropTypes.object,
	getBooksForText: PropTypes.func,
	setActiveText: PropTypes.func,
	activeIsoCode: PropTypes.string,
	active: PropTypes.bool,
	toggleVersionList: PropTypes.func,
};

export default BiblesTable;
