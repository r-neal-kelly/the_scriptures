import*as Utils from"../../utils.js";import*as Unicode from"../../unicode.js";import*as Text from"../text.js";export var Symbol;!function(t){t[t.NEWLINE=0]="NEWLINE",t[t.VERBATIM_OPEN=1]="VERBATIM_OPEN",t[t.VERBATIM_CLOSE=2]="VERBATIM_CLOSE",t[t._COUNT_=3]="_COUNT_"}(Symbol||(Symbol={}));export class Instance{constructor({unique_parts:t}){Utils.Assert(t.length<=Number.MAX_SAFE_INTEGER-Symbol._COUNT_,"There are too may unique_parts to compress."),this.indices={},this.values={};for(let o=0,e=t.length;o<e;o+=1){const e=o+Symbol._COUNT_;this.indices[t[o]]=e,this.values[e]=t[o]}}Compress({value:t,dictionary:o}){const e=[],n=String.fromCodePoint(Symbol.NEWLINE),s=String.fromCodePoint(Symbol.VERBATIM_OPEN),r=String.fromCodePoint(Symbol.VERBATIM_CLOSE),i=new Text.Instance({dictionary:o,value:t});for(let t=0,o=i.Line_Count();t<o;t+=1){const c=i.Line(t);let l=!1;for(let t=0,o=c.Macro_Part_Count();t<o;t+=1){const n=c.Macro_Part(t),i=n.Value();if(this.indices.hasOwnProperty(i)){const s=String.fromCodePoint(this.indices[i]);n.Is_Word()?(e.push(s),l=!0):(" "===i&&l&&t+1<o&&c.Macro_Part(t+1).Is_Word()||e.push(s),l=!1)}else e[e.length-1]===r?e.pop():e.push(s),e.push(i),e.push(r),l=!1}t<o-1&&e.push(n)}return e.join("")}Decompress({value:t,dictionary:o}){const e=[];let n=new Unicode.Iterator({text:t}),s=!1;for(;!n.Is_At_End();n=n.Next())if(n.Point().codePointAt(0)===Symbol.VERBATIM_OPEN){const t=n.Next();for(n=t;n.Point().codePointAt(0)!==Symbol.VERBATIM_CLOSE;)n=n.Next();e.push(t.Points().slice(0,n.Index()-t.Index())),s=!1}else if(n.Point().codePointAt(0)===Symbol.NEWLINE)e.push("\n"),s=!1;else{const t=this.values[n.Point().codePointAt(0)];o.Has_Word(t)||o.Has_Word_Error(t)?(s&&e.push(" "),e.push(t),s=!0):(e.push(t),s=!1)}return e.join("")}Compress_Dictionary(t){const o=String.fromCodePoint(0),e=String.fromCodePoint(1);Utils.Assert(null==t.match(o)&&null==t.match(e),"Cannot compress a dictionary that contains a code point of 0 or 1.");for(const e of Object.values(this.values).sort((function(t,o){return o.length-t.length})))e.length>1&&(t=t.replace(e,o+String.fromCodePoint(this.indices[e])));return t=t.replace(/","\x00/g,e)}Decompress_Dictionary(t){const o=String.fromCodePoint(0),e=String.fromCodePoint(1);t=t.replace(new RegExp(e,"g"),'","\0');for(const e of Object.values(this.values).sort((function(t,o){return o.length-t.length})))e.length>1&&(t=t.replace(o+String.fromCodePoint(this.indices[e]),e));return t}}