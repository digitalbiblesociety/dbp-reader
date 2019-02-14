import checkBook from '../checkBookName';

describe('Test check book function', () => {
	it('Should return input if id did not match osis or name', () => {
		expect(checkBook('GEN')).toEqual('GEN');
	});
	it('Should return book_id if id did match osis_id', () => {
		expect(checkBook('2thess')).toEqual('2TH');
	});
	it('Should return book_id if id did match name', () => {
		expect(checkBook('2 Chronicles')).toEqual('2CH');
	});
	it('Should not work with a non string', () => {
		expect(() => checkBook(5)).toThrow();
	});
});
