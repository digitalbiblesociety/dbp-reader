/**
*
* MyHighlights
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SvgWrapper from 'components/SvgWrapper';
import ColorPicker from 'components/ColorPicker';
// import styled from 'styled-components';

class MyHighlights extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		colorPickerState: false,
		selectedId: '',
		selectedColor: '',
	}

	handlePickedColor = ({ color }) => {
		if (color !== this.state.selectedColor) {
			this.props.updateHighlight({ color, id: this.state.selectedId });
		}

		this.setState({ colorPickerState: false, selectedId: '', selectedColor: '' });
	}

	startUpdateProcess = ({ id, color }) => {
		// console.log('start updating', id, color);
		this.setState({ colorPickerState: true, selectedId: id, selectedColor: color });
	}

	highlightIcon(color) {
		// console.log('color', color);
		// const colorKey = {
		// 	'252,230,0,.25': 'yellow',
		// 	'84,185,72,.25': 'green',
		// 	'208,105,169,.25': 'pink',
		// 	'137,103,172,.25': 'purple',
		// 	'80,165,220,.25': 'blue',
		// };
		// return <SvgWrapper className={'icon'} svgid={colorKey[color]} />;
		return <span className={'color-icon'} style={{ backgroundColor: `rgba(${color})` }} />;
	}

	render() {
		const {
			highlights,
			getReference,
			deleteHighlights,
		} = this.props;
		const {
			colorPickerState,
		} = this.state;
		// console.log('colorPickerState', colorPickerState);

		return (
			<div>
				{
					highlights.map((highlight) => (
						<div key={`${highlight.id}_${highlight.highlighted_color}`} className={'highlight-item'}>
							<Link to={`/${highlight.bible_id}/${highlight.book_id}/${highlight.chapter}/${highlight.verse_start}`} role="button" tabIndex={0} className="list-item">
								<div className="title-text">
									<h4 className="title">{getReference(highlight)}</h4>
									<h4>{highlight.bible_id}</h4>
								</div>
							</Link>
							<div className={'edit-color'} tabIndex={0} role={'button'} onClick={() => this.startUpdateProcess({ id: highlight.id, color: highlight.highlighted_color })}>
								{this.highlightIcon(highlight.highlighted_color)}
								<span>Edit</span>
							</div>
							<div className={'delete-highlight'}>
								<SvgWrapper className={'icon'} svgid={'delete'} onClick={() => deleteHighlights({ ids: [highlight.id] })} />
								<span>Delete</span>
							</div>
						</div>
					))
				}
				{
					colorPickerState ? <ColorPicker handlePickedColor={this.handlePickedColor} /> : null
				}
			</div>
		);
	}
}

MyHighlights.propTypes = {
	highlights: PropTypes.array,
	getReference: PropTypes.func,
	deleteHighlights: PropTypes.func,
	updateHighlight: PropTypes.func,
};

export default MyHighlights;
