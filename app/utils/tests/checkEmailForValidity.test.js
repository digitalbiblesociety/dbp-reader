import checkEmail from '../checkEmailForValidity';

describe('Test check email regex function', () => {
	it('Should return false if email is not valid (valid_characters@valid_sub_domain.valid_top_domain)', () => {
		expect(checkEmail('@random_email76@gmail.com')).toBe(false);
	});
	it('Should return true if email is valid (valid_characters@valid_sub_domain.valid_top_domain)', () => {
		expect(checkEmail('random_email76@gmail.com')).toBe(true);
	});
});
