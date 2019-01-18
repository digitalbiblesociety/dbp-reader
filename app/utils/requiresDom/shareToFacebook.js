const shareHighlightToFacebook = (quote, callbackFunction) => {
	if (typeof window !== 'undefined') {
		const FB = window.FB;

		FB.ui(
			{
				method: 'share',
				quote,
				href: `${window.location.href ||
					`${window.location.protocol}//${window.location.hostname}${
						window.location.pathname
					}`}`,
			},
			(res) => res,
		);
	}
	callbackFunction();
};

export default shareHighlightToFacebook;
