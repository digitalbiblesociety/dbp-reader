/**
*
* BiblesTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
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
		const { bibles, setCountryListState, toggleTextSelection, toggleLanguageList, setActiveText, activeTextName, activeIsoCode, active, toggleVersionList } = this.props;
		const { filterText } = this.state;
		const filteredBibles = filterText ? bibles.filter((bible) => this.filterFunction(bible, filterText, activeIsoCode)) : bibles.filter((bible) => bible.get('iso') === activeIsoCode);
		if (active) {
			return (
				<div className="text-selection-section">
					<div className="text-selection-title">
						<SvgWrapper height="25px" width="25px" fill="#fff" svgid="resources" />
						<span className="text">VERSION:</span>
						<span className="active-header-name">{activeTextName}</span>
					</div>
					<input className="text-selection-input" onChange={this.handleChange} placeholder="SEARCH VERSIONS" />
					<div className="language-name-list">
						{
							filteredBibles.map((bible) => (
								<div
									className="version-item-button"
									tabIndex="0"
									role="button"
									key={`${bible.get('abbr')}${bible.get('date')}`}
									onClick={() => {
										const abbr = bible.get('abbr');
										setActiveText({ textId: abbr, textName: abbr });
										toggleVersionList({ state: false });
										toggleTextSelection();
									}}
								>
									{
										bible.get('filesets').includes('audio_drama') ? (
											<SvgWrapper className="svg active" height="20px" width="20px" svgid="text" />
										) : (
											<SvgWrapper className="svg inactive" height="20px" width="20px" svgid="text" />
										)
									}
									{
										bible.get('filesets').includes('text_rich') || bible.get('filesets').includes('text_plain') ? (
											<SvgWrapper className="svg active" height="20px" width="20px" svgid="volume" />
										) : (
											<SvgWrapper className="svg inactive" height="20px" width="20px" svgid="volume" />
										)
									}
									<h4 className={bible.get('abbr') === activeTextName ? 'active-version' : ''}>{bible.get('name')}</h4>
								</div>
							))
						}
					</div>
				</div>
			);
		}
		return (
			<div
				className="text-selection-section closed"
				tabIndex="0"
				role="button"
				onClick={() => { toggleVersionList({ state: true }); setCountryListState({ state: false }); toggleLanguageList({ state: false }); }}
			>
				<div className="text-selection-title">
					<SvgWrapper height="25px" width="25px" fill="#fff" svgid="resources" />
					<span className="text">VERSION:</span>
					<span className="active-header-name">{activeTextName}</span>
				</div>
			</div>
		);
	}
}

BiblesTable.propTypes = {
	bibles: PropTypes.object,
	setActiveText: PropTypes.func,
	setCountryListState: PropTypes.func,
	activeIsoCode: PropTypes.string,
	activeTextName: PropTypes.string,
	active: PropTypes.bool,
	toggleVersionList: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	toggleTextSelection: PropTypes.func,
};

export default BiblesTable;
