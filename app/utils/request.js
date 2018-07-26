import fetch from 'isomorphic-fetch';

const parseJSON = (res) => res.json();

const checkStatus = (res) => {
	if (res.status >= 200 && res.status < 300) {
		return res;
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
