var __awaiter=this&&this.__awaiter||function(e,t,s,n){return new(s||(s=Promise))((function(a,i){function o(e){try{u(n.next(e))}catch(e){i(e)}}function r(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?a(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,r)}u((n=n.apply(e,t||[])).next())}))};import*as Utils from"../utils.js";import*as Language from"../model/language.js";import{Key}from"./key.js";import*as Reserved_Keys from"./reserved_keys.js";import*as Held_Keys from"./held_keys.js";import*as Layout from"./layout.js";export class Instance{constructor({layouts:e,default_layout_language_name:t,default_layout_subset_name:s}){this.layouts=Object.create(null);for(const t of e){const e=t.Language_Name();null==this.layouts[e]&&(this.layouts[e]=[]),0,this.layouts[e].push(t)}for(const e of Object.keys(this.layouts))this.layouts[e].sort((function(e,t){if(e.Is_Language_Default())return-1;if(t.Is_Language_Default())return 1;{const s=e.Subset_Name(),n=t.Subset_Name();return null==s?-1:null==n?1:s<n?-1:s>n?1:0}}));null!=t?(this.default_layout=this.Layout(t,s),this.current_layout=this.default_layout):(this.default_layout=null,this.current_layout=null),this.divs_to_hooks=new Map,this.held_keys=new Held_Keys.Instance,this.message_div=document.createElement("div"),this.message_div.style.position="fixed",this.message_div.style.left="0",this.message_div.style.top="0",this.message_div.style.zIndex="100000",this.message_div.style.padding="3px",this.message_div.style.backgroundColor="black",this.message_div.style.color="white",this.message_div.style.borderStyle="solid",this.message_div.style.borderWidth="1px",this.message_div.style.borderColor="white",this.message_reference_count=0}Maybe_Index_Of_Layout(e,t){if(null!=this.layouts[e]){let s=null;for(let n=0,a=this.layouts[e].length;n<a;n+=1){if(this.layouts[e][n].Subset_Name()===t){s=n;break}}return s}return null}Has_Layout(e,t){return null!=this.Maybe_Index_Of_Layout(e,t)}Layout(e,t){const s=this.Maybe_Index_Of_Layout(e,t);return 0,this.layouts[e][s]}Has_Default_Layout(){return null!=this.default_layout}Default_Layout(){return 0,this.default_layout}Has_Current_Layout(){return null!=this.current_layout}Current_Layout(){return 0,this.current_layout}Set_Current_Layout(e,t){this.current_layout=null!=e?this.Layout(e,t):null;for(const[e,t]of this.divs_to_hooks.entries())t.On_Change_Layout(e,this.current_layout)}Has_Div(e){return this.divs_to_hooks.has(e)}Add_Div(e,t){0,0,e.addEventListener("keydown",this.On_Keydown.bind(this)),e.addEventListener("keyup",this.On_Keyup.bind(this)),e.addEventListener("beforeinput",this.Before_Input.bind(this)),this.divs_to_hooks.set(e,t),t.On_Change_Layout(e,this.current_layout)}Remove_Div(e){0,e.removeEventListener("keydown",this.On_Keydown.bind(this)),e.removeEventListener("keyup",this.On_Keyup.bind(this)),e.removeEventListener("beforeinput",this.Before_Input.bind(this)),this.divs_to_hooks.delete(e)}Held_Keys(){return this.held_keys}Div_From_Event(e){let t=e.target;for(;null!=t;){if(this.Has_Div(t))return t;t=t.parentElement}return 0,e.target}On_Keydown(e){return __awaiter(this,void 0,void 0,(function*(){if(!e.repeat){const t=e.code;Reserved_Keys.Has(t)&&t!==Reserved_Keys.META_KEY||this.held_keys.Add(e.code)}this.held_keys.Has(Reserved_Keys.META_KEY)?yield this.On_Meta_Keydown(e):yield this.On_Layout_Keydown(e)}))}On_Keyup(e){return __awaiter(this,void 0,void 0,(function*(){this.held_keys.Has(Reserved_Keys.META_KEY)?yield this.On_Meta_Keyup(e):yield this.On_Layout_Keyup(e),this.held_keys.Remove(e.code)}))}Before_Input(e){var t;return __awaiter(this,void 0,void 0,(function*(){const s=this.Div_From_Event(e),n=this.divs_to_hooks.get(s);0,"insertText"===e.inputType?(e.preventDefault(),yield this.Send_Insert_To_Selection(s,n,e.data||"")):"insertFromPaste"===e.inputType?(e.preventDefault(),yield this.Send_Paste_To_Selection(s,n,e.data||(null===(t=e.dataTransfer)||void 0===t?void 0:t.getData("text/plain"))||"")):"deleteContentBackward"===e.inputType&&(e.preventDefault(),yield this.Send_Delete(s,n,e.getTargetRanges()[0]))}))}Send_Insert_To_Selection(e,t,s){return __awaiter(this,void 0,void 0,(function*(){const n=document.getSelection();0,0;const a=n.getRangeAt(0);yield t.On_Insert({div:e,data:s.replace(/ /g," "),range:a}),yield t.After_Insert_Or_Paste_Or_Delete()}))}Send_Paste_To_Selection(e,t,s){return __awaiter(this,void 0,void 0,(function*(){const n=document.getSelection();0,0;const a=n.getRangeAt(0);yield t.On_Paste({div:e,data:s.replace(/ /g," "),range:a}),yield t.After_Insert_Or_Paste_Or_Delete()}))}Send_Delete(e,t,s){return __awaiter(this,void 0,void 0,(function*(){const n=document.createRange();n.setStart(s.startContainer,s.startOffset),n.setEnd(s.endContainer,s.endOffset),yield t.On_Delete({div:e,range:n}),yield t.After_Insert_Or_Paste_Or_Delete()}))}Send_Message(e){return __awaiter(this,void 0,void 0,(function*(){this.message_div.textContent=e,document.body.style.position="relative",this.message_reference_count<1&&document.body.appendChild(this.message_div),this.message_reference_count+=1,yield Utils.Wait_Seconds(2),this.message_reference_count-=1,this.message_reference_count<1&&document.body.removeChild(this.message_div)}))}On_Meta_Keydown(e){return __awaiter(this,void 0,void 0,(function*(){e.preventDefault(),e.repeat||(this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_0])?(this.Set_Current_Layout(null,null),this.Send_Message("Global Layout: None")):this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_9])?this.Has_Layout(Language.Name.HEBREW,"Phonetic")&&(this.Set_Current_Layout(Language.Name.HEBREW,"Phonetic"),this.Send_Message(`Global Layout: ${this.Current_Layout().Full_Name()}`)):this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_8])?this.Has_Layout(Language.Name.GREEK,"Combining Polytonic")&&(this.Set_Current_Layout(Language.Name.GREEK,"Combining Polytonic"),this.Send_Message(`Global Layout: ${this.Current_Layout().Full_Name()}`)):this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_7])?this.Has_Layout(Language.Name.LATIN,null)&&(this.Set_Current_Layout(Language.Name.LATIN,null),this.Send_Message(`Global Layout: ${this.Current_Layout().Full_Name()}`)):this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_6])?this.Has_Layout(Language.Name.ARAMAIC,"Abjad")&&(this.Set_Current_Layout(Language.Name.ARAMAIC,"Abjad"),this.Send_Message(`Global Layout: ${this.Current_Layout().Full_Name()}`)):this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_5])?this.Has_Layout(Language.Name.GEEZ,"Abugida")&&(this.Set_Current_Layout(Language.Name.GEEZ,"Abugida"),this.Send_Message(`Global Layout: ${this.Current_Layout().Full_Name()}`)):this.held_keys.Is([Reserved_Keys.META_KEY,Key.DIGIT_4])&&this.Has_Layout(Language.Name.ARABIC,"Abjad")&&(this.Set_Current_Layout(Language.Name.ARABIC,"Abjad"),this.Send_Message(`Global Layout: ${this.Current_Layout().Full_Name()}`)))}))}On_Meta_Keyup(e){return __awaiter(this,void 0,void 0,(function*(){e.preventDefault()}))}On_Layout_Keydown(e){return __awaiter(this,void 0,void 0,(function*(){const t=this.Div_From_Event(e),s=this.divs_to_hooks.get(t);if(0,yield s.On_Key_Down(e),!e.defaultPrevented&&!e.ctrlKey&&!e.altKey&&this.Has_Current_Layout())if(e.repeat){let n=this.held_keys;for(;n.Count()>0;){const a=this.Current_Layout().Maybe_Output(n,e.shiftKey,e.getModifierState(Key.CAPS_LOCK));if(Utils.Is.String(a)){e.preventDefault(),yield this.Send_Insert_To_Selection(t,s,a);break}if(a){e.preventDefault();break}n=n.Slice(1)}}else{const n=this.Current_Layout().Maybe_Space(this.held_keys,e.shiftKey,e.getModifierState(Key.CAPS_LOCK));if(n instanceof Layout.Space.Instance)e.preventDefault(),this.held_keys.Clear();else if(n)e.preventDefault();else{let n=this.held_keys;for(;n.Count()>0;){const a=this.Current_Layout().Maybe_Output(n,e.shiftKey,e.getModifierState(Key.CAPS_LOCK));if(Utils.Is.String(a)){e.preventDefault(),yield this.Send_Insert_To_Selection(t,s,a);break}if(a){e.preventDefault();break}n=n.Slice(1)}}}}))}On_Layout_Keyup(e){return __awaiter(this,void 0,void 0,(function*(){const t=this.Div_From_Event(e),s=this.divs_to_hooks.get(t);0,yield s.On_Key_Up(e)}))}}let singleton=null;export function Singleton(){return null==singleton&&(singleton=new Instance({layouts:[new Layout.Hebrew.Phonetic.Instance,new Layout.Hebrew.International.Instance,new Layout.Greek.Combining_Polytonic.Instance,new Layout.Greek.Combining_Monotonic.Instance,new Layout.Greek.Polytonic.Instance,new Layout.Greek.Monotonic.Instance,new Layout.Latin.Instance,new Layout.Aramaic.Abjad.Instance,new Layout.Geez.Abugida.Instance,new Layout.Geez.Abjad.Instance,new Layout.Arabic.Abjad.Instance],default_layout_language_name:Language.Name.LATIN,default_layout_subset_name:null})),singleton}