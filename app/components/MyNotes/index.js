/**
*
* MyNotes
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

class MyNotes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const {
			sectionType,
			listData,
		} = this.props;
		return (
			<div className="list-sections">
				<div className="searchbar">
					<div className="add-note"><SvgWrapper height="20px" width="20px" svgid="plus"></SvgWrapper></div>
					<input className="search" placeholder={`SEARCH ${sectionType.toUpperCase()}`} />
				</div>
				<section className="note-list">
					{
						listData.map((listItem) => (
							<div key={listItem.date + listItem.title} className="list-item">
								<div className="date">{listItem.date}</div>
								<div className="title-text">
									<h4 className="title">{listItem.title}</h4>
									<p className="text">{listItem.text}</p>
								</div>
							</div>
						))
					}
				</section>
				<div className="pagination">
					<span>1</span>
					<span type="dropdown" placeholder="10 PER PAGE"></span>
				</div>
			</div>
		);
	}
}

MyNotes.propTypes = {
	sectionType: PropTypes.string.isRequired,
	listData: PropTypes.array.isRequired,
};

export default MyNotes;
