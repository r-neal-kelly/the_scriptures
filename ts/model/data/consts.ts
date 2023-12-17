import { Count } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

export const PATH: Path = `data`;

export const COMP_EXTENSION: Name = `comp`;
export const JSON_EXTENSION: Name = `json`;

export const DEFAULT_FETCH_ATTEMPT_LIMIT: Count = 10;
export const DEFAULT_VERSION_CACHE_LIMIT: Count = 5;
export const DEFAULT_FILE_CACHE_LIMIT: Count = 300;
export const DEFAULT_VERSION_CACHE_ATTEMPT_LIMIT: Count = 3;

export const INFO_TITLE: Name = `Info`;
export const INFO_EXTENSION: Name = COMP_EXTENSION;
export const INFO_NAME: Name = `${INFO_TITLE}.${INFO_EXTENSION}`;
export const INFO_PATH: Path = `${PATH}/${INFO_NAME}`;
export const INFO_JSON_NAME: Name = `${INFO_TITLE}.${JSON_EXTENSION}`;

export const BOOKS_PATH: Path = `${PATH}/Books`;

export const UNIQUE_PARTS_TITLE: Name = `Unique_Parts`;
export const UNIQUE_PARTS_EXTENSION: Name = COMP_EXTENSION;
export const UNIQUE_PARTS_NAME: Name = `${UNIQUE_PARTS_TITLE}.${UNIQUE_PARTS_EXTENSION}`;

export const DICTIONARY_TITLE: Name = `Dictionary`;
export const DICTIONARY_EXTENSION: Name = COMP_EXTENSION;
export const DICTIONARY_NAME: Name = `${DICTIONARY_TITLE}.${DICTIONARY_EXTENSION}`;
export const DICTIONARY_JSON_NAME: Name = `${DICTIONARY_TITLE}.${JSON_EXTENSION}`;

export const ORDER_TITLE: Name = `Order`;
export const ORDER_JSON_NAME: Name = `${ORDER_TITLE}.${JSON_EXTENSION}`;

export const VERSION_TEXT_TITLE: Name = `Text`;
export const VERSION_TEXT_EXTENSION: Name = COMP_EXTENSION;
export const VERSION_TEXT_NAME: Name = `${VERSION_TEXT_TITLE}.${VERSION_TEXT_EXTENSION}`;
export const VERSION_TEXT_FILE_BREAK: string = `\n~~~FILE_BREAK~~~\n`;
export const VERSION_FILE_FETCH_LIMIT: Count = 8;

export const FILE_EXTENSION: Name = COMP_EXTENSION;
