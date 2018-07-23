/**
 *
 * Logo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { changeLocale } from '../../containers/LanguageProvider/actions';
import { makeSelectLocale } from '../../containers/LanguageProvider/selectors';

// import logo from '../../images/logos.svg';

const logoSize = {
	height: '54px',
	width: '120px',
};

class Logo extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function

	constructor(props) {
		super(props);
		this.state = {
			locale: props.locale,
		};
	}

	render() {
		return (
			<svg style={logoSize} className="icon">
				<use
					xmlnsXlink="http://www.w3.org/1999/xlink"
					xlinkHref={`/static/logos.svg#${this.props.locale}`}
				/>
			</svg>
		);
	}
}

Logo.propTypes = {
	locale: PropTypes.string,
};

const mapStateToProps = createSelector(makeSelectLocale(), (locale) => ({
	locale,
}));

export function mapDispatchToProps(dispatch) {
	return {
		onLocaleToggle: (evt) => dispatch(changeLocale(evt.target.value)),
		dispatch,
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Logo);
