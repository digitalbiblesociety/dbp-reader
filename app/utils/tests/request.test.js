import request from '../request';

const mockData = {
	'/valid-call': { data: ['call', 'was', 'valid'] },
	'/valid-call-with-options': { data: ['call', 'was', 'valid', 'with', 'key'] },
	'/reset-password': {
		error: { message: 'You need to reset your password.', code: 428 },
	},
	'/invalid-credentials': {
		error: { message: 'Invalid credentials, please try again', code: 401 },
	},
	'/redirect': { data: ['call', 'was', 'redirected'] },
	errorResponse: { statusText: 'Invalid Request', status: 500 },
};
jest.mock('isomorphic-fetch', () => (url, options) => {
	if (url === '/valid-call') {
		return new Promise((res) =>
			res({
				status: 200,
				json: () => mockData['/valid-call'],
			}),
		);
	} else if (
		'/valid-call-with-options' &&
		options.header &&
		options.header.Authorization === 'somekey'
	) {
		return new Promise((res) =>
			res({
				...options,
				status: 200,
				json: () => mockData['/valid-call-with-options'],
			}),
		);
	} else if (url === '/reset-password') {
		return new Promise((res) => res({ status: 428 }));
	} else if (url === '/invalid-credentials') {
		return new Promise((res) => res({ status: 401 }));
	} else if (url === '/redirect') {
		return new Promise((res) =>
			res({
				status: 300,
				json: () => mockData['/redirect'],
			}),
		);
	}
	return new Promise((res) => res(mockData.errorResponse));
});

describe('request utility function', () => {
	it('should return json for valid return', async () => {
		const json = await request('/valid-call');
		expect(json).toEqual(mockData['/valid-call']);
	});
	it('should return json for valid return while passing through options', async () => {
		const json = await request('/valid-call-with-options', {
			header: { Authorization: 'somekey' },
		});
		expect(json).toEqual(mockData['/valid-call-with-options']);
	});
	it('should return reset password message for 428 code', async () => {
		const json = await request('/reset-password');
		expect(json).toEqual(mockData['/reset-password']);
	});
	it('should return invalid credentials message for 401 code', async () => {
		const json = await request('/invalid-credentials');
		expect(json).toEqual(mockData['/invalid-credentials']);
	});
	it('should return response if redirect code', async () => {
		const json = await request('/redirect');
		expect(json).toEqual(mockData['/redirect']);
	});
	it('should throw error if code is not >= 200 && < 400 or one of 428, 401', async () => {
		let error;
		await request('/invalid-call').catch((err) => (error = err));

		expect(error.response).toEqual(mockData.errorResponse);
	});
});
