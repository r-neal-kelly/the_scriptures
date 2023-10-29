import{Type}from"./type.js";import*as Language from"../../language.js";const KNOWN_BOOK_NAMES=new Set(["Introduction","Prolegomenon","Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Jubilees","Masoretic Notes","Prolegomena to the History of Israel","Glossary"]);Object.freeze(KNOWN_BOOK_NAMES);const KNOWN_LANGUAGE_NAMES=new Set([Language.Name.HEBREW,Language.Name.GREEK,Language.Name.LATIN,Language.Name.GERMAN,Language.Name.FRENCH,Language.Name.ITALIAN,Language.Name.DUTCH,Language.Name.ENGLISH]);Object.freeze(KNOWN_LANGUAGE_NAMES);export class Instance{constructor(){}With_Set(e,N){const t=e===Type.BOOKS?KNOWN_BOOK_NAMES:e===Type.LANGUAGES?KNOWN_LANGUAGE_NAMES:new Set,o=[],a=[];for(let e of t)N.has(e)&&o.push(e);for(let e of N)t.has(e)||a.push(e);return o.concat(a.sort())}With_Array(e,N){const t=e===Type.BOOKS?KNOWN_BOOK_NAMES:e===Type.LANGUAGES?KNOWN_LANGUAGE_NAMES:new Set,o=[],a=[];for(let e of t)N.indexOf(e)>-1&&o.push(e);for(let e of N)t.has(e)||a.push(e);return o.concat(a.sort())}}const SINGLETON=new Instance;export function Singleton(){return SINGLETON}