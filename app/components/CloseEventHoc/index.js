/**
 *
 * CloseEventHoc
 *
 */
// TODO: Figure out if this is the correct approach to unmounting modals
// ask on discord or slack channel
import React from 'react';
// import styled from 'styled-components';

const closeEventHoc = (WrappedComponent, onCloseFunction) =>
	class extends React.Component {
		// eslint-disable-line react/prefer-stateless-function
		componentDidMount() {
			document.addEventListener('click', this.handleClickOutside);
		}

		componentWillUnmount() {
			document.removeEventListener('click', this.handleClickOutside);
		}

		setInnerRef = (el) => {
			this.wrappedComponent = el;
		};

		handleClickOutside = (event) => {
			const bounds = this.wrappedComponent
				? this.wrappedComponent.getBoundingClientRect()
				: { x: 0, y: 0, width: 0, height: 0 };
			const insideWidth =
				event.x >= bounds.x && event.x <= bounds.x + bounds.width;
			const insideHeight =
				event.y >= bounds.y && event.y <= bounds.y + bounds.height;

			if (this.wrappedComponent && !(insideWidth && insideHeight)) {
				onCloseFunction();
				document.removeEventListener('click', this.handleClickOutside);
			}
		};

		render() {
			return <WrappedComponent innerRef={this.setInnerRef} {...this.props} />;
		}
	};

closeEventHoc.propTypes = {};

export default closeEventHoc;
