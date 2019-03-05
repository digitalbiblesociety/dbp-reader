/**
 *
 * ColorPicker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Colors from '../../../theme_config/javascriptColors';

function ColorPicker({ handlePickedColor }) {
	return (
		<div className={'color-picker'}>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: Colors.highlightYellow }}
					aria-label="yellow"
					role={'button'}
					tabIndex={-1}
					className={'yellow'}
					onClick={() => handlePickedColor({ color: Colors.highlightYellow })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: Colors.highlightGreen }}
					aria-label="green"
					role={'button'}
					tabIndex={-2}
					className={'green'}
					onClick={() => handlePickedColor({ color: Colors.highlightGreen })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: Colors.highlightPink }}
					aria-label="pink"
					role={'button'}
					tabIndex={-3}
					className={'pink'}
					onClick={() => handlePickedColor({ color: Colors.highlightPink })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: Colors.highlightPurple }}
					aria-label="purple"
					role={'button'}
					tabIndex={-4}
					className={'purple'}
					onClick={() => handlePickedColor({ color: Colors.highlightPurple })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: Colors.highlightBlue }}
					aria-label="blue"
					role={'button'}
					tabIndex={-5}
					className={'blue'}
					onClick={() => handlePickedColor({ color: Colors.highlightBlue })}
				/>
			</span>
		</div>
	);
}

ColorPicker.propTypes = {
	handlePickedColor: PropTypes.func,
};

export default ColorPicker;
