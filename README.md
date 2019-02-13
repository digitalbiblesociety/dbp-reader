# The Koinos Reader

[![Build Status](https://travis-ci.org/digitalbiblesociety/dbp-reader.svg?branch=master)](https://travis-ci.org/digitalbiblesociety/dbp-reader) [![Coverage Status](https://coveralls.io/repos/github/digitalbiblesociety/dbp-reader/badge.svg)](https://coveralls.io/github/digitalbiblesociety/dbp-reader)

The Koinos Reader is a joint project of the [Digital Bible Society](https://dbs.org)
and [Faith Comes by Hearing](https://faithcomesbyhearing.com).

## QuickStart

- This project requires Node v10 and npm v6.
- If you do not have Node follow the installation instructions here: [Node.js](https://nodejs.org/en/download/).
- Clone the repo:
  - `git clone https://dbsdevs@bitbucket.org/dbsdevs/dbp_4_reader.git`
- Once you have successfully installed Node and cloned the repo run the following
  commands in the root folder of the
  project: - `npm install && npm start`
- Create a file named `.env` in the root of your new project, following the pattern found in sample-env.txt add your own environment variables.
  an example of the variables you will need to set in order to run this locally.
  - You will need to make sure your api key has access to the project and bucket(s) used
- Create a file named `env-config.js` use the template below but replace "YOUR_VAR_1" with your own variables from your .env file:

  ```
  require('dotenv').config();

  module.exports = {
      'process.env': {
          YOUR_VAR_1: JSON.stringify(process.env.YOUR_VAR_1),
          YOUR_VAR_2: JSON.stringify(process.env.YOUR_VAR_2),
          YOUR_API_KEY: JSON.stringify(process.env.YOUR_API_KEY),
      },
  }
  ```

- Now navigate to localhost:3000 to see the development site
- When making changes to the css you need to make sure that you run aws s3 sync ./cdn s3://your_app_name/ and make sure that the app name here matches the one you use in the aws env variable.

## Description

A minimalist bible study application with a focus on flexibility, accessibility, and
portability. It is in many ways the spiritual successor to the bible browser and the
[inScript projects](https://github.com/digitalbiblesociety/).

## Solutions to Potential Issues

If you feel that there are resources being cached you can use the script below
in your developer console to manually clear the cache of api calls.
`Object.keys(localStorage).filter(key => key.slice(0, 7) === 'lscache').forEach(key => localStorage.removeItem(key))`

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
