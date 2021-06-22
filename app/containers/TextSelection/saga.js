import { takeLatest, call, fork, put } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import cachedFetch from '../../utils/cachedFetch';
import territoryCodes from '../../utils/territoryCodes.json';
import request from '../../utils/request';
import {
  GET_COUNTRIES,
  GET_DPB_TEXTS,
  GET_LANGUAGES,
  ERROR_GETTING_LANGUAGES,
  ERROR_GETTING_VERSIONS,
  CLEAR_ERROR_GETTING_VERSIONS,
  CLEAR_ERROR_GETTING_LANGUAGES,
  LOAD_COUNTRIES_ERROR,
} from './constants';
import { loadTexts, loadCountries, setLanguages } from './actions';

const oneDay = 1000 * 60 * 60 * 24;

export function* getCountries() {
  const requestUrl = `${process.env.BASE_API_ROUTE}/countries?key=${
    process.env.DBP_API_KEY
  }&v=4&has_filesets=true&include_languages=true`;

  try {
    const response = yield call(cachedFetch, requestUrl, {}, oneDay);
    const countriesObject = response.data.reduce((acc, country) => {
      const tempObj = acc;
      if (typeof country.name !== 'string') {
        tempObj[country.name.name] = { ...country, name: country.name.name };
      } else if (country.name === '' || territoryCodes[country.codes.iso_a2]) {
        return acc;
      } else {
        tempObj[country.name] = country;
      }
      return tempObj;
    }, {});
    countriesObject.ANY = {
      name: 'ANY',
      languages: { ANY: 'ANY' },
      codes: { iso_a2: 'ANY' },
    };
    const countries = fromJS(countriesObject)
      .filter((c) => c.get('name'))
      .sort((a, b) => {
        if (a.get('name') === 'ANY') {
          return -1;
        } else if (a.get('name') > b.get('name')) {
          return 1;
        } else if (a.get('name') < b.get('name')) {
          return -1;
        }
        return 0;
      });

    yield put(loadCountries({ countries }));
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err); // eslint-disable-line no-console
    }
    yield put({ type: LOAD_COUNTRIES_ERROR });
  }
}

export function* getTexts({ languageCode, languageIso }) {
  const requestUrl = `${process.env.BASE_API_ROUTE}/bibles?key=${
    process.env.DBP_API_KEY
  }&language_code=${languageCode}&v=4`;
  const jesusFilmUrl = `${
    process.env.BASE_API_ROUTE
  }/arclight/jesus-film/languages?key=${
    process.env.DBP_API_KEY
  }&v=4&iso=${languageIso}`;
  // Put logic here for determining what url to direct to when user chooses new version
  // Benefits are that all the information can be gathered up front and behind a clear
  // loading spinner
  // Negatives are that the list of versions would take longer to load
  // Assigning results from Jesus Film requests to variable so the requests can be in separate try/catch blocks
  let jesusFilm;

  try {
    const jesusResponse = yield call(request, jesusFilmUrl);

    if (jesusResponse && jesusResponse[languageIso]) {
      jesusFilm = {
        abbr: 'Jesus Film',
        name: 'Jesus Film',
        vname: 'Jesus Film',
        iso: languageIso,
        language_id: languageCode,
        jesusFilm: true,
        filesets: {
          'dbp-vid': [
            {
              id: jesusResponse[languageIso],
              jesusFilm: true,
              type: 'video_stream',
              size: 'NTP',
            },
          ],
        },
      };
    }
    // 'https://api-dev.dbp4.org/arclight/jesus-film/languages?v=4&key=2024ce0fdb44517f53a2c255b3cd66f8' find arclight_id based on iso
    // ('https://api-dev.dbp4.org/arclight/jesus-film?v=4&key=2024ce0fdb44517f53a2c255b3cd66f8&arclight_id=20538'); get m3u8
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Trouble with Jesus Films', error); // eslint-disable-line no-console
    }
  }

  try {
    const response = yield call(request, requestUrl);

    const texts = response.data.filter(
      (text) =>
        text.iso &&
        text.abbr &&
        (text.filesets[process.env.DBP_BUCKET_ID] &&
          text.filesets[process.env.DBP_BUCKET_ID].find(
            (f) =>
              f.type === 'audio' ||
              f.type === 'audio_drama' ||
              f.type === 'text_plain' ||
              f.type === 'text_format',
          )),
    );
    // Create map of videos for constant time lookup when iterating through the texts
    const types = {
      audio: true,
      audio_drama: true,
      text_plain: true,
      text_format: true,
      video_stream: true,
    };
    // If there is a Jesus film then add it to the array of Bibles
    const combinedTexts = jesusFilm
      ? [...texts, jesusFilm]
      : [...texts];
    const mappedTexts = combinedTexts.map((resource) => ({
      ...resource,
      hasVideo: !!(
        resource.filesets['dbp-vid'] && resource.filesets['dbp-vid'].length
      ),
      filesets: Object.values(resource.filesets)
        .reduce((all, current) => [...all, ...current])
        .filter((value) => types[value.type]),
    }));

    yield put({ type: CLEAR_ERROR_GETTING_VERSIONS });
    yield put(loadTexts({ texts: mappedTexts }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error); // eslint-disable-line no-console
    }

    yield put({ type: ERROR_GETTING_VERSIONS });
  }
}

export function* getLanguages() {
  const requestUrl = `${process.env.BASE_API_ROUTE}/languages?key=${
    process.env.DBP_API_KEY
  }&v=4&has_filesets=true`;

  try {
    const response = yield call(cachedFetch, requestUrl, {}, oneDay);
    // Sometimes the api returns an array and sometimes an object with the data key
    const languages = response.data || response;

    yield put(setLanguages({ languages }));
    yield put({ type: CLEAR_ERROR_GETTING_LANGUAGES });
    yield fork(getLanguageAltNames);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error); // eslint-disable-line no-console
    }
    yield put({ type: ERROR_GETTING_LANGUAGES });
  }
}

function sortLanguagesByVname(a, b) {
  if (a.vernacular_name && b.vernacular_name && String.localeCompare) {
    return a.vernacular_name.localeCompare(b.vernacular_name);
  }

  if (a.vernacular_name > b.vernacular_name) return 1;
  if (a.vernacular_name < b.vernacular_name) return -1;
  return 0;
}
// Second call for the more robust language data
export function* getLanguageAltNames() {
  const requestUrl = `${process.env.BASE_API_ROUTE}/languages?key=${
    process.env.DBP_API_KEY
  }&v=4&has_filesets=true&include_alt_names=true`;
  try {
    const response = yield call(cachedFetch, requestUrl, {}, oneDay);
    const languageData = response.data || response;
    const languages = languageData
      .map((l) => {
        if (l.translations) {
          const altSet = new Set(
            Object.values(l.translations).reduce((a, c) => [...a, c], []),
          );
          return {
            ...l,
            vernacular_name: l.autonym || l.name,
            alt_names: Array.from(altSet),
            englishName: l.name,
          };
        }
        return {
          ...l,
          alt_names: [],
          vernacular_name: l.autonym || l.name,
          englishName: l.name,
        };
      })
      .sort(sortLanguagesByVname);

    yield put(setLanguages({ languages }));
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(err); // eslint-disable-line no-console
    }
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(GET_DPB_TEXTS, getTexts);
  yield takeLatest(GET_LANGUAGES, getLanguages);
  yield takeLatest(GET_COUNTRIES, getCountries);
}
