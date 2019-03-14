import booksList from '../listOfBooksInBible';

describe('List of books in bible utility data', () => {
  it('should match previous snapshot', () => {
    expect(booksList).toMatchSnapshot();
  });
});
