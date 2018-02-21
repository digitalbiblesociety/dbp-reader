/**
*
* BiblesTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';
import {
	getVersionsError,
} from './selectors';

class BiblesTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		this.state = {
			filterText: '',
		};
	}

	get filteredVersionList() {
		const {
			bibles,
			activeIsoCode,
			activeTextName,
			versionsError,
		} = this.props;
		const { filterText } = this.state;
		const filteredBibles = filterText ? bibles.filter((bible) => this.filterFunction(bible, filterText, activeIsoCode)) : bibles.filter((bible) => activeIsoCode === 'ANY' ? true : bible.get('iso') === activeIsoCode);

		const components = filteredBibles.map((bible) => (
			<div
				className="version-item-button"
				tabIndex="0"
				role="button"
				key={`${bible.get('abbr')}${bible.get('date')}`}
				onClick={() => this.handleVersionListClick(bible)}
			>
				{
					bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'text_formatt').size || bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'text_plain').size ? (
						<SvgWrapper className="svg active" height="20px" width="20px" svgid="text" />
					) : (
						<SvgWrapper className="svg inactive" height="20px" width="20px" svgid="text" />
					)
				}
				{
					bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'audio_drama').size || bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'audio').size ? (
						<SvgWrapper className="svg active" height="20px" width="20px" svgid="volume" />
					) : (
						<SvgWrapper className="svg inactive" height="20px" width="20px" svgid="volume" />
					)
				}
				<h4 className={bible.get('abbr') === activeTextName ? 'active-version' : ''}>{bible.get('name')}</h4>
			</div>
		));

		if (bibles.size === 0 || versionsError) {
			return <span>There was an error fetching this resource, an Admin has been notified. We apologize for the inconvenience.</span>;
		}

		return components.size ? components : <span>There are no matches for your search.</span>;
	}

	filterFunction = (bible, filterText, iso) => {
		const lowerCaseText = filterText.toLowerCase();

		if (!(bible.get('iso') === iso) && iso !== 'ANY') {
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

	handleVersionListClick = (bible) => {
		const {
			setCountryListState,
			toggleLanguageList,
			toggleVersionList,
			toggleTextSelection,
			setActiveText,
			getAudio,
			active,
		} = this.props;

		if (bible) {
			const abbr = bible.get('abbr');

			getAudio({ list: bible.get('filesets') });
			setActiveText({ textId: abbr, textName: abbr, filesets: bible.get('filesets') });
			toggleTextSelection();
		} else if (active) {
			toggleLanguageList({ state: true });
			toggleVersionList({ state: false });
			this.setState({ filterText: '' });
		} else {
			setCountryListState({ state: false });
			toggleLanguageList({ state: false });
			toggleVersionList({ state: true });
			this.setState({ filterText: '' });
		}
	}

	handleChange = (e) => this.setState({ filterText: e.target.value });

	render() {
		const {
			activeTextName,
			active,
			loadingVersions,
			versionsError,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div role={'button'} tabIndex={0} onClick={() => this.handleVersionListClick()} className="text-selection-title">
						<SvgWrapper height="25px" width="25px" fill="#fff" svgid="resources" />
						<span className="text">VERSION:</span>
						{/* <span className="active-header-name">{activeTextName}</span> */}
					</div>
					<input className="text-selection-input" onChange={this.handleChange} placeholder="SEARCH VERSIONS" value={this.state.filterText} />
					<div className="language-name-list">
						{
							loadingVersions && !versionsError ? (
								<LoadingSpinner />
							) : this.filteredVersionList
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
				onClick={() => this.handleVersionListClick()}
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
	getAudio: PropTypes.func,
	setActiveText: PropTypes.func,
	toggleVersionList: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	setCountryListState: PropTypes.func,
	activeIsoCode: PropTypes.string,
	activeTextName: PropTypes.string,
	active: PropTypes.bool,
	versionsError: PropTypes.bool,
	loadingVersions: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	versionsError: getVersionsError(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(BiblesTable);
