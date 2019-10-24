import { prompt } from "enquirer";

const confirm = (message: string): Promise<{ yes: boolean }> =>
  prompt({
    type: "confirm",
    name: "yes",
    message
  });

const input = (message: string): Promise<{ value: string }> =>
  prompt({
    type: "input",
    name: "value",
    message
  });

const select = (
  message: string,
  choices: string[]
): Promise<{ choice: string }> =>
  prompt({
    type: "select",
    name: "choice",
    message,
    choices
  });

export const prompts = {
  prompt,
  confirm,
  input,
  select
};
