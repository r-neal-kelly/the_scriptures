import*as Utils from"../utils.js";export class Instance{constructor(){this.buffer=[]}Count(){return this.buffer.length}At(e){return 0,this.buffer[e]}Maybe_Index_Of(e){const t=this.buffer.indexOf(e);return t>=0?t:null}Has(e){return null!=this.Maybe_Index_Of(e)}Add(e){this.Has(e)&&this.Remove(e),this.buffer.push(e)}Remove(e){const t=this.Maybe_Index_Of(e);null!=t&&this.buffer.splice(t,1)}Clear(){this.buffer.splice(0,this.buffer.length)}Is(e){if(e.length===this.buffer.length){for(let t=0,r=e.length;t<r;t+=1)if(e[t]!==this.buffer[t])return!1;return!0}return!1}Keys(){return Array.from(this.buffer)}Slice(e=void 0,t=void 0){const r=new Instance;return r.buffer=this.buffer.slice(e,t),r}}