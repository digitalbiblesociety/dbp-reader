import fs from "fs";
import utils from "util";
import * as interfaces from "./interfaces";
import * as enums from "./enums";
import { prompts } from "./prompts";

const promisify = utils.promisify;
const readFilePromise = promisify(fs.readFile);

const sleep = (ms: number = 500) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

// const fs = require("fs");
// const { prompt } = require("enquirer");

const setTheme = async (theme: enums.EThemeTypes) => {
  try {
  } catch (error) {
    console.error("Error setting the theme", error);
    const { yes } = await prompts.confirm(
      "Do you want to try adding the theme again?"
    );

    if (yes) {
      setTheme(theme);
    }
  }
};

const getThemeType = async (
  existingThemes: enums.EThemeTypes[]
): Promise<enums.EThemeTypes> => {
  const { type } = await prompts.prompt({
    type: "select",
    name: "type",
    message: "What theme are you adding?",
    choices: [
      enums.EThemeTypes.default,
      enums.EThemeTypes.light,
      enums.EThemeTypes.dark
    ]
  });
  console.log("type", type);

  if (existingThemes.includes(type)) {
    // You can't have more than one theme of the same type, do you want to replace your existing theme for this type?
    // Statement,
    // Confirm?
    const { yes } = await prompts.confirm(
      `Do you really want to replace your existing ${type} theme?`
    );

    if (yes) {
      return type;
    } else {
      throw new Error("Tried to set a theme that already existed");
    }
  }

  return type;
};

const app = async () => {
  console.log("App is running now!");
  const { yes: hasMultipleThemes } = await prompts.confirm(
    "Do you have multiple themes? (If not only the default theme will be used)"
  );
  const setThemes: interfaces.ISetThemes = [];
  let currentThemeToSet = enums.EThemeTypes.default;

  if (hasMultipleThemes) {
    try {
      for (let count = 0; count < 3; count++) {
        currentThemeToSet = await getThemeType(setThemes);
        if (currentThemeToSet) {
          setThemes.push(currentThemeToSet);
        }

        await setTheme(currentThemeToSet);
      }
    } catch (err) {
      console.error(err);
      await sleep(300);
      console.log("Continuing program");
      await sleep(300);
    }
  }
  // Do you have a dark and light theme?
  const { value: logoPath } = await prompts.input(
    "Where is your logo? (Please provide a complete path)"
  );
  // if yes then collect information for dark and light
  console.log("logoPath", logoPath);
  // Take logo path and copy that file to where the logo needs to be
};

app();

module.exports = app;
