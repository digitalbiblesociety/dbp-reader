const isUserAgentInternetExplorer = (userAgent) => {
	if (/msie [0-9]{1}/i.test(userAgent)) {
		return true;
	} else if (/Trident\/[7]{1}/i.test(userAgent)) {
		return true;
	}

	return false;
};

export default isUserAgentInternetExplorer;
