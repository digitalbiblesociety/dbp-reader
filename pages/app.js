/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

/*
* Todo: Items that need to be done before production
* todo: Replace all tabIndex 0 values with what they should actually be
* todo: Set up a function to init all of the plugins that rely on the browser
* todo: Update site url to match the live site domain name
* todo: Use cookies instead of session and local storage for all user settings (involves user approval before it can be utilized)
* todo: Remove the script for providing feedback
* */
// Needed for redux-saga es6 generator support
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import cachedFetch, { overrideCache } from '../app/utils/cachedFetch';
import HomePage from '../app/containers/HomePage';
import getinitialChapterData from '../app/utils/getInitialChapterData';
import {
  setChapterTextLoadingState,
  setUA,
} from '../app/containers/HomePage/actions';
import svg4everybody from '../app/utils/svgPolyfill';
import removeDuplicates from '../app/utils/removeDuplicateObjects';
import parseCookie from '../app/utils/parseCookie';
import getFirstChapterReference from '../app/utils/getFirstChapterReference';
import isUserAgentInternetExplorer from '../app/utils/isUserAgentInternetExplorer';
import reconcilePersistedState from '../app/utils/reconcilePersistedState';
import REDUX_PERSIST from '../app/utils/reduxPersist';

class AppContainer extends React.Component {
  static displayName = 'Main app';

