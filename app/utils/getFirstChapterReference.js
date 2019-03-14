import getFirstMatchingChapter from './getFirstMatchingChapter';

// Logic for determining version default url
/** For each call scenario below use the first common book/chapter between the two filesets
 * 1. If has a video fileset pick the first book of that fileset
 * 2. If has fileset with size=NT && type=[audio, audio_drama] and fileset with size=NT type=[text_plain, text_format]
 * 3. If has fileset with size=OT && type=[audio, audio_drama] and fileset with size=OT type=[text_plain, text_format]
 * 4. If has fileset with size=NT && type=[audio, audio_drama]
 * 5. If has fileset with size=OT && type=[audio, audio_drama]
 * 6. If has fileset with size=NT && type=[text_plain, text_format]
 * 7. If has fileset with size=OT && type=[text_plain, text_format]
 */

const getFirstChapterReference = (
  filesets,
  hasVideo,
  bookMetaResponse,
  bookMetaData,
  audioParam,
) => {
  const hasOtAudio = filesets.some(
    (fileset) =>
      (fileset.size === 'OT' || fileset.size === 'OTP') &&
      (fileset.type === 'audio' || fileset.type === 'audio_drama'),
  );
  const hasNtAudio = filesets.some(
    (fileset) =>
      (fileset.size === 'NT' || fileset.size === 'NTP') &&
      (fileset.type === 'audio' || fileset.type === 'audio_drama'),
  );
  const hasOtText = filesets.some(
    (fileset) =>
      (fileset.size === 'OT' ||
        fileset.size === 'OTP' ||
        fileset.size === 'C') &&
      (fileset.type === 'text_plain' || fileset.type === 'text_format'),
  );
  const hasNtText = filesets.some(
    (fileset) =>
      (fileset.size === 'NT' ||
        fileset.size === 'NTP' ||
        fileset.size === 'C') &&
      (fileset.type === 'text_plain' || fileset.type === 'text_format'),
  );
  let reference = '';

  if (hasVideo) {
    const video = filesets.find((fileset) => fileset.type === 'video_stream');
    const videoBooks = bookMetaResponse.find(
      (filesetObject) => filesetObject[video.id],
    );

    reference = `${videoBooks[video.id][0].book_id}/${
      videoBooks[video.id][0].chapters[0] >= 0
        ? videoBooks[video.id][0].chapters[0]
        : '1'
    }`;
  } else if (hasNtText && hasNtAudio) {
    const audioDrama = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'NTP') &&
        fileset.type === 'audio_drama',
    );
    const audio = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'NTP') &&
        fileset.type === 'audio',
    );
    const textFormat = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'C') &&
        fileset.type === 'text_format',
    );
    const textPlain = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'C') &&
        fileset.type === 'text_plain',
    );

    const audioBooks = bookMetaResponse.find(
      (filesetObject) =>
        audioDrama ? filesetObject[audioDrama.id] : filesetObject[audio.id],
    );
    const textBooks = bookMetaResponse.find(
      (filesetObject) =>
        textFormat ? filesetObject[textFormat.id] : filesetObject[textPlain.id],
    );

    reference = getFirstMatchingChapter(textBooks, audioBooks);
  } else if (hasOtText && hasOtAudio) {
    // Handles getting the book/chapter that has both text and audio in the Old Testament
    const audioDrama = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' || fileset.size === 'OTP') &&
        fileset.type === 'audio_drama',
    );
    const audio = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' || fileset.size === 'OTP') &&
        fileset.type === 'audio',
    );
    const textFormat = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' ||
          fileset.size === 'OTP' ||
          fileset.size === 'C') &&
        fileset.type === 'text_format',
    );
    const textPlain = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' ||
          fileset.size === 'OTP' ||
          fileset.size === 'C') &&
        fileset.type === 'text_plain',
    );

    const audioBooks = bookMetaResponse.find(
      (filesetObject) =>
        audioDrama ? filesetObject[audioDrama.id] : filesetObject[audio.id],
    );
    const textBooks = bookMetaResponse.find(
      (filesetObject) =>
        textFormat ? filesetObject[textFormat.id] : filesetObject[textPlain.id],
    );

    reference = getFirstMatchingChapter(textBooks, audioBooks);
  } else if (hasNtAudio) {
    // Gets book/chapter for just audio in the New Testament
    const audioDrama = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'NTP') &&
        fileset.type === 'audio_drama',
    );
    const audio = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'NTP') &&
        fileset.type === 'audio',
    );
    const audioId = audioDrama ? audioDrama.id : audio.id;

    const audioBooks = bookMetaResponse.find(
      (filesetObject) => filesetObject[audioId],
    );

    reference = `${audioBooks[audioId][0].book_id}/${
      audioBooks[audioId][0].chapters[0] >= 0
        ? audioBooks[audioId][0].chapters[0]
        : '1'
    }`;
  } else if (hasOtAudio) {
    // Gets book/chapter for just audio in the Old Testament
    const audioDrama = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' || fileset.size === 'OTP') &&
        fileset.type === 'audio_drama',
    );
    const audio = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' || fileset.size === 'OTP') &&
        fileset.type === 'audio',
    );
    const audioId = audioDrama ? audioDrama.id : audio.id;

    const audioBooks = bookMetaResponse.find(
      (filesetObject) => filesetObject[audioId],
    );

    // Gets first book id and first chapter number from that book
    reference = `${audioBooks[audioId][0].book_id}/${
      audioBooks[audioId][0].chapters[0] >= 0
        ? audioBooks[audioId][0].chapters[0]
        : '1'
    }`;
  } else if (hasNtText) {
    // Gets book/chapter for just text in the New Testament
    const textFormat = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'C') &&
        fileset.type === 'text_format',
    );
    const textPlain = filesets.find(
      (fileset) =>
        (fileset.size === 'NT' || fileset.size === 'C') &&
        fileset.type === 'text_plain',
    );
    const textId = textFormat ? textFormat.id : textPlain.id;

    const textBooks = bookMetaResponse.find(
      (filesetObject) => filesetObject[textId],
    );

    // Gets first book id and first chapter number from that book
    reference = `${textBooks[textId][0].book_id}/${
      textBooks[textId][0].chapters[0] >= 0
        ? textBooks[textId][0].chapters[0]
        : '1'
    }`;
  } else if (hasOtText) {
    // Gets book/chapter for just text in the Old Testament
    const textFormat = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' ||
          fileset.size === 'OTP' ||
          fileset.size === 'C') &&
        fileset.type === 'text_format',
    );
    const textPlain = filesets.find(
      (fileset) =>
        (fileset.size === 'OT' ||
          fileset.size === 'OTP' ||
          fileset.size === 'C') &&
        fileset.type === 'text_plain',
    );
    const textId = textFormat ? textFormat.id : textPlain.id;

    const textBooks = bookMetaResponse.find(
      (filesetObject) => filesetObject[textId],
    );

    // Gets first book id and first chapter number from that book
    reference = `${textBooks[textId][0].book_id}/${
      textBooks[textId][0].chapters[0] >= 0
        ? textBooks[textId][0].chapters[0]
        : '1'
    }`;
  } else {
    // Default to first book/chapter available
    reference = `${bookMetaData[0].book_id}/${
      bookMetaData[0].chapters[0] >= 0 ? bookMetaData[0].chapters[0] : '1'
    }`;
  }

  return audioParam ? `${reference}?audio_type=${audioParam}` : reference;
};

export default getFirstChapterReference;
