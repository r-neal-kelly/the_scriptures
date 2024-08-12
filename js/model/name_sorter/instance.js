import{Type}from"./type.js";import*as Language from"../language.js";const KNOWN_BOOK_NAMES=new Set(["Introduction","Prolegomenon","Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","Masoretic Notes","Jubilees","Prolegomena to the History of Israel","Glossary"]);Object.freeze(KNOWN_BOOK_NAMES);const KNOWN_LANGUAGE_NAMES=new Set([Language.Name.ENGLISH,Language.Name.HEBREW,Language.Name.GREEK,Language.Name.LATIN,Language.Name.ARAMAIC,Language.Name.GEEZ,Language.Name.ARABIC,Language.Name.GERMAN,Language.Name.FRENCH,Language.Name.ITALIAN,Language.Name.DUTCH]);Object.freeze(KNOWN_LANGUAGE_NAMES);export function Known_Book_Names(){return Array.from(KNOWN_BOOK_NAMES)}export function Known_Language_Names(){return Array.from(KNOWN_LANGUAGE_NAMES)}export class Instance{constructor(){}With_Set(e,n){const a=e===Type.BOOKS?KNOWN_BOOK_NAMES:e===Type.LANGUAGES?KNOWN_LANGUAGE_NAMES:new Set,o=[],N=[];for(let e of a)n.has(e)&&o.push(e);for(let e of n)a.has(e)||N.push(e);return o.concat(N.sort())}With_Array(e,n){const a=e===Type.BOOKS?KNOWN_BOOK_NAMES:e===Type.LANGUAGES?KNOWN_LANGUAGE_NAMES:new Set,o=[],N=[];for(let e of a)n.indexOf(e)>-1&&o.push(e);for(let e of n)a.has(e)||N.push(e);return o.concat(N.sort())}}let singleton=null;export function Singleton(){return null==singleton&&(singleton=new Instance),singleton}