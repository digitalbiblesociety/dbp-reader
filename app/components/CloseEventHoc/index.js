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
	class extends React.Component { // eslint-disable-line react/prefer-stateless-function
		componentDidMount() {
			document.addEventListener('click', this.handleClickOutside);
		}

		componentWillUnmount() {
			document.removeEventListener('click', this.handleClickOutside);
		}

		handleClickOutside = (event) => {
			const bounds = this.wrappedComponent.getBoundingClientRect();
			const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
			const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

			if (this.wrappedComponent && !(insideWidth && insideHeight)) {
				onCloseFunction();
				document.removeEventListener('click', this.handleClickOutside);
			}
		}

		setInnerRef = (el) => {
			this.wrappedComponent = el;
		}

		render() {
			return <WrappedComponent setInnerRef={this.setInnerRef} {...this.props} />;
		}
	};

closeEventHoc.propTypes = {

};

export default closeEventHoc;
