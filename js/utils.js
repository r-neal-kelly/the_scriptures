var __awaiter=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function s(e){try{l(o.next(e))}catch(e){r(e)}}function a(e){try{l(o.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}l((o=o.apply(e,t||[])).next())}))};export function Assert(e,t="Failed assert."){if(!1===e)throw new Error(t)}export function Print(...e){console.log(...e)}const is_big_endian=new TextDecoder("utf-16be").decode(new Uint16Array([65]))===String.fromCharCode(65);export function Is_Big_Endian(){return is_big_endian}export function Is_Little_Endian(){return!is_big_endian}export function Wait_Milliseconds(e){return __awaiter(this,void 0,void 0,(function*(){if(0,0,e>0)return new Promise((function(t){setTimeout(t,e)}))}))}export function Wait_Seconds(e){return __awaiter(this,void 0,void 0,(function*(){if(0,0,0,e>0)return Wait_Milliseconds(1e3*e)}))}function Is_Type(e,t){return e.test(Object.prototype.toString.call(t).replace(/^[^ ]+ |.$/g,""))}export const Is={Undefined:e=>Is_Type(/^Undefined$/,e),Null:e=>Is_Type(/^Null$/,e),Undefined_Or_Null:e=>Is_Type(/^Undefined$|^Null$/,e),Boolean:e=>Is_Type(/^Boolean$/,e),Number:e=>Is_Type(/^Number$/,e)&&e==e&&e!==1/0&&e!==-1/0,Infinity:e=>Is_Type(/^Number$/,e)&&e===1/0||e===-1/0,Number_Or_Infinity:e=>Is_Type(/^Number$/,e)&&e==e,NaN:e=>Is_Type(/^Number$/,e)&&e!=e,Object:e=>Is_Type(/^Object$/,e),Array:e=>Is_Type(/^Array$/,e),String:e=>Is_Type(/^String$/,e),Function:e=>Is_Type(/^Function$/,e),Symbol:e=>Is_Type(/^Symbol$/,e),Date:e=>Is_Type(/^Date$/,e),RegExp:e=>Is_Type(/^RegExp$/,e),Set:e=>Is_Type(/^Set$/,e),Map:e=>Is_Type(/^Map$/,e),Window:e=>Is_Type(/^Window$/,e),Global:e=>Is_Type(/^global$/,e),Window_Or_Global:e=>Is_Type(/^Window$|^global$/,e)};Object.freeze(Is);export function Escape_Regular_Expression(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}export function Remove_File_Extension(e){return e.replace(/\.[^.]*$/,"")}export function Add_Commas_To_Number(e){const t=`${e}`,n=t.length%3;let o="",i=t;for(0!==n&&(o+=`${i.slice(0,n)},`,i=i.slice(n));i.length>0;)o+=`${i.slice(0,3)},`,i=i.slice(3);return o.slice(0,o.length-1)}export function Resolve_Path(e){return 0,0,e=(e=e.replace(/\\/g,"/")).replace(/^\//,""),Is.Window(globalThis)?/github.io$/.test(window.location.hostname)?`https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/${e}`:`${window.location.origin}/${e}`:e}export function Can_Use_Workers(){return null!=window.Worker}export function Create_Style_Element(e){const t=document.createElement("style");return t.setAttribute("type","text/css"),t.appendChild(document.createTextNode(e)),document.head.appendChild(t),t}export function Destroy_Style_Element(e){document.head.removeChild(e)}