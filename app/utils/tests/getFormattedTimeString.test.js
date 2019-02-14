import formatTime from '../getFormattedTimeString';

describe('Test getFormattedTimeString utility function', () => {
	it('Should return the correct time string for less than a minute', () => {
		expect(formatTime(25)).toEqual('00:25');
	});
	it('Should return the correct time string for more than a minute', () => {
		expect(formatTime(79)).toEqual('01:19');
	});
	it('Should return the correct time string for more than ten minutes', () => {
		expect(formatTime(682)).toEqual('11:22');
	});
});
