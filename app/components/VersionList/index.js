/**
*
* VersionList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import SvgWrapper from 'components/SvgWrapper';
import LoadingSpinner from 'components/LoadingSpinner';
import {
	getVersionsError,
	selectActiveChapter,
	selectActiveBookId,
} from './selectors';

class VersionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
			activeTextId,
			activeBookId,
			activeChapter,
			versionsError,
		} = this.props;
		const { filterText } = this.state;
		const filteredBibles = filterText ? bibles.filter((bible) => this.filterFunction(bible, filterText, activeIsoCode)) : bibles.filter((bible) => activeIsoCode === 'ANY' ? true : bible.get('iso') === activeIsoCode);
		// Change the way I figure out if a resource has text or audio
		// When I first get the response from the server with filesets
		// Create three options, hasPlainText, hasAudio and hasFormatted
		// Then pass these three options into redux and use them here
		const components = filteredBibles.map((bible) => (
			<Link
				to={`/${bible.get('abbr').toLowerCase()}/${activeBookId.toLowerCase()}/${activeChapter}`}
				className="version-item-button"
				key={`${bible.get('abbr')}${bible.get('date')}`}
				onClick={() => this.handleVersionListClick(bible)}
			>
				{
					bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'text_formatt').size || bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'text_plain').size ? (
						<SvgWrapper className="active" height="20px" width="20px" svgid="text" />
					) : (
						<SvgWrapper className="inactive" height="20px" width="20px" svgid="text" />
					)
				}
				{
					bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'audio_drama').size || bible.get('filesets').filter((fileset) => fileset.get('set_type_code') === 'audio').size ? (
						<SvgWrapper className="active" height="20px" width="20px" svgid="volume" />
					) : (
						<SvgWrapper className="inactive" height="20px" width="20px" svgid="volume" />
					)
				}
				<h4 className={bible.get('abbr') === activeTextId ? 'active-version' : ''}>{bible.get('name')}</h4>
			</Link>
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
			active,
		} = this.props;

		if (bible) {
			setActiveText({ textId: bible.get('abbr'), textName: bible.get('name'), filesets: bible.get('filesets') });
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
			// activeTextName,
			active,
			loadingVersions,
			versionsError,
		} = this.props;

		if (active) {
			return (
				<div className="text-selection-section">
					<div className="version-name-list">
						{
							loadingVersions && !versionsError ? (
								<LoadingSpinner />
							) : this.filteredVersionList
						}
					</div>
				</div>
			);
		}
		return null;
	}
}

VersionList.propTypes = {
	bibles: PropTypes.object,
	setActiveText: PropTypes.func,
	toggleVersionList: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	setCountryListState: PropTypes.func,
	activeBookId: PropTypes.string,
	activeIsoCode: PropTypes.string,
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
	active: PropTypes.bool,
	versionsError: PropTypes.bool,
	loadingVersions: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	versionsError: getVersionsError(),
	activeBookId: selectActiveBookId(),
	activeChapter: selectActiveChapter(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(VersionList);
