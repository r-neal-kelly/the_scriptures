import { Index } from "../types.js";
import { ID } from "../types.js";

import * as Unique_ID from "../unique_id.js";

export const WINDOW_READY: ID = Unique_ID.New();
export const WINDOW_ACTIVATE: ID = Unique_ID.New();
export const WINDOW_DEACTIVATE: ID = Unique_ID.New();
export const WINDOW_TOGGLE_MAXIMIZATION: ID = Unique_ID.New();
export const WINDOW_TOGGLE_MINIMIZATION: ID = Unique_ID.New();
export const WINDOW_REFRESH_TITLE: ID = Unique_ID.New();
export const WINDOW_CLOSE: ID = Unique_ID.New();
export type WINDOW_CLOSE_DATA = {
    window_index: Index,
};

export const MENU_OPEN: ID = Unique_ID.New();
export const MENU_CLOSE: ID = Unique_ID.New();

export const OPEN_BROWSER: ID = Unique_ID.New();
export const OPEN_FINDER: ID = Unique_ID.New();

export const BROWSER_COMMANDER_PREVIOUS: ID = Unique_ID.New();
export const BROWSER_COMMANDER_NEXT: ID = Unique_ID.New();

export const FINDER_BODY_BEFORE_SEARCH: ID = Unique_ID.New();
export const FINDER_BODY_DURING_SEARCH: ID = Unique_ID.New();
export const FINDER_BODY_AFTER_SEARCH: ID = Unique_ID.New();
export const FINDER_BODY_EXPRESSION_ENTER: ID = Unique_ID.New();
export const FINDER_BODY_EXPRESSION_CHANGE: ID = Unique_ID.New();
export const FINDER_BODY_TREE_LEAF_SELECT: ID = Unique_ID.New();

export const SELECTOR_TOGGLE: ID = Unique_ID.New();
export const SELECTOR_SETTINGS_TOGGLE: ID = Unique_ID.New();
export const SELECTOR_SLOT_ORDER_SELECT: ID = Unique_ID.New();
export const SELECTOR_SLOT_ITEM_SELECT: ID = Unique_ID.New();
export const SELECTOR_SLOT_ITEM_HIGHLIGHT: ID = Unique_ID.New();
export const SELECTOR_SLOT_ITEM_UNHIGHLIGHT: ID = Unique_ID.New();

export const FONT_SELECTOR_TOGGLE: ID = Unique_ID.New();
export const FONT_SELECTOR_SLOT_ITEM_SELECT: ID = Unique_ID.New();
export type FONT_SELECTOR_SLOT_ITEM_SELECT_DATA = {
    should_update_text: boolean,
};

export const TOGGLE_ALLOW_ERRORS: ID = Unique_ID.New();
