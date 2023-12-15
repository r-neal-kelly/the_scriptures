import*as Utils from"./utils.js";export var LEADING_SURROGATE;!function(t){t[t.FIRST=55296]="FIRST",t[t.LAST=56319]="LAST"}(LEADING_SURROGATE||(LEADING_SURROGATE={}));export var TRAILING_SURROGATE;!function(t){t[t.FIRST=56320]="FIRST",t[t.LAST=57343]="LAST"}(TRAILING_SURROGATE||(TRAILING_SURROGATE={}));export{LEADING_SURROGATE as HIGH_SURROGATE};export{TRAILING_SURROGATE as LOW_SURROGATE};export function Is_Point(t){return 1===t.length||2===t.length&&t.charCodeAt(0)>=LEADING_SURROGATE.FIRST&&t.charCodeAt(0)<=LEADING_SURROGATE.LAST&&t.charCodeAt(1)>=TRAILING_SURROGATE.FIRST&&t.charCodeAt(1)<=TRAILING_SURROGATE.LAST}export function First_Point(t){if(0===t.length)return"";{const e=t.charCodeAt(0);if(e<LEADING_SURROGATE.FIRST||e>TRAILING_SURROGATE.LAST)return t.slice(0,1);{const s=t.charCodeAt(1);return e>=LEADING_SURROGATE.FIRST&&e<=LEADING_SURROGATE.LAST&&s>=TRAILING_SURROGATE.FIRST&&s<=TRAILING_SURROGATE.LAST?t.slice(0,2):t.slice(0,1)}}}export function Point_Count(t){let e=0;for(let s=new Iterator({text:t});!s.Is_At_End();s=s.Next())e+=1;return e}export function Expected_UTF_8_Unit_Count(t){let e=0,s=new Iterator({text:t});for(;!s.Is_At_End();s=s.Next()){const t=s.Point().codePointAt(0);e+=t<=127?1:t<=2047?2:t<=65535?3:4}return e}export class Iterator{constructor({text:t,index:e=0,value:s=null}){0,0,this.text=t,this.index=e,this.value=null!=s?s:First_Point(this.text.slice(this.index))}Copy(){return new Iterator({text:this.text,index:this.index})}Text(){return this.text}Index(){return this.index}Is_At_Start(){return 0===this.index}Is_At_End(){return this.index>=this.text.length}Point(){return 0,this.value}Points(){return 0,this.text.slice(this.index)}Previous(){0;const t=this.text.charCodeAt(this.index-1);if(t<LEADING_SURROGATE.FIRST||t>TRAILING_SURROGATE.LAST||this.index<2)return new Iterator({text:this.text,index:this.index-1,value:this.text.slice(this.index-1,this.index)});{const e=this.text.charCodeAt(this.index-2);return e>=LEADING_SURROGATE.FIRST&&e<=LEADING_SURROGATE.LAST&&t>=TRAILING_SURROGATE.FIRST&&t<=TRAILING_SURROGATE.LAST?new Iterator({text:this.text,index:this.index-2,value:this.text.slice(this.index-2,this.index)}):new Iterator({text:this.text,index:this.index-1,value:this.text.slice(this.index-1,this.index)})}}Next(){return 0,new Iterator({text:this.text,index:this.index+this.value.length})}Look_Backward_Index(){return 0,this.Previous().Index()}Look_Backward_Point(){return 0,this.Previous().Point()}Look_Backward_Points(){return 0,this.Previous().Points()}Look_Forward_Index(){return 0,this.Next().Index()}Look_Forward_Point(){0;const t=this.Next();return t.Is_At_End()?null:t.Point()}Look_Forward_Points(){0;const t=this.Next();return t.Is_At_End()?null:t.Points()}}