  // eslint-disable-line no-undef
  componentDidMount() {
    if (
      localStorage.getItem('reducerVersion') !== REDUX_PERSIST.reducerVersion
    ) {
      reconcilePersistedState(
        ['settings', 'searchContainer', 'profile'],
        REDUX_PERSIST.reducerKey,
      );
      localStorage.setItem('reducerVersion', REDUX_PERSIST.reducerVersion);
    }
    // If the page was served from the server then I need to cache the data for this route
    if (this.props.isFromServer) {
      this.props.fetchedUrls.forEach((url) => {
        if (url.data.error || url.data.errors) {
          overrideCache(url.href, {}, 1);
        } else {
          overrideCache(url.href, url.data);
        }
      });
    }

    // If undefined gets stored in local storage it cannot be parsed so I have to compare strings
    if (this.props.userProfile.userId) {
      this.props.dispatch({
        type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
        profile: {
          userId: this.props.userProfile.userId,
          userAuthenticated: !!this.props.userProfile.userId,
          userProfile: {
            email:
              this.props.userProfile.email ||
              this.props.userProfile.email ||
              '',
            name:
              this.props.userProfile.name || this.props.userProfile.name || '',
            nickname:
              this.props.userProfile.name || this.props.userProfile.name || '',
          },
        },
      });
    }
    const redLetter =
      !!this.props.formattedText &&
      !!(
        this.props.formattedText.includes('class="wj"') ||
        this.props.formattedText.includes("class='wj'")
      );
    this.props.dispatch({
      type: 'GET_INITIAL_ROUTE_STATE_SETTINGS',
      redLetter,
      crossReferences:
        !!this.props.formattedText &&
        !!(
          this.props.formattedText.includes('class="ft"') ||
          this.props.formattedText.includes('class="xt"')
        ),
    });
    this.props.dispatch(setChapterTextLoadingState({ state: false }));

    // Intercept all route changes to ensure that the loading spinner starts
    Router.router.events.on('routeChangeStart', this.handleRouteChange);

    if (this.props.isIe) {
      this.props.dispatch(setUA());
      if (
        typeof svg4everybody === 'function' &&
        typeof window !== 'undefined'
      ) {
        svg4everybody();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formattedText !== this.props.formattedText) {
      const redLetter =
        !!nextProps.formattedText &&
        !!(
          nextProps.formattedText.includes('class="wj"') ||
          nextProps.formattedText.includes("class='wj'")
        );

      this.props.dispatch({
        type: 'GET_INITIAL_ROUTE_STATE_SETTINGS',
        redLetter,
        crossReferences:
          !!nextProps.formattedText &&
          !!(
            nextProps.formattedText.includes('class="ft"') ||
            nextProps.formattedText.includes('class="xt"')
          ),
      });
    }
  }

  componentWillUnmount() {
    Router.router.events.off('routeChangeStart', this.handleRouteChange);
  }

  /* eslint-disable no-undef */
  handleRouteChange = (url) => {
    /* eslint-enable no-undef */
    // Pause audio
    // Start loading spinner for text
    // Close any open menus
    // Remove current audio source - (may fix item 1)
    // TODO: Probably need to get the new highlights here or at least start the process for getting them
    if (typeof dataLayer !== 'undefined') {
      try {
        dataLayer.push({
          event: 'pageview',
          page: {
            path: url,
            title: url,
          },
        });
      } catch (err) {
        console.error('Google tag manager did not capture pageview: ', err); // eslint-disable-line no-console
      }
    }
    this.props.dispatch(setChapterTextLoadingState({ state: true }));
  };

  routerWasUpdated = false; // eslint-disable-line no-undef

  render() {
    const {
      activeChapter,
      chapterText,
      activeBookName,
      routeLocation,
      initialPlaybackRate,
      initialVolume,
      isIe,
    } = this.props;
    // Defaulting description text to an empty string since no metadata is better than inaccurate metadata
    const descriptionText =
      chapterText && chapterText[0] ? `${chapterText[0].verse_text}...` : '';

    return (
      <div>
        <Head>
          <meta name={'description'} content={descriptionText} />
          <meta
            property={'og:title'}
            content={`${activeBookName} ${activeChapter}${
              this.props.match.params.verse
                ? `:${this.props.match.params.verse}`
                : ''
            } | Bible.is`}
          />
          <meta
            property={'og:image'}
            content={'https://listen.dbp4.org/static/icon-310x310.png'}
          />
          <meta property={'og:image:width'} content={310} />
          <meta property={'og:image:height'} content={310} />
          <meta
            property={'og:url'}
            content={`https://listen.dbp4.org/${routeLocation}`}
          />
          <meta property={'og:description'} content={descriptionText} />
          <meta
            name={'twitter:title'}
            content={`${activeBookName} ${activeChapter}`}
          />
          <meta name={'twitter:description'} content={descriptionText} />
          <title>
            {`${activeBookName} ${activeChapter}${
              this.props.match.params.verse
                ? `:${this.props.match.params.verse}`
                : ''
            }`}{' '}
            | Bible.is
          </title>
        </Head>
        <HomePage
          initialPlaybackRate={initialPlaybackRate}
          initialVolume={initialVolume}
          isIe={isIe}
        />
      </div>
    );
  }
}

AppContainer.getInitialProps = async (context) => {
  const { req, res: serverRes } = context;
  const routeLocation = context.asPath;
  const {
    bookId = '',
    chapter: chapterParam,
    bibleId = 'ENGESV',
    verse,
    token,
    userId: reqUserId,
    userEmail = '',
    userName = '',
  } = context.query;
  const userProfile = {
    userId,
    email: userEmail,
    name: userName,
    nickname: userName,
  };
  const tempChapter =
    typeof chapterParam === 'string' && chapterParam.split('?')[0];
  const chapter = tempChapter || chapter;
  // Using let here because the cookie data can come from the server or the client
  let audioParam = req && req.query.audio_type;
  let userId = reqUserId || '';
  let hasVideo = false;
  let isFromServer = true;
  let isAuthenticated = false;
  let initialVolume = 1;
  let initialPlaybackRate = 1;
  let isIe = false;
  let audioType = '';

  if (req && req.query.audio_type) {
    audioParam = req.query.audio_type;
  } else if (!req && typeof window !== 'undefined') {
    const audioParameterKeyPair = window.location.search
      .slice(1)
      .split('&')
      .map((key) => key.split('='))
      .find((key) => key[0] === 'audio_type');
    audioParam = audioParameterKeyPair && audioParameterKeyPair[1];
  }

  if (req && req.headers) {
    isIe = isUserAgentInternetExplorer(req.headers['user-agent']);
  } else {
    isIe = isUserAgentInternetExplorer(navigator.userAgent);
  }

  if (req && req.headers.cookie) {
    // Get all cookies that the page needs
    const cookieData = parseCookie(req.headers.cookie);
    if (cookieData.bible_is_audio_type) {
      audioType = cookieData.bible_is_audio_type;
    }

    if (userId) {
      // Authentication Information
      isAuthenticated = !!userId;
      // User Profile
      userProfile.email = userEmail;
      userProfile.nickname = userName;
      userProfile.name = userName;
      userProfile.userId = userId;
      // Avatar is a placeholder for when we actually build the rest of that functionality
      userProfile.avatar = '';
    } else if (!userId) {
      // Authentication Information
      userId = cookieData.bible_is_user_id || '';
      isAuthenticated = !!cookieData.bible_is_user_id;
      // User Profile
      userProfile.email = cookieData.bible_is_email || '';
      userProfile.nickname = cookieData.bible_is_name || '';
      userProfile.name = cookieData.bible_is_name;
      // Avatar is a placeholder for when we actually build the rest of that functionality
      userProfile.avatar = '';
    }

    // Audio Player
    initialVolume =
      cookieData.bible_is_volume === 0 ? 0 : cookieData.bible_is_volume || 1;
    initialPlaybackRate = cookieData.bible_is_playbackrate || 1;

    // Handle oauth code if there is one
    if (cookieData.bible_is_cb_code && cookieData.bible_is_provider) {
      await fetch(
        `${process.env.BASE_API_ROUTE}/login/${
          cookieData.bible_is_provider
        }/callback?v=4&project_id=${process.env.NOTES_PROJECT_ID}&key=${
          process.env.DBP_API_KEY
        }&alt_url=true&code=${cookieData.bible_is_cb_code}`,
      ).then((body) => body.json());
    }

    isFromServer = false;
  } else if (typeof document !== 'undefined' && document.cookie) {
    const cookieData = parseCookie(document.cookie);
    if (cookieData.bible_is_audio_type) {
      audioType = cookieData.bible_is_audio_type;
    }

    if (userId) {
      setUserInfo({ userId, userEmail, userName });
      // Authentication Information
      isAuthenticated = !!userId;
      // User Profile
      userProfile.email = userEmail;
      userProfile.nickname = userName;
      userProfile.name = userName;
      userProfile.userId = userId;
      // Avatar is a placeholder for when we actually build the rest of that functionality
      userProfile.avatar = '';
    } else if (!userId) {
      // Authentication Information
      userId = localStorage.getItem('bible_is_user_id') || '';
      isAuthenticated = !!localStorage.getItem('bible_is_user_id') || '';
      // User Profile
      userProfile.email = localStorage.getItem('bible_is_user_email') || '';
      userProfile.nickname = localStorage.getItem('bible_is_user_name') || '';
      userProfile.name = localStorage.getItem('bible_is_user_nickname');
      userProfile.userId = userId;
      // Avatar is a placeholder for when we actually build the rest of that functionality
      userProfile.avatar = '';
    }

    // Audio Player
    initialVolume =
      cookieData.bible_is_volume === 0 ? 0 : cookieData.bible_is_volume || 1;
    initialPlaybackRate = cookieData.bible_is_playbackrate || 1;
  }

  const singleBibleUrl = `${
    process.env.BASE_API_ROUTE
  }/bibles/${bibleId}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
    process.env.DBP_API_KEY
  }&v=4`;

  // Get active bible data
  const singleBibleRes = await cachedFetch(singleBibleUrl).catch((e) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in get initial props single bible: ', e.message); // eslint-disable-line no-console
    }
    return { data: {} };
  });

  const singleBibleJson = singleBibleRes; // Not sure why I did this, probably should remove
  const bible = singleBibleJson.data || {};
  // Acceptable fileset types that the site is capable of ingesting and displaying
  const setTypes = {
    audio_drama: true,
    audio: true,
    text_plain: true,
    text_format: true,
    video_stream: true,
  };
  // Filter out gideon bibles because the api will never be fixed in this area... -_- :( :'( ;'(
  // Filters out the filesets that should be filtered by the api
  // Gets only one of the text_plain or text_format filesets (These are identical if they both occur)
  const activeFilesetId =
    bible && bible.filesets && bible.filesets[process.env.DBP_BUCKET_ID]
      ? bible.filesets[process.env.DBP_BUCKET_ID]
          .filter(
            (f) =>
              !f.id.includes('GID') &&
              f.id.slice(-4 !== 'DA16') &&
              (f.type === 'text_plain' || f.type === 'text_format'),
          )
          .reduce((a, c) => c.id, '')
      : '';
  let filesets = [];

  if (
    bible &&
    bible.filesets &&
    bible.filesets[process.env.DBP_BUCKET_ID] &&
    bible.filesets['dbp-vid']
  ) {
    hasVideo = true;
    filesets = [
      ...bible.filesets[process.env.DBP_BUCKET_ID],
      ...bible.filesets['dbp-vid'],
    ].filter(
      (file) =>
        (!file.id.includes('GID') &&
          file.id.slice(-4) !== 'DA16' &&
          setTypes[file.type] &&
          file.size !== 'S' &&
          bible.filesets[process.env.DBP_BUCKET_ID].length > 1) ||
        bible.filesets[process.env.DBP_BUCKET_ID].length === 1,
    );
  } else if (
    bible &&
    bible.filesets &&
    bible.filesets[process.env.DBP_BUCKET_ID]
  ) {
    filesets = bible.filesets[process.env.DBP_BUCKET_ID].filter(
      (file) =>
        (!file.id.includes('GID') &&
          file.id.slice(-4) !== 'DA16' &&
          setTypes[file.type] &&
          file.size !== 'S' &&
          bible.filesets[process.env.DBP_BUCKET_ID].length > 1) ||
        bible.filesets[process.env.DBP_BUCKET_ID].length === 1,
    );
  }

  const formattedFilesetIds = [];
  const plainFilesetIds = [];
  const idsForBookMetadata = [];
  // Separate filesets by type
  filesets.forEach((set) => {
    if (set.type === 'text_format') {
      formattedFilesetIds.push(set.id);
    } else if (set.type === 'text_plain') {
      plainFilesetIds.push(set.id);
    }
    // Gets one id for each fileset type
    idsForBookMetadata.push([set.type, set.id]);
  });

  const bookMetaPromises = idsForBookMetadata.map(async (filesetTuple) => {
    const url = `${process.env.BASE_API_ROUTE}/bibles/filesets/${
      filesetTuple[1]
    }/books?v=4&key=${process.env.DBP_API_KEY}&asset_id=${
      filesetTuple[0] === 'video_stream' ? 'dbp-vid' : process.env.DBP_BUCKET_ID
    }&fileset_type=${filesetTuple[0]}`;
    const res = await cachedFetch(url);

    return { [filesetTuple[1]]: res.data } || [];
  });
  const bookMetaResponse = await Promise.all(bookMetaPromises);

  const bookMetaData = removeDuplicates(
    bookMetaResponse.slice().reduce((reducedObjects, filesetObject) => {
      if (Object.values(filesetObject) && Object.values(filesetObject)[0]) {
        return [...reducedObjects, ...Object.values(filesetObject)[0]];
      }
      return reducedObjects;
    }, []),
    'book_id',
  ).sort((a, b) => a.book_order - b.book_order);

  if (audioParam) {
    // If there are any audio filesets with the given type
    if (filesets.some((set) => set.type === audioParam)) {
      audioType = audioParam;
      // Otherwise check for drama first
    } else if (filesets.some((set) => set.type === 'audio_drama')) {
      audioType = 'audio_drama';
      audioParam = '';
      // Lastly check for plain audio
    } else if (filesets.some((set) => set.type === 'audio')) {
      audioType = 'audio';
      audioParam = '';
    }
  }

  // Redirect to the new url if conditions are met
  if (bookMetaData && bookMetaData.length) {
    const foundBook = bookMetaData.find(
      (book) => bookId && book.book_id === bookId.toUpperCase(),
    );
    const foundChapter =
      foundBook &&
      foundBook.chapters.find((c) => chapter && c === parseInt(chapter, 10));
    // Handles getting the book/chapter that follows Jon Stearley's methodology
    const bookChapterRoute = getFirstChapterReference(
      filesets,
      hasVideo,
      bookMetaResponse,
      bookMetaData,
      audioParam,
    );

    // If the book wasn't found and chapter wasn't found
    // Go to the first book and first chapter
    const foundBookId = foundBook && foundBook.book_id;
    const foundChapterId =
      foundBook && (foundBook.chapters[0] || foundBook.chapters[0] === 0 || 1);

    /**
     * 1. Visit /bible/bibleId
     */
    if (!foundBook && (!foundChapter && foundChapter !== 0)) {
      // Logs the url that will be redirected to
      if (serverRes) {
        // If there wasn't a book then we need to redirect to mark for video resources and matthew for other resources
        serverRes.writeHead(302, {
          Location: `${req.protocol}://${req.get(
            'host',
          )}/bible/${bibleId}/${bookChapterRoute}`,
        });
        serverRes.end();
      } else {
        Router.push(
          `${window.location.origin}/bible/${bibleId}/${bookChapterRoute}`,
        );
      }
    } else if (foundBook) {
      // if the book was found
      // check for the chapter
      if (!foundChapter && foundChapter !== 0) {
        // if the chapter was not found
        // go to the book and the first chapter for that book
        if (serverRes) {
          serverRes.writeHead(302, {
            Location: `${req.protocol}://${req.get(
              'host',
            )}/bible/${bibleId}/${foundBookId}/${foundChapterId}${
              audioParam ? `?audio_type=${audioParam}` : ''
            }`,
          });
          serverRes.end();
        } else {
          Router.push(
            `${
              window.location.origin
            }/bible/${bibleId}/${foundBookId}/${foundChapterId}${
              audioParam ? `?audio_type=${audioParam}` : ''
            }`,
          );
        }
      }
    }
  }
  // dont change book or chapter
  let initData = {
    plainText: [],
    formattedText: '',
    plainTextJson: {},
    audioPaths: [''],
  };
  try {
    /* eslint-disable no-console */
    initData = await getinitialChapterData({
      filesets,
      bookId,
      chapter,
      plainFilesetIds,
      formattedFilesetIds,
      audioType,
    }).catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `Error caught in get initial chapter data in promise: ${err.message}`,
        );
      }
      return {
        formattedText: '',
        plainText: [],
        plainTextJson: {},
        audioPaths: [''],
      };
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Error caught in get initial chapter data by try catch: ${err.message}`,
      );
    }
  }
  /* eslint-enable no-console */
  // Get text for chapter
  const chapterText = initData.plainText;

  let activeBook = { chapters: [] };
  const bookData = bookMetaData.length || !bible ? bookMetaData : bible.books;

  if (bookData) {
    const urlBook = bookData.find(
      (book) =>
        book.book_id && book.book_id.toLowerCase() === bookId.toLowerCase(),
    );
    if (urlBook) {
      activeBook = urlBook;
    } else {
      activeBook = bookData[0];
    }
  } else {
    activeBook = undefined;
  }
  const availableAudioTypes = [];
  if (filesets.some((set) => set.type === 'audio_drama')) {
    availableAudioTypes.push('audio_drama');
  }
  if (filesets.some((set) => set.type === 'audio')) {
    availableAudioTypes.push('audio');
  }
  const activeBookName = activeBook ? activeBook.name : '';
  const testaments = bookData
    ? bookData.reduce((a, c) => ({ ...a, [c.book_id]: c.testament }), {})
    : [];
  if (context.reduxStore) {
    if (userProfile.userId && userProfile.email) {
      context.reduxStore.dispatch({
        type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
        profile: {
          userId: userProfile.userId,
          userAuthenticated: !!userProfile.userId,
          userProfile: {
            email: userProfile.email || userProfile.email || '',
            name: userProfile.name || userProfile.name || '',
            nickname: userProfile.name || userProfile.name || '',
          },
        },
      });
    }
    context.reduxStore.dispatch({
      type: 'GET_INITIAL_ROUTE_STATE_HOMEPAGE',
      homepage: {
        userProfile,
        activeFilesetId,
        audioType: audioType || '',
        availableAudioTypes,
        loadingAudio: true,
        hasAudio: false,
        hasVideo,
        chapterText,
        testaments,
        // userSettings,
        formattedSource: initData.formattedText,
        activeFilesets: filesets,
        changingVersion: false,
        books: bookData || [],
        activeChapter: parseInt(chapter, 10) >= 0 ? parseInt(chapter, 10) : 1,
        activeBookName,
        verseNumber: verse,
        activeTextId: bible.abbr || '',
        activeIsoCode: bible.iso || '',
        defaultLanguageIso: bible.iso || 'eng',
        activeLanguageName: bible.language || '',
        activeTextName: bible.vname || bible.name,
        defaultLanguageName: bible.language || 'English',
        defaultLanguageCode: bible.language_id || 6414,
        textDirection: bible.alphabet ? bible.alphabet.direction : 'ltr',
        activeBookId: bookId.toUpperCase() || '',
        userId,
        isIe,
        userAuthenticated: isAuthenticated || false,
        isFromServer,
        match: {
          params: {
            bibleId,
            bookId,
            chapter,
            verse,
            token,
          },
        },
      },
    });
  }

  if (typeof document !== 'undefined') {
    document.cookie = `bible_is_ref_bible_id=${bibleId}`;
    document.cookie = `bible_is_ref_book_id=${bookId}`;
    document.cookie = `bible_is_ref_chapter=${chapter}`;
    document.cookie = `bible_is_ref_verse=${verse}`;
  }

  return {
    initialVolume,
    initialPlaybackRate,
    chapterText,
    testaments,
    audioType: audioType || '',
    formattedText: initData.formattedText,
    books: bookData || [],
    activeChapter: parseInt(chapter, 10) >= 0 ? parseInt(chapter, 10) : 1,
    activeBookName,
    verseNumber: verse,
    activeTextId: bible.abbr,
    activeIsoCode: bible.iso,
    activeLanguageName: bible.language,
    textDirection: bible.alphabet ? bible.alphabet.direction : 'ltr',
    activeFilesets: filesets,
    defaultLanguageIso: bible.iso || 'eng',
    defaultLanguageName: bible.language || 'English',
    defaultLanguageCode: bible.language_id || 6414,
    activeTextName: bible.vname || bible.name,
    activeBookId: bookId.toUpperCase(),
    userProfile,
    userId: userId || '',
    isAuthenticated: isAuthenticated || false,
    isFromServer,
    isIe,
    routeLocation,
    match: {
      params: {
        bibleId,
        bookId,
        chapter,
        verse,
        token,
      },
    },
    fetchedUrls: [],
  };
};

AppContainer.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object,
  userProfile: PropTypes.object,
  chapterText: PropTypes.array,
  fetchedUrls: PropTypes.array,
  isFromServer: PropTypes.bool,
  isIe: PropTypes.bool,
  routeLocation: PropTypes.string,
  activeBookName: PropTypes.string,
  formattedText: PropTypes.string,
  activeChapter: PropTypes.number,
  initialVolume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  initialPlaybackRate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default connect()(AppContainer);
