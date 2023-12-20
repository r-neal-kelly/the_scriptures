import*as Utils from"../../../utils.js";import*as Unicode from"../../../unicode.js";import{Compressed_Symbol}from"./compressed_symbol.js";export class Instance{constructor({unique_parts:o=[]}={}){0,this.values={};for(let t=0,e=o.length;t<e;t+=1){const e=t+Compressed_Symbol._COUNT_;this.values[e]=o[t]}}Decompress_Dictionary({dictionary_value:o}){const t=String.fromCodePoint(0),e=String.fromCodePoint(1),s='"';let i="",n=new Unicode.Iterator({text:o}),r=!1;for(;!n.Is_At_End();n=n.Next())r?n.Point()===t?r=!1:(i+=s,i+=this.values[n.Point().codePointAt(0)],i+=s,i+=","):n.Point()===t?r=!0:n.Point()===e?(n=n.Next(),i+=s,i+=this.values[n.Point().codePointAt(0)],i+=s):i+=n.Point();return i}Decompress_File({dictionary:o,file_value:t}){const e=[];let s=new Unicode.Iterator({text:t}),i=!1;for(;!s.Is_At_End();s=s.Next())if(s.Point().codePointAt(0)===Compressed_Symbol.VERBATIM_OPEN){const o=s.Next();for(s=o;s.Point().codePointAt(0)!==Compressed_Symbol.VERBATIM_CLOSE;)s=s.Next();e.push(o.Points().slice(0,s.Index()-o.Index())),i=!1}else if(s.Point().codePointAt(0)===Compressed_Symbol.NEWLINE)e.push("\n"),i=!1;else{const t=this.values[s.Point().codePointAt(0)];o.Has_Word(t)||o.Has_Word_Error(t)?(i&&e.push(" "),e.push(t),i=!0):(e.push(t),i=!1)}return e.join("")}}