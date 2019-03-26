import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import request from '../app/utils/request';

// Basic nav
// Basic footer
// Video Player with adjusted styles
const JesusFilm = ({ iso, routeLocation, hlsStream }) => {
  const titleText = `Jesus Film ${iso} | Bible.is`;

  return (
    <div>
      <Head>
        <meta name={'description'} content={titleText} />
        <meta property={'og:title'} content={titleText} />
        <meta
          property={'og:image'}
          content={`${process.env.BASE_SITE_URL}/static/icon-310x310.png`}
        />
        <meta property={'og:image:width'} content={310} />
        <meta property={'og:image:height'} content={310} />
        <meta
          property={'og:url'}
          content={`${process.env.BASE_SITE_URL}/${routeLocation}`}
        />
        <meta property={'og:description'} content={titleText} />
        <meta name={'twitter:title'} content={titleText} />
        <meta name={'twitter:description'} content={titleText} />
        <title>{titleText}</title>
      </Head>
      <span style={{ color: 'black' }}>
        This is the Jesus Film Page with ISO: {iso} and location:{' '}
        {routeLocation}
      </span>
      <pre />
      <code>{hlsStream}</code>
      <div className="footer-background" />
    </div>
  );
};

JesusFilm.getInitialProps = async (context) => {
  const routeLocation = context.asPath;
  const { iso } = context.query;
  const jfResponse = await request(
    `${process.env.BASE_API_ROUTE}/arclight/jesus-film/languages?key=${
      process.env.DBP_API_KEY
    }&v=4&iso=${iso}`,
  );
  const arclightId = jfResponse[iso];
  const hlsStream = arclightId
    ? `${process.env.BASE_API_ROUTE}/arclight/jesus-film?key=${
        process.env.DBP_API_KEY
      }&v=4&arclightId=${arclightId}`
    : '';

  return {
    routeLocation,
    iso,
    hlsStream,
  };
};

JesusFilm.propTypes = {
  iso: PropTypes.string,
  routeLocation: PropTypes.string,
  hlsStream: PropTypes.string,
};

export default JesusFilm;
