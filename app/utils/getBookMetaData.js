import cachedFetch from './cachedFetch';
import removeDuplicates from './removeDuplicateObjects';

export default async ({ idsForBookMetadata }) => {
  // idsForBookMetadata is an array of arrays
  // each child array is structured as [filesetType, filesetId]
  const bookMetaPromises = idsForBookMetadata.map(async (filesetTuple) => {
    const url = `${process.env.BASE_API_ROUTE}/bibles/filesets/${
      filesetTuple[1]
    }/books?v=4&key=${process.env.DBP_API_KEY}&asset_id=${
      filesetTuple[0] === 'video_stream' ? 'dbp-vid' : process.env.DBP_BUCKET_ID
    }&fileset_type=${filesetTuple[0]}`;
    const res = await cachedFetch(url);

    return { [filesetTuple[1]]: res.data } || [];
  });
  const allMetadata = await Promise.all(bookMetaPromises);

  const dataWithoutDuplicates = removeDuplicates(
    allMetadata.slice().reduce((reducedObjects, filesetObject) => {
      if (Object.values(filesetObject) && Object.values(filesetObject)[0]) {
        return [...reducedObjects, ...Object.values(filesetObject)[0]];
      }
      return reducedObjects;
    }, []),
    'book_id',
  ).sort((a, b) => a.book_order - b.book_order);

  // return {
  //   dataWithoutDuplicates,
  //   allMetadata,
  // };
  return [dataWithoutDuplicates, allMetadata];
};
