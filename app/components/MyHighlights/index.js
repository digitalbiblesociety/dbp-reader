/**
*
* MyHighlights
*
*/

import React from 'react';
// import styled from 'styled-components';

class MyHighlights extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div>
				<div className="searchbar">
					<div className="add-note">+</div>
					<input placeholder="SEARCH NOTES" />
				</div>
			</div>
		);
	}
}

MyHighlights.propTypes = {

};

export default MyHighlights;
