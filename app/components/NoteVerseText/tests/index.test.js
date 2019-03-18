import React from 'react';
import renderer from 'react-test-renderer';

import NoteVerseText from '..';

const notePassage = 'Salmon the father of Boaz, whose mother was Rahab. Boaz became the father of Obed, whose mother was Ruth. Obed became the father of Jesse,'

describe('<NoteVerseText />', () => {
  it('Should match snapshot when not loading', () => {
    const tree = renderer.create(<NoteVerseText notePassage={notePassage} loading={false} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
  it('Should match snapshot when loading', () => {
    const tree = renderer.create(<NoteVerseText notePassage={notePassage} loading />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
