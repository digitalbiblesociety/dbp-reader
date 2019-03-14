/**
 *
 * NoteVerseText
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';

const NoteVerseText = ({ loading, notePassage }) => {
  if (loading) {
    return (
      <div className="verse-text">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className="verse-text">
      &quot;&nbsp;
      {notePassage}
      &nbsp;&quot;
    </div>
  );
};

NoteVerseText.propTypes = {
  loading: PropTypes.bool.isRequired,
  notePassage: PropTypes.string.isRequired,
};

export default NoteVerseText;
