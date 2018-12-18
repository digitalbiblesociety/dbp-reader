/**
 *
 * PageSizeSelector
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../SvgWrapper';

function PageSizeSelector({
	pageSize,
	togglePageSelector,
	setPageSize,
	pageSelectorState: state,
}) {
	return (
		<div className="page-size-selector">
			<div className={state ? 'open' : 'closed'}>
				<div
					className={pageSize === 10 ? 'active' : 'inactive'}
					role="button"
					tabIndex={0}
					onClick={() => {
						setPageSize(10);
						togglePageSelector();
					}}
				>
					<span className={'text'}>10 PER PAGE</span>
					{pageSize === 10 ? (
						<SvgWrapper
							width={'7px'}
							height={'13px'}
							svgid={'pagination-arrows'}
						/>
					) : (
						<span className={'svg-placeholder'}> </span>
					)}
				</div>
				<div
					className={pageSize === 25 ? 'active' : 'inactive'}
					role="button"
					tabIndex={0}
					onClick={() => {
						setPageSize(25);
						togglePageSelector();
					}}
				>
					<span className={'text'}>25 PER PAGE</span>
					{pageSize === 25 ? (
						<SvgWrapper
							width={'7px'}
							height={'13px'}
							svgid={'pagination-arrows'}
						/>
					) : (
						<span className={'svg-placeholder'}> </span>
					)}
				</div>
				<div
					className={pageSize === 50 ? 'active' : 'inactive'}
					role="button"
					tabIndex={0}
					onClick={() => {
						setPageSize(50);
						togglePageSelector();
					}}
				>
					<span className={'text'}>50 PER PAGE</span>
					{pageSize === 50 ? (
						<SvgWrapper
							width={'7px'}
							height={'13px'}
							svgid={'pagination-arrows'}
						/>
					) : (
						<span className={'svg-placeholder'}> </span>
					)}
				</div>
				<div
					className={pageSize === 100 ? 'active' : 'inactive'}
					role="button"
					tabIndex={0}
					onClick={() => {
						setPageSize(100);
						togglePageSelector();
					}}
				>
					<span className={'text'}>100 PER PAGE</span>
					{pageSize === 100 ? (
						<SvgWrapper
							width={'7px'}
							height={'13px'}
							svgid={'pagination-arrows'}
						/>
					) : (
						<span className={'svg-placeholder'}> </span>
					)}
				</div>
				<div
					className={pageSize === 0 ? 'active' : 'inactive'}
					role="button"
					tabIndex={0}
					onClick={() => {
						setPageSize(10000);
						togglePageSelector();
					}}
				>
					<span className={'text'}>VIEW ALL</span>
					{pageSize === 0 ? (
						<SvgWrapper
							width={'7px'}
							height={'13px'}
							svgid={'pagination-arrows'}
						/>
					) : (
						<span className={'svg-placeholder'}> </span>
					)}
				</div>
			</div>
			<div
				role="button"
				tabIndex={0}
				onClick={togglePageSelector}
				className={state ? 'closed per-page-toggle' : 'per-page-toggle'}
			>
				{pageSize === 10000 ? 'VIEW ALL' : `${pageSize} PER PAGE`}
			</div>
		</div>
	);
}

PageSizeSelector.propTypes = {
	setPageSize: PropTypes.func.isRequired,
	togglePageSelector: PropTypes.func.isRequired,
	pageSize: PropTypes.number.isRequired,
	pageSelectorState: PropTypes.bool.isRequired,
};

export default PageSizeSelector;
