import fetch from 'isomorphic-fetch';
import forge from 'node-forge';
// TODO: Add textRequest

const parseJSON = (res) => res.json();

// Need to update this to support the case where there is a 428
const checkStatus = (res) => {
	// console.log(
	//   forge.md.sha256.create(
	//     `${process.env.API_KEY}${process.env.NOTES_PROJECT}${new Date()}`,
	//   ),
	// );
	if (res.status >= 200 && res.status < 300) {
		return res;
		// return {
		//   json: async () => {
		//     const j = await res.json();

		//     return {
		//       ...j,
		//       success: true,
		//     };
		//   },
		// };
	}
	if (res.status === 428) {
		return {
			json: () => ({
				error: { message: 'You need to reset your password.', code: 428 },
			}),
		};
	} else if (res.status === 401) {
		return {
			json: () => ({
				error: { message: 'Invalid credentials, please try again', code: 401 },
			}),
		};
	}

	const error = new Error(res.statusText);
	error.response = res;
	throw error;
};
// put cookie here
const request = (url, options) =>
	fetch(url, {
		...options,
		Authorization: forge.md.sha256.create(
			`${process.env.DBP_API_KEY}${process.env.NOTES_PROJECT_ID}${new Date()}`,
		),
	})
		.then(checkStatus)
		.then(parseJSON);

export default request;
