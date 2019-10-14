import * as enums from "./enums";

export interface ISetThemes extends Array<enums.EThemeTypes> {
  [index: number]: enums.EThemeTypes;
}
