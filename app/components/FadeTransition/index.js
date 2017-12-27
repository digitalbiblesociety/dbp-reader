/**
*
* FadeTransition
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
// import styled from 'styled-components';

const FadeTransition = ({ children, ...props }) => (
	<CSSTransition
		{...props}
		timeout={1000}
		classNames="fade"
	>
		{children}
	</CSSTransition>
);

FadeTransition.propTypes = {
	children: PropTypes.node,
};

export default FadeTransition;
