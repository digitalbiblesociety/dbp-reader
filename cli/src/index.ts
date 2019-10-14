import * as interfaces from "./interfaces";
import * as enums from "./enums";
import fs from "fs";
import { prompt } from "enquirer";

// const fs = require("fs");
// const { prompt } = require("enquirer");

const getThemeType = async (existingThemes: enums.EThemeTypes[]) => {
  const { type } = await prompt({
    type: "select",
    name: "type",
    message: "What theme are you adding?",
    choices: ["default", "light", "dark"]
  });
  console.log("type", type);

  if (existingThemes.includes(type)) {
    // You can't have more than one theme of the same type, do you want to replace your existing theme for this type?
    // Statement,
    // Confirm?
    const { yes } = await prompt({
      type: "confirm",
      name: "yes",
      message: `Do you really want to replace your existing ${type} theme?`
    });

    if (yes) {
      return type;
    } else {
      return "";
    }
  }

  return type;
};

const app = async () => {
  console.log("App is running now!");
  const { multipleThemes } = await prompt([
    {
      type: "confirm",
      name: "multipleThemes",
      message:
        "Do you have multiple themes? (If not only the default theme will be used)"
    }
  ]);
  const setThemes: interfaces.ISetThemes = [];
  let currentThemeToSet = "";

  if (multipleThemes) {
    currentThemeToSet = await getThemeType(setThemes);
  }
  // Do you have a dark and light theme?
  const { logoPath } = await prompt([
    {
      type: "input",
      name: "logoPath",
      message: "Where is your logo? (Please provide a complete path)"
    }
  ]);
  // if yes then collect information for dark and light
  console.log("logoPath", logoPath);
  // Take logo path and copy that file to where the logo needs to be
};

app();

module.exports = app;
