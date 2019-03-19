import request from './request';
import getUrl from './hrefLinkOrAsLink';
import getBookMetaData from './getBookMetaData';
import getFirstChapterReference from './getFirstChapterReference';

export const getVersionForLanguage = async ({
  languageCode,
  activeBookId,
  activeChapter,
}) => {
  const requestUrl = `${process.env.BASE_API_ROUTE}/bibles?asset_id=${
    process.env.DBP_BUCKET_ID
  },dbp-vid&key=${process.env.DBP_API_KEY}&language_code=${languageCode}&v=4`;

  try {
    const response = await request(requestUrl);
    // Only need first index since there is only one reported bible in this source
    const bible = response.data.map((bibleObject) => ({
      ...bibleObject,
      filesets: Object.values(bibleObject.filesets).reduce(
        (allFilesets, currentFilesets) => [...allFilesets, ...currentFilesets],
        [],
      ),
    }))[0];
    const hasAudio = bible.filesets.some(
      (set) => set.type === 'audio_drama' || set.type === 'audio',
    );
    const hasVideo = bible.filesets.some((set) => set.type === 'video_stream');
    // If there is audio then try to default to drama
    // Otherwise use plain audio
    const audioType =
      hasAudio && bible.filesets.some((set) => set.type === 'audio_drama')
        ? 'audio_drama'
        : 'audio';
    let versionHref = getUrl({
      textId: bible.abbr,
      bookId: activeBookId,
      chapter: activeChapter,
      audioType,
      isHref: true,
    });
    let versionAs = getUrl({
      textId: bible.abbr,
      bookId: activeBookId,
      chapter: activeChapter,
      audioType,
      isHref: false,
    });

    if (!JSON.parse(sessionStorage.getItem('bible_is_maintain_location'))) {
      // Find url and push that one
      const [filteredMetadata, allMetadata] = await getBookMetaData({
        idsForBookMetadata: bible.filesets.map((set) => [set.type, set.id]),
      });

      const bookChapterUrl = getFirstChapterReference(
        bible.filesets,
        hasVideo,
        allMetadata,
        filteredMetadata,
        audioType,
      );

      // Need to parse out the bookChapterUrl to create the href version for the server
      // Safe to access 0th element for \w of match since it always returns a string
      const bookId = bookChapterUrl.match(/\w*/)[0]; // Get first word which is bookId
      const chapterId = bookChapterUrl.match(/\/\w*/)[0].slice(1); // get second part of url
      const query =
        bookChapterUrl.match(/\?.*/) &&
        bookChapterUrl.match(/\?.*/)[0].replace('?', '&'); // Get any query params at the end

      // Set href and as to correct place
      versionHref = `/app?bibleId=${
        bible.abbr
      }&bookId=${bookId}&chapter=${chapterId}${query}`;
      versionAs = `/bible/${bible.abbr}/${bookChapterUrl}`;
    }

    return { versionHref, versionAs };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err); // eslint-disable-line no-console
    }
    return { versionHref: '', versionAs: '' };
  }
};
