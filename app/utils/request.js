import fetch from 'isomorphic-fetch';

const parseJSON = (res) => res.json();

// Need to update this to support the case where there is a 428
const checkStatus = (res) => {
	if (res.status >= 200 && res.status < 300) {
		return res;
	}

	if (res.status === 428) {
		return {
			json: () => ({
				error: { message: 'You need to reset your password.', code: 428 },
			}),
		};
	}

	const error = new Error(res.statusText);
	error.response = res;
	throw error;
};

const request = (url, options) =>
	fetch(url, options)
		.then(checkStatus)
		.then(parseJSON);

export default request;
