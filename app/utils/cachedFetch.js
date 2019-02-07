import lscache from 'lscache';
import fetch from 'isomorphic-fetch';

// Set a default expiry for 5 minutes in development 24 hours in production
const TTL_MINUTES =
	process.env.IS_DEV || process.env.NODE_ENV === 'development'
		? 1000 * 60 * 5
		: 1000 * 60 * 60 * 24;

export default async function cachedFetch(url, options, expires) {
	// On the first load we flush any expired values
	lscache.flushExpired();
	// Makes the expiry time unit milliseconds
	lscache.setExpiryMilliseconds(1);
	// We don't cache anything when server-side rendering. Because there isn't local storage
	// That way if users refresh the page they always get fresh data.
	if (typeof window === 'undefined') {
		// If the call is to countries or languages then cache it anyway
		// We only want those to update once every 24 hours
		if (expires) {
			// don't return because I want this to always return the cached item until it expires
		} else {
			return fetch(url, options).then((response) => response.json());
		}
	}

	let cachedResponse = lscache.get(url);
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
	lscache.set(key, val, expires || TTL_MINUTES);
}

export function logCache(itemUrl) {
	return lscache.get(itemUrl);
}
