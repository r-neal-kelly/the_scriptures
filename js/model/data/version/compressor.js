import*as Utils from"../../../utils.js";import*as Unicode from"../../../unicode.js";import*as Text from"../../text.js";export var Symbol;!function(t){t[t.NEWLINE=0]="NEWLINE",t[t.VERBATIM_OPEN=1]="VERBATIM_OPEN",t[t.VERBATIM_CLOSE=2]="VERBATIM_CLOSE",t[t._COUNT_=3]="_COUNT_"}(Symbol||(Symbol={}));export class Instance{constructor({unique_parts:t}){0,this.indices={},this.values={};for(let o=0,e=t.length;o<e;o+=1){const e=o+Symbol._COUNT_;this.indices[t[o]]=e,this.values[e]=t[o]}}Compress_Dictionary({dictionary_value:t}){const o=String.fromCodePoint(0),e=String.fromCodePoint(1),n='"';let i="",s=!1,r=!1,c=0;for(let l=0,a=t.length;l<a;l+=1){const d=t[l];if(0,s){if("\\"===d&&l+1<a&&t[l+1]===n)l+=1;else if(d===n){const d=t.slice(c,l);this.indices.hasOwnProperty(d)?l+1<a&&","===t[l+1]?(r||(i+=o,r=!0),i+=String.fromCodePoint(this.indices[d]),l+=1):(r&&(i+=o,r=!1),i+=e,i+=String.fromCodePoint(this.indices[d])):(r&&(i+=o,r=!1),i+=n,i+=d,i+=n),s=!1,c=0}}else d===n?(s=!0,c=l+1):(r&&(i+=o,r=!1),i+=d)}return i}Decompress_Dictionary({dictionary_value:t}){const o=String.fromCodePoint(0),e=String.fromCodePoint(1),n='"';let i="",s=new Unicode.Iterator({text:t}),r=!1;for(;!s.Is_At_End();s=s.Next())r?s.Point()===o?r=!1:(i+=n,i+=this.values[s.Point().codePointAt(0)],i+=n,i+=","):s.Point()===o?r=!0:s.Point()===e?(s=s.Next(),i+=n,i+=this.values[s.Point().codePointAt(0)],i+=n):i+=s.Point();return i}Compress_File({dictionary:t,file_value:o}){const e=[],n=String.fromCodePoint(Symbol.NEWLINE),i=String.fromCodePoint(Symbol.VERBATIM_OPEN),s=String.fromCodePoint(Symbol.VERBATIM_CLOSE),r=new Text.Instance({dictionary:t,value:o});for(let t=0,o=r.Line_Count();t<o;t+=1){const c=r.Line(t);for(let t=0,o=c.Column_Count();t<o;t+=1){const o=c.Column(t);for(let t=0,n=o.Row_Count();t<n;t+=1){const n=o.Row(t);let r=!1;for(let t=0,o=n.Macro_Part_Count();t<o;t+=1){const c=n.Macro_Part(t),l=c.Value();if(this.indices.hasOwnProperty(l)){const i=String.fromCodePoint(this.indices[l]);c.Is_Word()?(e.push(i),r=!0):(" "===l&&r&&t+1<o&&n.Macro_Part(t+1).Is_Word()||e.push(i),r=!1)}else e[e.length-1]===s?e.pop():e.push(i),e.push(l),e.push(s),r=!1}}}t<o-1&&e.push(n)}return e.join("")}Decompress_File({dictionary:t,file_value:o}){const e=[];let n=new Unicode.Iterator({text:o}),i=!1;for(;!n.Is_At_End();n=n.Next())if(n.Point().codePointAt(0)===Symbol.VERBATIM_OPEN){const t=n.Next();for(n=t;n.Point().codePointAt(0)!==Symbol.VERBATIM_CLOSE;)n=n.Next();e.push(t.Points().slice(0,n.Index()-t.Index())),i=!1}else if(n.Point().codePointAt(0)===Symbol.NEWLINE)e.push("\n"),i=!1;else{const o=this.values[n.Point().codePointAt(0)];t.Has_Word(o)||t.Has_Word_Error(o)?(i&&e.push(" "),e.push(o),i=!0):(e.push(o),i=!1)}return e.join("")}}