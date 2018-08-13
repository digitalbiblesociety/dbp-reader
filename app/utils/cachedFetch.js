import lscache from 'lscache';
import fetch from 'isomorphic-fetch';

const TTL_MINUTES = 5;
// Todo: add catch and look for any bad responses in each request
export default async function cachedFetch(url, options, expires) {
	// We don't cache anything when server-side rendering.
	// That way if users refresh the page they always get fresh data.
	if (typeof window === 'undefined') {
		// console.log('Using fetch without a catch statement');
		// If the call is to countries or languages then cache it anyway
		// We only want those to update once every 24 hours
		if (expires) {
			// don't return because I want this to always return the cached item until it expires
			// console.log('Fetch called from server');
		} else {
			return fetch(url, options).then((response) => response.json());
		}
	}

	let cachedResponse = lscache.get(url);
	// if (expires) {
	// 	console.log('cachedResponse', cachedResponse);
	// }
	// If there is no cached response,
	// do the actual call and store the response
	if (cachedResponse === null) {
		cachedResponse = await fetch(url, options).then((response) =>
			response.json(),
		);
		lscache.set(url, cachedResponse, expires || TTL_MINUTES);
	}

	return cachedResponse;
}

export function overrideCache(key, val, expires) {
	// if (expires) {
	// 	console.log('key in override cache', key);
	// }
	lscache.set(key, val, expires || TTL_MINUTES);
}

export function logCache(itemUrl) {
	// console.log('itemUrl in lscache', itemUrl);
	// console.log('lscache', lscache.get(itemUrl));
	return lscache.get(itemUrl);
}
