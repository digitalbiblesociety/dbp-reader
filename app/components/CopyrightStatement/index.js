import React from 'react';
import { FormattedMessage } from 'react-intl';
import ImageComponent from '../ImageComponent';
import messages from './messages';

const imageClasses = {
	audio: (isIcon) =>
		isIcon
			? 'image-icon fcbh-copyright-logo'
			: 'image-landscape fcbh-copyright-logo',
	text: (isIcon) => (isIcon ? 'image-icon' : 'image-landscape'),
	video: (isIcon) => (isIcon ? 'image-icon' : 'image-landscape'),
};

const CopyrightStatement = ({ organizations, testament, type }) =>
	organizations.map((org) => [
		<h3 key={`${org.name}_${type}_name_${testament}`}>
			<FormattedMessage {...messages[`providedBy${type}`]} />
		</h3>,
		org.logo ? (
			<a
				rel={'noopener'}
				key={`${org.url}_${type}_url_${testament}`}
				target={'_blank'}
				href={org.url}
			>
				<ImageComponent
					className={imageClasses[type](org.isIcon)}
					alt={`Copyright owners logo: ${org.name}`}
					src={org.logo.url}
				/>
			</a>
		) : (
			<a
				rel={'noopener'}
				className={org.url ? 'org-name link' : 'org-name'}
				key={`${org.url}_${type}_${testament}`}
				target={'_blank'}
				href={org.url}
			>
				{org.name}
			</a>
		),
	]);

export default CopyrightStatement;
