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
// import { Link } from 'react-router-dom';
// import styled from 'styled-components';
import Link from 'next/link';

function VersionListSection({ items }) {
	return (
		<Accordion>
			{items.map((item) => {
				if (item.types.audio && item.types.audio_drama) {
					return (
						<AccordionItem className={'accordion-title-style'} key={item.key}>
							<AccordionItemTitle>
								<h4 title={item.title} className={item.className}>
									{item.text}
								</h4>
							</AccordionItemTitle>
							<AccordionItemBody className={'accordion-body-style'}>
								<Link
									href={item.path}
									as={`/bible${item.path}`}
									key={`${item.key}_drama`}
								>
									<span
										className="version-item-button"
										onClick={() => item.clickHandler('audio_drama')}
									>
										Dramatized Version
									</span>
								</Link>
								<Link
									href={item.path}
									as={`/bible${item.path}`}
									key={`${item.key}_plain`}
								>
									<span
										className="version-item-button"
										onClick={() => item.clickHandler('audio')}
									>
										Non-Dramatized Version
									</span>
								</Link>
							</AccordionItemBody>
						</AccordionItem>
					);
				}
				return (
					<AccordionItem className={'accordion-title-style'} key={item.key}>
						<AccordionItemTitle>
							<Link href={item.path} as={`/bible${item.path}`} key={item.key}>
								<h4
									title={item.title}
									className={item.className}
									onClick={() => item.clickHandler('')}
								>
									{item.text}
								</h4>
							</Link>
						</AccordionItemTitle>
						<AccordionItemBody />
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}

VersionListSection.propTypes = {
	items: PropTypes.array,
};

export default VersionListSection;
