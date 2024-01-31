import*as Utils from"../../utils.js";import*as Unicode from"../../unicode.js";export var Boundary;!function(r){r.START="START",r.MIDDLE="MIDDLE",r.END="END"}(Boundary||(Boundary={}));const DEFAULT_LANGUAGE_KEY="";export class Instance{constructor({json:r=null}={}){null!=r?(this.info=Object.create(null),this.From_JSON(r)):this.info=Object.assign(Object.create(null),{letters:Object.create(null),markers:Object.create(null),words:Object.create(null),breaks:Object.create(null),word_errors:Object.create(null),break_errors:Object.create(null)})}Maybe_Validation_Error(){const r=this.info;if(!Utils.Is.Object(r))return"info is not an object.";for(const s of["letters","markers"]){if(null==r[s])return`${s} is missing.`;if(!Utils.Is.Object(r[s]))return`${s} is not an object.`;for(const t of Object.keys(r[s])){if(!Utils.Is.String(t))return`${t} is not a string in ${s}.`;if(!Utils.Is.Array(r[s][t]))return`${s}.${t} is not an array.`;for(const e of r[s][t])if(!Utils.Is.String(e))return`${e} is not a string in ${s}.${t}.`}}if(null==r.words)return"words is missing.";if(!Utils.Is.Object(r.words))return"words is not an object.";for(const s of Object.keys(r.words)){if(!Utils.Is.String(s))return`${s} is not a string in words.`;if(!Utils.Is.Object(r.words[s]))return`words.${s} is not an object.`;for(const t of Object.keys(r.words[s])){if(!Utils.Is.String(t))return`${t} is not a string in words.${s}.`;if(!Utils.Is.Array(r.words[s][t]))return`words.${s}.${t} is not an array.`;for(const e of r.words[s][t])if(!Utils.Is.String(e))return`${e} is not a string in words.${s}.${t}.`}}if(null==r.breaks)return"breaks is missing.";if(!Utils.Is.Object(r.breaks))return"breaks is not an object.";for(const s of Object.keys(r.breaks)){if(!Utils.Is.String(s))return`${s} is not a string in breaks.`;if(!Utils.Is.Object(r.breaks[s]))return`breaks.${s} is not an object.`;for(const t of[Boundary.START,Boundary.MIDDLE,Boundary.END]){if(null==r.breaks[s][t])return`breaks.${s}.${t} is missing.`;if(!Utils.Is.Object(r.breaks[s][t]))return`breaks.${s}.${t} is not an object.`;for(const e of Object.keys(r.breaks[s][t])){if(!Utils.Is.String(e))return`${e} is not a string in breaks.${s}.${t}.`;if(!Utils.Is.Array(r.breaks[s][t][e]))return`breaks.${s}.${t}.${e} is not an array.`;for(const o of r.breaks[s][t][e])if(!Utils.Is.String(o))return`${o} is not a string in breaks.${s}.${t}.${e}.`}}}if(null==r.word_errors)return"word_errors is missing.";if(!Utils.Is.Object(r.word_errors))return"word_errors is not an object.";for(const s of Object.keys(r.word_errors)){if(!Utils.Is.String(s))return`${s} is not a string in word_errors.`;if(!Utils.Is.Array(r.word_errors[s]))return`word_errors.${s} is not an array.`;for(const t of r.word_errors[s])if(!Utils.Is.String(t))return`${t} is not a string in word_errors.${s}.`}if(null==r.break_errors)return"break_errors is missing.";if(!Utils.Is.Object(r.break_errors))return"break_errors is not an object.";for(const s of Object.keys(r.break_errors)){if(!Utils.Is.String(s))return`${s} is not a string in break_errors.`;if(!Utils.Is.Object(r.break_errors[s]))return`break_errors.${s} is not an object.`;for(const t of[Boundary.START,Boundary.MIDDLE,Boundary.END]){if(null==r.break_errors[s][t])return`break_errors.${s}.${t} is missing.`;if(!Utils.Is.Array(r.break_errors[s][t]))return`break_errors.${s}.${t} is not an array.`;for(const e of r.break_errors[s][t])if(!Utils.Is.String(e))return`${e} is not a string in break_errors.${s}.${t}.`}}return null}Language_Key(r){return null!=r?r:""}Language_Name(r){return""===r?null:r}Has_Letter(r,s){0;const t=this.Language_Key(s);return null!=this.info.letters[t]&&this.info.letters[t].includes(r)}Is_Letter(r){0;for(const s of Object.keys(this.info.letters))if(this.Has_Letter(r,this.Language_Name(s)))return!0;return!1}Add_Letter(r,s){0;const t=this.Language_Key(s);null==this.info.letters[t]&&(this.info.letters[t]=[]),this.info.letters[t].includes(r)||(this.info.letters[t].push(r),null==this.info.words[t]&&(this.info.words[t]=Object.create(null)),this.info.words[t][r]=[])}Remove_Letter(r,s){0;const t=this.Language_Key(s);if(null!=this.info.letters[t]){{const e=[];for(const s of this.info.letters[t])for(const o of this.info.words[t][s])Unicode.Has_Point(o,r)&&e.push(o);for(const r of e)this.Remove_Word(r,s)}if(null!=this.info.word_errors[t]){const e=[];for(const s of this.info.word_errors[t])Unicode.Has_Point(s,r)&&e.push(s);for(const r of e)this.Remove_Word_Error(r,s)}const e=this.info.letters[t].indexOf(r);if(e>-1){const s=this.info.letters[t].length-1;this.info.letters[t][e]=this.info.letters[t][s],this.info.letters[t].pop(),delete this.info.words[t][r]}}}Has_Marker(r,s){0;const t=this.Language_Key(s);return null!=this.info.markers[t]&&this.info.markers[t].includes(r)}Is_Marker(r){0;for(const s of Object.keys(this.info.markers))if(this.Has_Marker(r,this.Language_Name(s)))return!0;return!1}Add_Marker(r,s){0;const t=this.Language_Key(s);null==this.info.markers[t]&&(this.info.markers[t]=[]),this.info.markers[t].includes(r)||(this.info.markers[t].push(r),null==this.info.breaks[t]&&(this.info.breaks[t]=Object.create(null),this.info.breaks[t][Boundary.START]=Object.create(null),this.info.breaks[t][Boundary.MIDDLE]=Object.create(null),this.info.breaks[t][Boundary.END]=Object.create(null)),this.info.breaks[t][Boundary.START][r]=[],this.info.breaks[t][Boundary.MIDDLE][r]=[],this.info.breaks[t][Boundary.END][r]=[])}Remove_Marker(r,s){0;const t=this.Language_Key(s);if(null!=this.info.markers[t]){{const e=[];for(const s of this.info.markers[t])for(const o of[Boundary.START,Boundary.MIDDLE,Boundary.END])for(const n of this.info.breaks[t][o][s])Unicode.Has_Point(n,r)&&e.push([n,o]);for(const[r,t]of e)this.Remove_Break(r,t,s)}if(null!=this.info.break_errors[t]){const e=[];for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END])for(const o of this.info.break_errors[t][s])Unicode.Has_Point(o,r)&&e.push([o,s]);for(const[r,t]of e)this.Remove_Break_Error(r,t,s)}const e=this.info.markers[t].indexOf(r);if(e>-1){const s=this.info.markers[t].length-1;this.info.markers[t][e]=this.info.markers[t][s],this.info.markers[t].pop(),delete this.info.breaks[t][Boundary.START][r],delete this.info.breaks[t][Boundary.MIDDLE][r],delete this.info.breaks[t][Boundary.END][r]}}}Has_Word(r,s){0;const t=this.Language_Key(s);if(null!=this.info.words[t]){const s=Unicode.First_Point(r);return null!=this.info.words[t][s]&&this.info.words[t][s].includes(r)}return!1}Is_Word(r){0;for(const s of Object.keys(this.info.words))if(this.Has_Word(r,this.Language_Name(s)))return!0;return!1}Add_Word(r,s){0,0;for(const t of Unicode.Points(r))if(!this.Has_Letter(t,s))return;const t=this.Language_Key(s),e=Unicode.First_Point(r);this.info.words[t][e].includes(r)||this.info.words[t][e].push(r)}Remove_Word(r,s){0;const t=this.Language_Key(s);if(null!=this.info.words[t]){const s=Unicode.First_Point(r);if(null!=this.info.words[t][s]){const e=this.info.words[t][s].indexOf(r);if(e>-1){const r=this.info.words[t][s].length-1;this.info.words[t][s][e]=this.info.words[t][s][r],this.info.words[t][s].pop()}}}}Has_Break(r,s,t){0;const e=this.Language_Key(t);if(null!=this.info.breaks[e]){const t=Unicode.First_Point(r);return null!=this.info.breaks[e][s][t]&&this.info.breaks[e][s][t].includes(r)}return!1}Is_Break(r,s){0;for(const t of Object.keys(this.info.breaks))if(this.Has_Break(r,s,this.Language_Name(t)))return!0;return!1}Add_Break(r,s,t){0,0;for(const s of Unicode.Points(r))if(!this.Has_Marker(s,t))return;const e=this.Language_Key(t),o=Unicode.First_Point(r);this.info.breaks[e][s][o].includes(r)||this.info.breaks[e][s][o].push(r)}Remove_Break(r,s,t){0;const e=this.Language_Key(t);if(null!=this.info.breaks[e]){const t=Unicode.First_Point(r);if(null!=this.info.breaks[e][s][t]){const o=this.info.breaks[e][s][t].indexOf(r);if(o>-1){const r=this.info.breaks[e][s][t].length-1;this.info.breaks[e][s][t][o]=this.info.breaks[e][s][t][r],this.info.breaks[e][s][t].pop()}}}}Has_Word_Error(r,s){0;const t=this.Language_Key(s);return null!=this.info.word_errors[t]&&this.info.word_errors[t].includes(r)}Is_Word_Error(r){0;for(const s of Object.keys(this.info.word_errors))if(this.Has_Word_Error(r,this.Language_Name(s)))return!0;return!1}Add_Word_Error(r,s){0,0;for(const t of Unicode.Points(r))if(!this.Has_Letter(t,s))return;const t=this.Language_Key(s);null==this.info.word_errors[t]&&(this.info.word_errors[t]=[]),this.info.word_errors[t].includes(r)||this.info.word_errors[t].push(r)}Remove_Word_Error(r,s){0;const t=this.Language_Key(s);if(null!=this.info.word_errors[t]){const s=this.info.word_errors[t].indexOf(r);if(s>-1){const r=this.info.word_errors[t].length-1;this.info.word_errors[t][s]=this.info.word_errors[t][r],this.info.word_errors[t].pop()}}}Has_Break_Error(r,s,t){0;const e=this.Language_Key(t);return null!=this.info.break_errors[e]&&this.info.break_errors[e][s].includes(r)}Is_Break_Error(r,s){0;for(const t of Object.keys(this.info.break_errors))if(this.Has_Break_Error(r,s,this.Language_Name(t)))return!0;return!1}Add_Break_Error(r,s,t){0,0;for(const s of Unicode.Points(r))if(!this.Has_Marker(s,t))return;const e=this.Language_Key(t);null==this.info.break_errors[e]&&(this.info.break_errors[e]=Object.create(null),this.info.break_errors[e][Boundary.START]=[],this.info.break_errors[e][Boundary.MIDDLE]=[],this.info.break_errors[e][Boundary.END]=[]),this.info.break_errors[e][s].includes(r)||this.info.break_errors[e][s].push(r)}Remove_Break_Error(r,s,t){0;const e=this.Language_Key(t);if(null!=this.info.break_errors[e]){const t=this.info.break_errors[e][s].indexOf(r);if(t>-1){const r=this.info.break_errors[e][s].length-1;this.info.break_errors[e][s][t]=this.info.break_errors[e][s][r],this.info.break_errors[e][s].pop()}}}Sort(){const r=Object.create(null);for(const s of Object.keys(this.info.letters).sort())r[s]=this.info.letters[s].sort();this.info.letters=r;const s=Object.create(null);for(const r of Object.keys(this.info.markers).sort())s[r]=this.info.markers[r].sort();this.info.markers=s;const t=Object.create(null);for(const r of Object.keys(this.info.words).sort()){t[r]=Object.create(null);for(const s of Object.keys(this.info.words[r]).sort())t[r][s]=this.info.words[r][s].sort()}this.info.words=t;const e=Object.create(null);for(const r of Object.keys(this.info.breaks).sort()){e[r]=Object.create(null);for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END]){e[r][s]=Object.create(null);for(const t of Object.keys(this.info.breaks[r][s]).sort())e[r][s][t]=this.info.breaks[r][s][t].sort()}}this.info.breaks=e;const o=Object.create(null);for(const r of Object.keys(this.info.word_errors).sort())o[r]=this.info.word_errors[r].sort();this.info.word_errors=o;const n=Object.create(null);for(const r of Object.keys(this.info.break_errors).sort()){n[r]=Object.create(null);for(const s of[Boundary.START,Boundary.MIDDLE,Boundary.END])n[r][s]=this.info.break_errors[r][s].sort()}this.info.break_errors=n}From_JSON(r){const s=JSON.parse(r);if(this.info=Object.create(null),null!=s.letters&&(this.info.letters=Object.assign(Object.create(null),s.letters)),null!=s.markers&&(this.info.markers=Object.assign(Object.create(null),s.markers)),null!=s.words){this.info.words=Object.create(null);for(const r of Object.keys(s.words))this.info.words[r]=Object.assign(Object.create(null),s.words[r])}if(null!=s.breaks){this.info.breaks=Object.create(null);for(const r of Object.keys(s.breaks)){this.info.breaks[r]=Object.create(null);for(const t of[Boundary.START,Boundary.MIDDLE,Boundary.END])null!=s.breaks[r][t]&&(this.info.breaks[r][t]=Object.assign(Object.create(null),s.breaks[r][t]))}}if(null!=s.word_errors&&(this.info.word_errors=Object.assign(Object.create(null),s.word_errors)),null!=s.break_errors){this.info.break_errors=Object.create(null);for(const r of Object.keys(s.break_errors)){this.info.break_errors[r]=Object.create(null);for(const t of[Boundary.START,Boundary.MIDDLE,Boundary.END])null!=s.break_errors[r][t]&&(this.info.break_errors[r][t]=s.break_errors[r][t])}}}To_JSON(){return this.Sort(),JSON.stringify(this.info)}}