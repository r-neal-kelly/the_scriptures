var __awaiter=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function s(e){try{l(o.next(e))}catch(e){r(e)}}function a(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}l((o=o.apply(e,t||[])).next())}))};export function Assert(e,t="Failed assert."){if(!1===e)throw new Error(t)}export function Wait_Milliseconds(e){return __awaiter(this,void 0,void 0,(function*(){return Assert(e>=0,"Can't wait for negative milliseconds."),Assert(e<1/0,"Can't wait for infinite milliseconds."),new Promise((function(t,n){setTimeout(t,e)}))}))}export function Wait_Seconds(e){return __awaiter(this,void 0,void 0,(function*(){return Assert(e>=0,"Can't wait for negative seconds."),Assert(e<1/0,"Can't wait for infinite seconds."),Assert(1e3*e<1/0,"Can't convert seconds to milliseconds, it's too big."),Wait_Milliseconds(1e3*e)}))}function Is_Type(e,t){return e.test(Object.prototype.toString.call(t).replace(/^[^ ]+ |.$/g,""))}export const Is={Undefined:e=>Is_Type(/^Undefined$/,e),Null:e=>Is_Type(/^Null$/,e),Undefined_Or_Null:e=>Is_Type(/^Undefined$|^Null$/,e),Boolean:e=>Is_Type(/^Boolean$/,e),Number:e=>Is_Type(/^Number$/,e)&&e==e&&e!==1/0&&e!==-1/0,Infinity:e=>Is_Type(/^Number$/,e)&&e===1/0||e===-1/0,Number_Or_Infinity:e=>Is_Type(/^Number$/,e)&&e==e,NaN:e=>Is_Type(/^Number$/,e)&&e!=e,Object:e=>Is_Type(/^Object$/,e),Array:e=>Is_Type(/^Array$/,e),String:e=>Is_Type(/^String$/,e),Function:e=>Is_Type(/^Function$/,e),Symbol:e=>Is_Type(/^Symbol$/,e),Date:e=>Is_Type(/^Date$/,e),RegExp:e=>Is_Type(/^RegExp$/,e),Set:e=>Is_Type(/^Set$/,e),Map:e=>Is_Type(/^Map$/,e),Window:e=>Is_Type(/^Window$/,e),Global:e=>Is_Type(/^global$/,e),Window_Or_Global:e=>Is_Type(/^Window$|^global$/,e)};Object.freeze(Is);export function Escape_Regular_Expression(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}export function Resolve_Path(e){return Assert(!/^\.\//.test(e),"Path must be relative to the root, and not anything else."),Assert(!/^\.\.\//.test(e),"Path must be relative to the root, and can't go above root."),e=(e=e.replace(/\\/g,"/")).replace(/^\//,""),Is.Window(globalThis)?/github.io$/.test(window.location.hostname)?`https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/${e}`:`${window.location.origin}/${e}`:e}export function Create_Style_Element(e){const t=document.createElement("style");return t.setAttribute("type","text/css"),t.appendChild(document.createTextNode(e)),document.head.appendChild(t),t}export function Destroy_Style_Element(e){document.head.removeChild(e)}