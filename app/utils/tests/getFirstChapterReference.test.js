import {
  filesets,
  filesets2,
  filesets3,
  filesets4,
  filesets5,
  filesets6,
  filesets7,
  filesets8,
  bookMetaData,
  bookMetaResponse,
} from '../testUtils/chapterReferenceData';
import getFirstChapterReference from '../getFirstChapterReference';

/** For each call scenario below use the first common book/chapter between the two filesets
 * 1. If has a video fileset pick the first book of that fileset
 * 2. If has fileset with size=NT && type=[audio, audio_drama] and fileset with size=NT type=[text_plain, text_format]
 * 3. If has fileset with size=OT && type=[audio, audio_drama] and fileset with size=OT type=[text_plain, text_format]
 * 4. If has fileset with size=NT && type=[audio, audio_drama]
 * 5. If has fileset with size=OT && type=[audio, audio_drama]
 * 6. If has fileset with size=NT && type=[text_plain, text_format]
 * 7. If has fileset with size=OT && type=[text_plain, text_format]
 */
const params = [filesets, true, bookMetaResponse, bookMetaData, 'audio'];
const params2 = [filesets2, false, bookMetaResponse, bookMetaData, 'audio'];
const params3 = [filesets3, false, bookMetaResponse, bookMetaData, 'audio'];
const params4 = [filesets4, false, bookMetaResponse, bookMetaData, 'audio'];
const params5 = [
  filesets5,
  false,
  bookMetaResponse,
  bookMetaData,
  'audio_drama',
];
const params6 = [filesets6, false, bookMetaResponse, bookMetaData, 'audio'];
const params7 = [filesets7, false, bookMetaResponse, bookMetaData, 'audio'];
const params8 = [filesets8, false, bookMetaResponse, bookMetaData, ''];

describe('get first chapter reference utility function', () => {
  it('If has a video fileset pick the first book of that fileset', () => {
    const reference = getFirstChapterReference(...params);
    expect(reference).toEqual('MRK/6?audio_type=audio');
  });
  it('If has fileset with size=NT && type=[audio, audio_drama] and fileset with size=NT type=[text_plain, text_format]', () => {
    const reference = getFirstChapterReference(...params2);
    expect(reference).toEqual('MAT/5?audio_type=audio');
  });
  it('If has fileset with size=OT && type=[audio, audio_drama] and fileset with size=OT type=[text_plain, text_format]', () => {
    const reference = getFirstChapterReference(...params3);
    expect(reference).toEqual('PSA/70?audio_type=audio');
  });
  it('If has fileset with size=NT && type=[audio, audio_drama]', () => {
    const reference = getFirstChapterReference(...params4);
    expect(reference).toEqual('MAT/5?audio_type=audio');
  });
  it('If has fileset with size=OT && type=[audio, audio_drama]', () => {
    const reference = getFirstChapterReference(...params5);
    expect(reference).toEqual('PSA/6?audio_type=audio_drama');
  });
  it('If has fileset with size=NT && type=[text_plain, text_format]', () => {
    const reference = getFirstChapterReference(...params6);
    expect(reference).toEqual('GEN/1?audio_type=audio');
  });
  it('If has fileset with size=OT && type=[text_plain, text_format]', () => {
    const reference = getFirstChapterReference(...params7);
    expect(reference).toEqual('GEN/1?audio_type=audio');
  });
  it('If has fileset with size=OT && type=[text_plain, text_format]', () => {
    const reference = getFirstChapterReference(...params8);
    expect(reference).toEqual('GEN/1');
  });
  it('If there were no filesets', () => {
    const reference = getFirstChapterReference([], false, [], bookMetaData, '');
    expect(reference).toEqual('GEN/1');
  });
});
