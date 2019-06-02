import request from './request';

/**
 * @param {String} filesetId
 * @param {String} bookId
 * @param {Number} chapter
 * @param {String} videoAssetId
 */

export default async (filesetId, bookId, chapter, videoAssetId) => {
  if (!filesetId) return false;

  const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${filesetId}/books?key=${
    process.env.DBP_API_KEY
  }&asset_id=${videoAssetId}&fileset_type=video_stream&v=4`;

  try {
    const res = await request(reqUrl);

    if (res.data) {
      const hasVideo = !!res.data.filter((stream) => stream.book_id === bookId && stream.chapters.includes(chapter))
        .length;

      return hasVideo;
    }
    return false;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Error checking for context', err); // eslint-disable-line no-console
    }
    return false;
  }
};
