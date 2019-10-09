const fs = require("fs");
const { prompt } = require("enquirer");

const app = async () => {
  console.log("App is running now!");
  const { username, password } = await prompt([
    {
      type: "input",
      name: "username",
      message: "What is your username?"
    },
    {
      type: "password",
      name: "password",
      message: "What is your password?"
    }
  ]);
  console.log("username", username);
  console.log("password", password);
};

app();

module.exports = app;
