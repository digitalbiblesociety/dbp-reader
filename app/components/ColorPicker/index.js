/**
 *
 * ColorPicker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function ColorPicker({ handlePickedColor }) {
	return (
		<div className={'color-picker'}>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: 'rgba(252,230,0,.5)' }}
					aria-label="yellow"
					role={'button'}
					tabIndex={-1}
					className={'yellow'}
					onClick={() => handlePickedColor({ color: 'rgba(252,230,0,.5)' })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: 'rgba(84,185,72,.5)' }}
					aria-label="green"
					role={'button'}
					tabIndex={-2}
					className={'green'}
					onClick={() => handlePickedColor({ color: 'rgba(84,185,72,.5)' })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: 'rgba(208,105,169,.5)' }}
					aria-label="pink"
					role={'button'}
					tabIndex={-3}
					className={'pink'}
					onClick={() => handlePickedColor({ color: 'rgba(208,105,169,.5)' })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: 'rgba(137,103,172,.5)' }}
					aria-label="purple"
					role={'button'}
					tabIndex={-4}
					className={'purple'}
					onClick={() => handlePickedColor({ color: 'rgba(137,103,172,.5)' })}
				/>
			</span>
			<span className={'color-group'}>
				<span
					style={{ backgroundColor: 'rgba(80,165,220,.5)' }}
					aria-label="blue"
					role={'button'}
					tabIndex={-5}
					className={'blue'}
					onClick={() => handlePickedColor({ color: 'rgba(80,165,220,.5)' })}
				/>
			</span>
		</div>
	);
}

ColorPicker.propTypes = {
	handlePickedColor: PropTypes.func,
};

export default ColorPicker;
