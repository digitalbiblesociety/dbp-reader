import React from 'react';
import renderer from 'react-test-renderer';
import { fromJS } from 'immutable';
import { mount } from 'enzyme';
import { BooksTable } from '..';

import { bookData } from '../../../utils/testUtils/booksData';

const props = {
  dispatch: jest.fn(),
  closeBookTable: jest.fn(),
  books: fromJS(bookData),
  audioObjects: [],
  userId: 609294,
  audioType: 'audio_drama',
  activeTextId: 'ENGESV',
  activeBookName: 'Matthew',
  initialBookName: 'Matthew',
  activeChapter: 3,
  loadingBooks: false,
  userAuthenticated: false,
  hasTextInDatabase: true,
  active: true,
  filesetTypes: {},
};
let wrapper;

describe('BooksTable tests', () => {
  beforeEach(() => {
    wrapper = mount(<BooksTable {...props} />);
  });
  it('should match snapshot with all potential props', () => {
    const tree = renderer.create(<BooksTable {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should match snapshot when it is closed', () => {
    const tree = renderer
      .create(<BooksTable {...props} active={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should match snapshot when it is loading', () => {
    const tree = renderer
      .create(<BooksTable {...props} loadingBooks />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should successfully mount', () => {
    expect(wrapper).toBeTruthy();
  });
});
