/**
 *
 * VersionListSection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
	Accordion,
	AccordionItem,
	AccordionItemBody,
	AccordionItemTitle,
} from 'react-accessible-accordion';
import Link from 'next/link';

class VersionListSection extends React.PureComponent {
	getPath = (path, types, isHref) => {
		let fullPath = '';
		if (isHref) {
			fullPath += `${path}`;
		} else {
			fullPath += `/bible${path}`;
		}
		if (types.audio_drama) {
			fullPath += '?audio_type=audio_drama';
		} else if (types.audio) {
			fullPath += '?audio_type=audio';
		}
		return fullPath;
	};

	render() {
		const { items } = this.props;

		return (
			<Accordion>
				{items.map((item) => {
					if (item.types.audio && item.types.audio_drama) {
						return (
							<AccordionItem className={'accordion-title-style'} key={item.key}>
								<AccordionItemTitle>
									<h4 title={item.title} className={item.className}>
										{item.altText
											? `${item.text} ( ${item.altText} )`
											: item.text}
									</h4>
								</AccordionItemTitle>
								<AccordionItemBody className={'accordion-body-style'}>
									<Link
										href={`${item.path}?audio_type=audio_drama`}
										as={`/bible${item.path}?audio_type=audio_drama`}
										key={`${item.key}_drama`}
									>
										<a
											role={'button'}
											tabIndex={0}
											className="version-item-button"
											onClick={() => item.clickHandler('audio_drama')}
										>
											Dramatized Version
										</a>
									</Link>
									<Link
										href={`${item.path}?audio_type=audio`}
										as={`/bible${item.path}?audio_type=audio`}
										key={`${item.key}_plain`}
									>
										<a
											role={'button'}
											tabIndex={0}
											className="version-item-button"
											onClick={() => item.clickHandler('audio')}
										>
											Non-Dramatized Version
										</a>
									</Link>
								</AccordionItemBody>
							</AccordionItem>
						);
					}
					return (
						<AccordionItem className={'accordion-title-style'} key={item.key}>
							<AccordionItemTitle>
								<Link
									href={this.getPath(item.path, item.types, true)}
									as={this.getPath(item.path, item.types, false)}
									key={item.key}
								>
									<a
										role={'button'}
										tabIndex={0}
										title={item.title}
										className={`${item.className} top-level-title`}
										onClick={() => item.clickHandler('')}
									>
										{item.altText
											? `${item.text} ( ${item.altText} )`
											: item.text}
									</a>
								</Link>
							</AccordionItemTitle>
							<AccordionItemBody />
						</AccordionItem>
					);
				})}
			</Accordion>
		);
	}
}

VersionListSection.propTypes = {
	items: PropTypes.array,
};

export default VersionListSection;
