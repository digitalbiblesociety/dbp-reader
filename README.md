# The Koinos Reader

[![Build Status](https://travis-ci.org/digitalbiblesociety/dbp-reader.svg?branch=master)](https://travis-ci.org/digitalbiblesociety/dbp-reader) [![Coverage Status](https://coveralls.io/repos/github/digitalbiblesociety/dbp-reader/badge.svg)](https://coveralls.io/github/digitalbiblesociety/dbp-reader)

The Koinos Reader is a joint project of the [Digital Bible Society](https://dbs.org)
and [Faith Comes by Hearing](https://faithcomesbyhearing.com).

## QuickStart

- This project requires Node v10 and npm v6.

- If you do not have Node follow the installation instructions here: [Node.js](https://nodejs.org/en/download/).
- Follow the instructions on [Digital Bible Platform](www.dbp4.org) to obtain an api key for the app. _**You will need a valid key for the app to work!**_
- Clone the repository:
  - `git clone https://github.com/digitalbiblesociety/dbp-reader.git`
- Once you have successfully installed Node and cloned the repository run `npm install` to install the required dependencies
- Next follow the steps listed below to update the files to contain your organization specific styles and information
  - Create a `.env` file in the root of your new project, following the pattern found in `sample-env.txt` add your own environment variables
  - Note: You will need to make sure your api key has access to the project and bucket(s) used in your .env file
  - Update the `env-config.js` file to only use the variables from your .env file
  - Update the files under `theme_config` to include your custom colors and organization information
  - Update `./static/light_theme_logo.svg` and `./static/dark_theme_logo.svg` to match your organization's logo
  - Update `./static/manifest.json` to match your url and site theme
- Now run `npm build` followed by `npm start:prod` for the production version of the site
  - Alternatively just run `npm start` for the development site
- Finally navigate to localhost:3000 to see your newly created bible reader!

## Description

A minimalist bible study application with a focus on flexibility, accessibility, and
portability. It is in many ways the spiritual successor to the bible browser and the
[inScript projects](https://github.com/digitalbiblesociety/).

## Goals

- ** Accessibility **
  - The reader is focused on supporting disadvantaged groups especially the blind or
    disabled. Following the recommendation of WAI and ensuring the site is built to be
    compatible with WAI-ARIA 1.1a will ensure that the app is easy to use and navigate
  - The reader will be heavily icon driven but given the limitations of icon-focused
    communication. The reader will also need to be multi-lingual. The driving text for
    web app itself should be translated in the top eight most common gateway languages
  - The reader will be simple and intuitive. Easy to locate settings should exist to
    increase font size for those with poor eyesight. It will also be possible for the
    users to adjust the playing speed of audio for new speakers and language learners
- ** Robust **
  - The Reader will be fully backed by a series of tests to ensure smooth operations
    across multiple platforms with focus for eventual deployment as a react native app
  - The reader should leverage service workers and support some offline capabilities
  - The reader will use promises and load content asynchronously whenever it is wise
- ** Multipurpose **

  - The Reader will be built with the intention of porting it over to mobile devices
    via the implementation of [React Native](https://facebook.github.io/react-native/)
  - The Reader will contain components to be re-used for a few partners like gideons
  - The Reader will contain components for bible dictionaries for study and research
