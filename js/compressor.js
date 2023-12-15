import*as Utils from"./utils.js";import*as Unicode from"./unicode.js";export const LZSS_MAX_MEMORY_LENGTH=1114112;export const LZSS_ESCAPE_INDEX=16;export const LZSS_ESCAPE_STRING=String.fromCodePoint(16);export const LZSS_FIRST_SURROGATE_INDEX=Unicode.LEADING_SURROGATE.FIRST;export const LZSS_LAST_SURROGATE_INDEX=Unicode.TRAILING_SURROGATE.LAST;export var LZSS_Flags;!function(t){t[t.SURROGATE_OFFSET=1]="SURROGATE_OFFSET",t[t.SURROGATE_LENGTH=2]="SURROGATE_LENGTH",t[t.UNUSED_1=4]="UNUSED_1",t[t.UNUSED_2=8]="UNUSED_2"}(LZSS_Flags||(LZSS_Flags={}));export function LZSS_Compress(t,{max_memory_length:e,optimize_for_utf_8_encoding:n}={max_memory_length:1024,optimize_for_utf_8_encoding:!0}){0,0;const o=new class{constructor({text:t,max_memory_length:e}){this.text=t,this.text_index=0,this.memory="",this.max_memory_length=e,this.matches_buffer_a=[],this.matches_buffer_b=[]}Initial_Matches(t,e){0,t.splice(0,t.length);let n=new Unicode.Iterator({text:this.memory});for(;!n.Is_At_End();n=n.Next())if(n.Point()===e){const o=n.Index();t.push([o,o+e.length])}}Matches(t,e,n){e.splice(0,e.length);for(const[o,_]of t){const t=_-o,s=t+Unicode.First_Point(this.memory.slice(_)).length,i=o+s;s>t&&n.length>=s&&n.slice(0,s)===this.memory.slice(o,i)&&e.push([o,i])}}Move_Memory(t){for(;this.memory.length+t>this.max_memory_length;){const t=Unicode.First_Point(this.memory);this.text_index+=t.length,this.memory=this.memory.slice(t.length)}this.memory=this.text.slice(this.text_index,this.text_index+this.memory.length+t)}Create_Token(t,e){0,0;const n=(e-=1)>=LZSS_FIRST_SURROGATE_INDEX&&e<=LZSS_LAST_SURROGATE_INDEX;let o=0;return(t-=1)>=LZSS_FIRST_SURROGATE_INDEX&&t<=LZSS_LAST_SURROGATE_INDEX&&(o|=LZSS_Flags.SURROGATE_OFFSET,t-=LZSS_FIRST_SURROGATE_INDEX),n&&(o|=LZSS_Flags.SURROGATE_LENGTH,e-=LZSS_FIRST_SURROGATE_INDEX),String.fromCodePoint(o)+String.fromCodePoint(t)+String.fromCodePoint(e)}Can_Use_Token(t,e){return n?Unicode.Expected_UTF_8_Unit_Count(t)<Unicode.Expected_UTF_8_Unit_Count(e):t.length<e.length}Create_Non_Token(t){return 0,t.codePointAt(0)>16?t:LZSS_ESCAPE_STRING+t}Token_Or_Non_Token(t){0;const e=t.Point();if(this.Initial_Matches(this.matches_buffer_a,e),this.matches_buffer_a.length>0){const n=t.Points();let o=this.matches_buffer_b,_=this.matches_buffer_a,s=o;for(;_.length>0;)s=o,o=_,_=s,this.Matches(o,_,n);const i=o[o.length-1],r=this.memory.length-i[0],S=i[1]-i[0],h=this.Create_Token(r,S);return this.Can_Use_Token(h,n.slice(0,S))?(this.Move_Memory(S),[h,new Unicode.Iterator({text:t.Text(),index:t.Index()+S})]):(this.Move_Memory(e.length),[this.Create_Non_Token(e),new Unicode.Iterator({text:t.Text(),index:t.Index()+e.length})])}return this.Move_Memory(e.length),[this.Create_Non_Token(e),new Unicode.Iterator({text:t.Text(),index:t.Index()+e.length})]}}({text:t,max_memory_length:e});let _="",s=new Unicode.Iterator({text:t});for(;!s.Is_At_End();){const[t,e]=o.Token_Or_Non_Token(s);_+=t,s=e}return _}export function LZSS_Decompress(t){let e="",n=new Unicode.Iterator({text:t});for(;!n.Is_At_End();){const t=n.Point();if(t===LZSS_ESCAPE_STRING){n=n.Next();e+=n.Point(),n=n.Next()}else{const o=t.codePointAt(0);if(o<16){const t=o;let _,s;n=n.Next(),_=n.Point().codePointAt(0)+1,0!=(t&LZSS_Flags.SURROGATE_OFFSET)&&(_+=LZSS_FIRST_SURROGATE_INDEX),n=n.Next(),s=n.Point().codePointAt(0)+1,0!=(t&LZSS_Flags.SURROGATE_LENGTH)&&(s+=LZSS_FIRST_SURROGATE_INDEX);const i=e.length-_,r=i+s;e+=e.slice(i,r),n=n.Next()}else{e+=t,n=n.Next()}}}return e}export function JSON_String_Array_Compress(t){return 0,t.replace(/","/g,"\0")}export function JSON_String_Array_Decompress(t){return t.replace(/\x00/g,'","')}