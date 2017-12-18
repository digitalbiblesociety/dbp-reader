/**
*
* MenuBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import menu from 'images/menu.svg';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function MenuBar({ toggleMenuBar }) {
	return (
		<aside className="menu-sidebar settings">
			<header>
				<FormattedMessage as="h2" className="section-title" {...messages.menu} />
				<span role="button" tabIndex={0} className="close-icon" onClick={toggleMenuBar}>
					<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
				</span>
			</header>
			<div className="menu-link-list">
				<a className="item" href="/"><FormattedMessage {...messages.bible} /></a>
				<a className="item" href="http://www.bible.is/radio"><FormattedMessage {...messages.radio} /></a>
				<a className="item" href="http://www.bible.is/download/audio"><FormattedMessage {...messages.download} /></a>
				<a className="item" href="http://www.bible.is/apps"><FormattedMessage {...messages.apps} /></a>
				<a className="item" href="http://www.bible.is/share"><FormattedMessage {...messages.share} /></a>
				<a className="item" href="http://www.bible.is/donate"><FormattedMessage {...messages.donate} /></a>
			</div>
		</aside>
	);
}

MenuBar.propTypes = {
	toggleMenuBar: PropTypes.func,
};

export default MenuBar;
