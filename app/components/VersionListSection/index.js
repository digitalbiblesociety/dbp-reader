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
import { Link } from 'react-router-dom';
// import styled from 'styled-components';

function VersionListSection({ items }) {
	return (
		<Accordion>
			{
				items.map((item) => {
					if (item.types.audio && item.types.audio_drama) {
						return (
							<AccordionItem className={'accordion-title-style'}>
								<AccordionItemTitle>
									<h4 className={item.className}>{item.text}</h4>
								</AccordionItemTitle>
								<AccordionItemBody className={'accordion-body-style'}>
									<Link
										to={item.path}
										className="version-item-button"
										key={item.key}
										onClick={() => item.clickHandler('audio_drama')}
									>
										Dramatized Version
									</Link>
									<Link
										to={item.path}
										className="version-item-button"
										key={item.key}
										onClick={() => item.clickHandler('audio_drama')}
									>
										Non-Dramatized Version
									</Link>
								</AccordionItemBody>
							</AccordionItem>
						);
					}
					return (
						<AccordionItem className={'accordion-title-style'}>
							<AccordionItemTitle>
								<Link
									to={item.path}
									key={item.key}
									onClick={item.clickHandler}
								>
									<h4 className={item.className}>{item.text}</h4>
								</Link>
							</AccordionItemTitle>
							<AccordionItemBody />
						</AccordionItem>
					);
				})
			}
		</Accordion>
	);
}

VersionListSection.propTypes = {
	items: PropTypes.array,
};

export default VersionListSection;
