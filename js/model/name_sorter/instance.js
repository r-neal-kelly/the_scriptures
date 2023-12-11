import{Type}from"./type.js";import*as Language from"../language.js";const KNOWN_BOOK_NAMES=new Set(["Introduction","Prolegomenon","Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Masoretic Notes","Jubilees","Prolegomena to the History of Israel","Glossary"]);Object.freeze(KNOWN_BOOK_NAMES);const KNOWN_LANGUAGE_NAMES=new Set([Language.Name.HEBREW,Language.Name.GREEK,Language.Name.LATIN,Language.Name.ARAMAIC,Language.Name.ARABIC,Language.Name.GERMAN,Language.Name.FRENCH,Language.Name.ITALIAN,Language.Name.DUTCH,Language.Name.ENGLISH]);Object.freeze(KNOWN_LANGUAGE_NAMES);export class Instance{constructor(){}With_Set(e,N){const a=e===Type.BOOKS?KNOWN_BOOK_NAMES:e===Type.LANGUAGES?KNOWN_LANGUAGE_NAMES:new Set,t=[],n=[];for(let e of a)N.has(e)&&t.push(e);for(let e of N)a.has(e)||n.push(e);return t.concat(n.sort())}With_Array(e,N){const a=e===Type.BOOKS?KNOWN_BOOK_NAMES:e===Type.LANGUAGES?KNOWN_LANGUAGE_NAMES:new Set,t=[],n=[];for(let e of a)N.indexOf(e)>-1&&t.push(e);for(let e of N)a.has(e)||n.push(e);return t.concat(n.sort())}}const SINGLETON=new Instance;export function Singleton(){return SINGLETON}