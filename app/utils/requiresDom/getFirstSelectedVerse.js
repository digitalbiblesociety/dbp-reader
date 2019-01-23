const getFirstVerse = ({
  target,
  button,
  formattedSourceMain,
  userSettings,
  main,
  getFormattedParentVerse,
  getPlainParentVerseWithoutNumber,
}) => {
  const isFormatted =
    !!formattedSourceMain &&
    (!userSettings.getIn(['toggleOptions', 'readersMode', 'active']) ||
      !userSettings.getIn(['toggleOptions', 'readersMode', 'available'])) &&
    (!userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']) ||
      !userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'available']));

  try {
    // if formatted iterate up the dom looking for data-id
    if (isFormatted) {
      const verseNode = getFormattedParentVerse(target);
      const firstVerseNumber = verseNode
        ? verseNode.attributes['data-id'].value.split('_')[1]
        : '';

      if (button && main.contains(target) && firstVerseNumber) {
        return firstVerseNumber;
      }
    } else if (!isFormatted) {
      const verseNode = getPlainParentVerseWithoutNumber(target);
      const firstVerseNumber = verseNode
        ? verseNode.attributes['data-verseid'].value
        : '';

      if (button && main.contains(target) && firstVerseNumber) {
        return firstVerseNumber;
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error with getting last verse and opening menu', err); // eslint-disable-line no-console
    }
  }
};

export default getFirstVerse;
