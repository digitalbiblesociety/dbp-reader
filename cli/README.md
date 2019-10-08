# Getting Started

- Ensure you are under the `./cli` folder from the root of the project
- Run the cli tool with `npm run generate` from either the root of the project or the cli folder

## Goals

1. Enable developers to get up and running with the project quickly
   a. The cli should include prompts for obtaining all the environment variables required by the project
2. Enable developers to easily deploy their generated project to a free hosting platform such as [Heroku](https://www.heroku.com/) or [Zeit](https://zeit.co/)
3. Enable developers to easily deploy to a paid service of their choice
   a. The goal is to support [Google Cloud Platform](https://cloud.google.com), [Amazon Web Services](https://aws.amazon.com) and [Digital Ocean](https://digitalocean.com)
4. Build in such a way that the cli can be the base for a web interface with the purpose of enabling non-technical people to configure and deploy their own version of the app - (Pipe Dream)

## Desired Features

1. Configure logo by pointing to local file
2. Configure colors by pointing to a `.csv` or manually entering
   a. Should support `rgb`, `rgba`, `hex` and `hsl` formats
   b. Should support pointing to a local `.csv` file - (Would be nice to support `.tsv` as well)

3. Configure API Key for the DBP platform
4. Specify versions that are available/permissioned - (Needs to have a sensible default, preferably to a public domain resource)
5. Configure deployment options
6. Configure any remaining environment variables - (things such as social media and such)

## Development Steps

1. Extract project into a \_source folder that can be used by the cli
2. Implement way of prompting users and receiving feedback
3. Use feedback to perform actions on the \_source files in line with achieving project goals
4. Provide feedback to the user if the action they took was successful or not
5. Create a way for the user to progress past or recover from a failure
6. Research tools for auto-deployments to desired services
   a. Make these prompts optional and easy to skip
7. Launch the newly configured project in local browser for user to view their work

## Tech to Use

### Languages/Frameworks

1. Typescript
2. NodeJS

### Services

1. Google Cloud Platform
2. Amazon Web Services
3. Digital Ocean
4. Heroku
5. Zeit
