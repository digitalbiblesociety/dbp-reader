// import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { resolve, parse } from 'url';
import Router from 'next/router';
// import { setChapterTextLoadingState } from '../containers/HomePage/actions';

class PrefetchLink extends Link {
	static propTypes = {
		withData: PropTypes.bool,
	};

	async prefetch() {
		if (typeof window === 'undefined') {
			// console.log('Prefetch did not run because request came from server');
			return;
		}

		const { pathname } = window.location;
		const href = resolve(pathname, this.props.href);
		const { query } = parse(this.props.href, true);
		const Component = await Router.prefetch(href);

		if (this.props.withData && Component) {
			const ctx = { pathname: href, query, isVirtualCall: true };
			await Component.getInitialProps(ctx);
		}
	}
}

export default connect()(PrefetchLink);
