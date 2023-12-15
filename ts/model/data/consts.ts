import { Name } from "../../types.js";
import { Path } from "../../types.js";

export const PATH: Path = `data`;
export const COMP_EXTENSION: Name = `comp`;

export const BOOKS_PATH: Path = `${PATH}/Books`;

export const INFO_TITLE: Name = `Info`;
export const INFO_EXTENSION: Name = COMP_EXTENSION;
export const INFO_NAME: Name = `${INFO_TITLE}.${INFO_EXTENSION}`;
export const INFO_PATH: Path = `${PATH}/${INFO_NAME}`;
