const parseCookie = (cookie) =>
	cookie
		.split(';')
		.filter((c) => c.includes('bible_is'))
		.map((c) => {
			console.log('cookie in map', c);
			const ca = c.split('=');
			return {
				key: ca[0],
				value: JSON.parse(ca[1]),
			};
		});

export default parseCookie;
