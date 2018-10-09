import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import CopyrightStatement from '../CopyrightStatement';

const copyrightMessage = (message) =>
	message
		.split('\n')
		.map((m) => [
			<span key={`${m}_cpmessage`}>{m}</span>,
			<br key={`${m}_cplinebreak`} />,
		]);

const CopyrightSection = ({ prefix, copyrights }) => (
	<div className={prefix === 'old' ? 'ot-copyright' : 'nt-copyright'}>
		{get(copyrights, [`${prefix}Testament`, 'audio', 'organizations']) ||
		get(copyrights, [`${prefix}Testament`, 'audio', 'message']) ? (
			<div className={'cp-section'}>
				{get(copyrights, [`${prefix}Testament`, 'audio', 'organizations']) ? (
					<CopyrightStatement
						organizations={get(copyrights, [
							`${prefix}Testament`,
							'audio',
							'organizations',
						])}
						testament={`${prefix}_testament`}
						type={'audio'}
					/>
				) : null}
				{get(copyrights, [`${prefix}Testament`, 'audio', 'message']) ? (
					<p>
						{copyrightMessage(copyrights[`${prefix}Testament`].audio.message)}
					</p>
				) : null}
			</div>
		) : null}
		{get(copyrights, [`${prefix}Testament`, 'text', 'organizations']) ||
		get(copyrights, [`${prefix}Testament`, 'text', 'message']) ? (
			<div className={'cp-section'}>
				{get(copyrights, [`${prefix}Testament`, 'text', 'organizations']) ? (
					<CopyrightStatement
						organizations={get(copyrights, [
							`${prefix}Testament`,
							'text',
							'organizations',
						])}
						testament={`${prefix}_testament`}
						type={'text'}
					/>
				) : null}
				{get(copyrights, [`${prefix}Testament`, 'text', 'message']) ? (
					<p>
						{copyrightMessage(copyrights[`${prefix}Testament`].text.message)}
					</p>
				) : null}
			</div>
		) : null}
		{get(copyrights, [`${prefix}Testament`, 'video', 'organizations']) ||
		get(copyrights, [`${prefix}Testament`, 'video', 'message']) ? (
			<div className={'cp-section'}>
				{get(copyrights, [`${prefix}Testament`, 'video', 'organizations']) ? (
					<CopyrightStatement
						organizations={get(copyrights, [
							`${prefix}Testament`,
							'video',
							'organizations',
						])}
						testament={`${prefix}_testament`}
						type={'video'}
					/>
				) : null}
				{get(copyrights, [`${prefix}Testament`, 'video', 'message']) ? (
					<p>
						{copyrightMessage(copyrights[`${prefix}Testament`].video.message)}
					</p>
				) : null}
			</div>
		) : null}
	</div>
);

CopyrightSection.propTypes = {
	prefix: PropTypes.string,
	copyrights: PropTypes.object,
};

export default CopyrightSection;
