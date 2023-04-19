var __awaiter=this&&this.__awaiter||function(t,e,s,o){return new(s||(s=Promise))((function(l,S){function n(t){try{i(o.next(t))}catch(t){S(t)}}function _(t){try{i(o.throw(t))}catch(t){S(t)}}function i(t){var e;t.done?l(t.value):(e=t.value,e instanceof s?e:new s((function(t){t(e)}))).then(n,_)}i((o=o.apply(t,e||[])).next())}))};import*as Utils from"../../../../utils.js";import*as Entity from"../../../entity.js";import*as Data from"../../../data.js";import*as Slot from"./slot.js";export class Instance extends Entity.Instance{static Max_Slot_Count(){return Instance.MAX_SLOT_COUNT}static Slot_To_Data_Type(t){return t===Slot.Type.BOOKS?Data.Type.BOOKS:t===Slot.Type.LANGUAGES?Data.Type.LANGUAGES:t===Slot.Type.VERSIONS?Data.Type.VERSIONS:t===Slot.Type.FILES?Data.Type.FILES:(Utils.Assert(!1,"Invalid slot_type."),Data.Type.BOOKS)}constructor({slot_order:t=Slot.Order.LANGUAGES_VERSIONS_BOOKS,selection:e=null}){super(),this.slot_order=t,this.first_selection=e,this.slots=[],this.Add_Dependencies([Data.Singleton()])}Slot_Order(){return this.slot_order}Reorder_Slots(t){}Slot_Count(){return this.slots.length}Has_Slot(t){return this.slots.includes(t)}Has_Slot_Type(t){for(const e of this.slots)if(e.Type()===t)return!0;return!1}Slot_From_Type(t){for(const e of this.slots)if(e.Type()===t)return e;return Utils.Assert(!1,"Does not have slot with that type."),this.slots[0]}Slot_At_Index(t){return Utils.Assert(t>-1,"slot_index must be greater than -1."),Utils.Assert(t<this.Slot_Count(),"slot_index must be less than slot_count."),this.slots[t]}Slots(){return Array.from(this.slots)}Slot_Types(){const t=this.Slot_Order(),e=[];return t===Slot.Order.BOOKS_LANGUAGES_VERSIONS?(e.push(Slot.Type.BOOKS),e.push(Slot.Type.LANGUAGES),e.push(Slot.Type.VERSIONS)):t===Slot.Order.BOOKS_VERSIONS_LANGUAGES?(e.push(Slot.Type.BOOKS),e.push(Slot.Type.VERSIONS),e.push(Slot.Type.LANGUAGES)):t===Slot.Order.LANGUAGES_BOOKS_VERSIONS?(e.push(Slot.Type.LANGUAGES),e.push(Slot.Type.BOOKS),e.push(Slot.Type.VERSIONS)):t===Slot.Order.LANGUAGES_VERSIONS_BOOKS?(e.push(Slot.Type.LANGUAGES),e.push(Slot.Type.VERSIONS),e.push(Slot.Type.BOOKS)):t===Slot.Order.VERSIONS_BOOKS_LANGUAGES?(e.push(Slot.Type.VERSIONS),e.push(Slot.Type.BOOKS),e.push(Slot.Type.LANGUAGES)):t===Slot.Order.VERSIONS_LANGUAGES_BOOKS?(e.push(Slot.Type.VERSIONS),e.push(Slot.Type.LANGUAGES),e.push(Slot.Type.BOOKS)):Utils.Assert(!1,"Unknown slot_type."),e.push(Slot.Type.FILES),Utils.Assert(e.length===Instance.Max_Slot_Count(),"slot_types must have all types."),e}Push_Slot(){const t=Instance.Max_Slot_Count(),e=this.Slot_Count();Utils.Assert(e<t,"All slots have been pushed already.");const s=e,o=this.Slot_Types()[s],l=this.Slots().map(function(t,s){let o;return 0===s&&0===e?o=null:(Utils.Assert(t.Has_Selected_Item(),"To push a new slot, each previous slot must have a selected item."),o=t.Selected_Item().Name()),new Data.Query.Type_And_Name({type:Instance.Slot_To_Data_Type(t.Type()),name:o})}.bind(this));l.push(new Data.Query.Type_And_Name({type:Instance.Slot_To_Data_Type(o),name:null})),this.slots.push(new Slot.Instance({filter:this,index:s,type:o,item_names:Data.Singleton().Names(l)}))}Pop_Slot(){this.slots.pop()}Has_Books(){return this.Has_Slot_Type(Slot.Type.BOOKS)}Books(){return Utils.Assert(this.Has_Books(),"Doesn't have books."),this.Slot_From_Type(Slot.Type.BOOKS)}Has_Languages(){return this.Has_Slot_Type(Slot.Type.LANGUAGES)}Languages(){return Utils.Assert(this.Has_Languages(),"Doesn't have languages."),this.Slot_From_Type(Slot.Type.LANGUAGES)}Has_Versions(){return this.Has_Slot_Type(Slot.Type.VERSIONS)}Versions(){return Utils.Assert(this.Has_Versions(),"Doesn't have versions."),this.Slot_From_Type(Slot.Type.VERSIONS)}Has_Files(){return this.Has_Slot_Type(Slot.Type.FILES)}Files(){return Utils.Assert(this.Has_Files(),"Doesn't have files."),this.Slot_From_Type(Slot.Type.FILES)}As_String(){const t=this.Slot_Count();if(t>0){let e="";for(let s=0,o=t;s<o;){const t=this.Slot_At_Index(s);t.Has_Selected_Item()?e+=t.Selected_Item().Name():e+=t.Name(),s+=1,s<o&&(e+=" — ")}return e}return null}As_Short_String(){if(this.Slot_Count()>0){const t=this.Slot_At_Index(0);return t.Has_Selected_Item()?t.Selected_Item().Name():t.Name()}return null}__Select_Item__({slot:t,slot_item:e}){if(Utils.Assert(this.Has_Slot(t),"The slot does not belong to this selector."),t.__Select_Item__({item:e}),t.Type()!==Slot.Type.FILES)if(this.Slot_At_Index(this.Slot_Count()-1)===t)this.Push_Slot();else for(;this.Slot_Count()>t.Index()+1;)this.Pop_Slot()}Select_Item(t){const e=this.Slot_Types();for(let s=0,o=Instance.Max_Slot_Count();s<o;s+=1){s===this.Slot_Count()&&this.Push_Slot();const o=e[s];o===Slot.Type.BOOKS?this.Books().Item_From_Name(t.Book()).Select():o===Slot.Type.LANGUAGES?this.Languages().Item_From_Name(t.Language()).Select():o===Slot.Type.VERSIONS?this.Versions().Item_From_Name(t.Version()).Select():o===Slot.Type.FILES&&this.Files().Item_From_Name(t.File()).Select()}}Select_Item_At(t){const e=this.Slot_Types();for(let s=0,o=Instance.Max_Slot_Count();s<o;s+=1){s===this.Slot_Count()&&this.Push_Slot();const o=e[s];o===Slot.Type.BOOKS?this.Books().Item_At_Index(t.Book()).Select():o===Slot.Type.LANGUAGES?this.Languages().Item_At_Index(t.Language()).Select():o===Slot.Type.VERSIONS?this.Versions().Item_At_Index(t.Version()).Select():o===Slot.Type.FILES&&this.Files().Item_At_Index(t.File()).Select()}}After_Dependencies_Are_Ready(){return __awaiter(this,void 0,void 0,(function*(){this.first_selection instanceof Data.Selection.Name?this.Select_Item(this.first_selection):this.first_selection instanceof Data.Selection.Index?this.Select_Item_At(this.first_selection):this.Push_Slot()}))}}Instance.MAX_SLOT_COUNT=4;