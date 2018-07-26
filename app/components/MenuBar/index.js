/**
 *
 * MenuBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import menu from '../../images/menu.svg';
import SvgWrapper from '../SvgWrapper';
import messages from './messages';

class MenuBar extends React.PureComponent {
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		if (document) {
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	setRef = (node) => {
		this.ref = node;
	};

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth =
			event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight =
			event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleMenuBar();
			document.removeEventListener('click', this.handleClickOutside);
		}
	};

	render() {
		const { toggleMenuBar } = this.props;
		return (
			<aside ref={this.setRef} className="menu-sidebar settings">
				<header>
					<FormattedMessage
						as="h2"
						className="section-title"
						{...messages.menu}
					/>
					<span
						role="button"
						tabIndex={0}
						className="close-icon"
						onClick={toggleMenuBar}
					>
						<svg className="icon">
							<use
								xmlnsXlink="http://www.w3.org/1999/xlink"
								xlinkHref={`${menu}#close`}
							/>
						</svg>
					</span>
				</header>
				<div className="menu-link-list">
					<a className="item" href="/">
						<div className="item-container">
							<SvgWrapper
								className="svg"
								height="30px"
								width="30px"
								fill="#fff"
								svgid="bible"
							/>
							<FormattedMessage {...messages.bible} />
						</div>
					</a>
					<a className="item" href="http://www.bible.is/radio">
						<div className="item-container">
							<SvgWrapper
								className="svg"
								height="30px"
								width="30px"
								fill="#fff"
								svgid="radio"
							/>
							<FormattedMessage {...messages.radio} />
						</div>
					</a>
					<a className="item" href="http://www.bible.is/download/audio">
						<div className="item-container">
							<SvgWrapper
								className="svg"
								height="30px"
								width="30px"
								fill="#fff"
								svgid="download"
							/>
							<FormattedMessage {...messages.download} />
						</div>
					</a>
					<a className="item" href="http://www.bible.is/apps">
						<div className="item-container">
							<SvgWrapper
								className="svg"
								height="30px"
								width="30px"
								fill="#fff"
								svgid="apps"
							/>
							<FormattedMessage {...messages.apps} />
						</div>
					</a>
					<a className="item" href="http://www.bible.is/share">
						<div className="item-container">
							<SvgWrapper
								className="svg"
								height="30px"
								width="30px"
								fill="#fff"
								svgid="share"
							/>
							<FormattedMessage {...messages.share} />
						</div>
					</a>
					<a className="item" href="http://www.bible.is/donate">
						<div className="item-container">
							<SvgWrapper
								className="svg"
								height="30px"
								width="30px"
								fill="#fff"
								svgid="donate"
							/>
							<FormattedMessage {...messages.donate} />
						</div>
					</a>
				</div>
			</aside>
		);
	}
}

MenuBar.propTypes = {
	toggleMenuBar: PropTypes.func,
};

export default MenuBar;
