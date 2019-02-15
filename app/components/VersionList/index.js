/**
 *
 * VersionList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import LoadingSpinner from '../LoadingSpinner';
import VersionListSection from '../VersionListSection';
import messages from './messages';
import { selectActiveBookId, selectActiveChapter } from './selectors';
import { changeVersion } from '../../containers/HomePage/actions';

export class VersionList extends React.PureComponent {
	get filteredVersionList() {
		const {
			bibles,
			activeTextId,
			filterText,
			activeChapter,
			activeBookId,
		} = this.props;
		const filteredBibles = filterText
			? bibles.filter(this.filterFunction)
			: bibles;
		// Change the way I figure out if a resource has text or audio
		// path, key, types, className, text, clickHandler
		// Set the path to just the bible_id and let app.js handle getting the actual book and chapter needed
		const scrubbedBibles = filteredBibles.reduce(
			(acc, bible) => [
				...acc,
				{
					path: `/${bible
						.get('abbr')
						.toUpperCase()}/${activeBookId.toUpperCase()}/${activeChapter}`,
					key: `${bible.get('abbr')}${bible.get('date')}`,
					clickHandler: (audioType) =>
						this.handleVersionListClick(bible, audioType),
					className: bible.get('abbr') === activeTextId ? 'active-version' : '',
					title: bible.get('name'),
					text: bible.get('vname') || bible.get('name') || bible.get('abbr'),
					altText:
						bible.get('vname') && bible.get('vname') !== bible.get('name')
							? bible.get('name')
							: '',
					types: bible
						.get('filesets')
						.reduce((a, c) => ({ ...a, [c.get('type')]: true }), {}),
				},
			],
			[],
		);
		// When I first get the response from the server with filesets
		const audioAndText = [];
		const audioOnly = [];
		const textOnly = [];

		scrubbedBibles.forEach((b) => {
			if (
				(b.types.audio_drama || b.types.audio) &&
				(b.types.text_plain || b.types.text_format)
			) {
				audioAndText.push(b);
			} else if (b.types.audio_drama || b.types.audio) {
				audioOnly.push(b);
			} else {
				textOnly.push(b);
			}
		});

		const audioAndTextComponent = audioAndText.length ? (
			<div className={'version-list-section'} key={'audio-and-text'}>
				<div className={'version-list-section-title'}>
					<FormattedMessage {...messages.audioAndText} />
				</div>
				<VersionListSection items={audioAndText} />
			</div>
		) : null;
		const audioOnlyComponent = audioOnly.length ? (
			<div className={'version-list-section'} key={'audio-only'}>
				<div className={'version-list-section-title'}>
					<FormattedMessage {...messages.audioOnly} />
				</div>
				<VersionListSection items={audioOnly} />
			</div>
		) : null;
		const textOnlyComponent = textOnly.length ? (
			<div className={'version-list-section'} key={'text-only'}>
				<div className={'version-list-section-title'}>
					<FormattedMessage {...messages.textOnly} />
				</div>
				<VersionListSection items={textOnly} />
			</div>
		) : null;

		const components = [
			audioAndTextComponent,
			audioOnlyComponent,
			textOnlyComponent,
		];

		if (bibles.size === 0) {
			return (
				<span className="version-item-button">
					There was an error fetching this resource, an Admin has been notified.
					We apologize for the inconvenience.
				</span>
			);
		}

		return scrubbedBibles.length ? (
			components
		) : (
			<span className="version-item-button">
				There are no matches for your search.
			</span>
		);
	}

	filterFunction = (bible) => {
		const lowerCaseText = this.props.filterText.toLowerCase();
		const abbr = bible.get('abbr') || '';
		const name = bible.get('name') || '';
		const vname = bible.get('vname') || '';
		const date = bible.get('date') || '';

		if (vname.toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (name.toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (abbr.toLowerCase().includes(lowerCaseText)) {
			return true;
		} else if (date.includes(lowerCaseText)) {
			return true;
		}
		return false;
	};

	handleVersionListClick = (bible, audioType) => {
		const { toggleTextSelection, setActiveText, activeTextId } = this.props;

		if (bible.get('abbr').toLowerCase() !== activeTextId.toLowerCase()) {
			this.props.dispatch(changeVersion({ state: true }));
		}

		if (bible) {
			const filesets = bible
				.get('filesets')
				.filter((f) => f.get('type') !== 'app');
			if (audioType) {
				if (
					typeof window !== 'undefined' &&
					(audioType === 'audio' || audioType === 'audio_drama')
				) {
					document.cookie = `bible_is_audio_type=${audioType};path=/bible/${bible
						.get('abbr')
						.toLowerCase()}`;
				}
				setActiveText({
					textId: bible.get('abbr'),
					textName:
						bible.get('vname') || bible.get('name') || bible.get('abbr'),
					filesets: filesets.filter(
						(f) =>
							f.get('type') === audioType ||
							f.get('type') === 'text_plain' ||
							f.get('type') === 'text_format',
					),
				});
				toggleTextSelection();
			} else {
				setActiveText({
					textId: bible.get('abbr'),
					textName:
						bible.get('vname') || bible.get('name') || bible.get('abbr'),
					filesets,
				});
				toggleTextSelection();
			}
		}
	};

	render() {
		const { active, loadingVersions } = this.props;

		return (
			<div
				style={{ display: active ? 'block' : 'none' }}
				className="text-selection-section"
			>
				<div className="version-name-list">
					{loadingVersions ? <LoadingSpinner /> : this.filteredVersionList}
				</div>
			</div>
		);
	}
}

VersionList.propTypes = {
	bibles: PropTypes.object,
	dispatch: PropTypes.func,
	setActiveText: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	activeTextId: PropTypes.string,
	filterText: PropTypes.string,
	activeBookId: PropTypes.string,
	activeChapter: PropTypes.number,
	active: PropTypes.bool,
	loadingVersions: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const mapStateToProps = createStructuredSelector({
	activeBookId: selectActiveBookId(),
	activeChapter: selectActiveChapter(),
});

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(VersionList);
