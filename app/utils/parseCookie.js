const parseCookieValue = (value) => {
	// If the value does not exist or is undefined or is null then return boolean false
	if (!value || value === 'undefined' || value === 'null') {
		return false;
	}
	// If the value is a boolean return a boolean
	if (value === 'false' || value === 'true') {
		return JSON.parse(value);
	}
	// If the value is a number return an integer - (Do not want this for volume or playback rate)
	if (!isNaN(parseFloat(value, 10))) {
		return parseFloat(value, 10);
	}
	// Return the value since it is a string of information
	return value;
};

const parseCookie = (cookie) =>
	cookie
		.split('; ')
		.filter((c) => c.includes('bible_is'))
		.reduce((a, c) => {
			const ca = c.split('=');
			return {
				...a,
				[ca[0]]: parseCookieValue(ca[1]),
			};
		}, {});

export { parseCookie, parseCookieValue };
export default parseCookie;
