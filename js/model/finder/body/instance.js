var __awaiter=this&&this.__awaiter||function(s,e,i,t){return new(i||(i=Promise))((function(n,a){function r(s){try{o(t.next(s))}catch(s){a(s)}}function _(s){try{o(t.throw(s))}catch(s){a(s)}}function o(s){var e;s.done?n(s.value):(e=s.value,e instanceof i?e:new i((function(s){s(e)}))).then(r,_)}o((t=t.apply(s,e||[])).next())}))};import*as Utils from"../../../utils.js";import*as Async from"../../../async.js";import*as Language from"../../language.js";import*as Data from"../../data.js";import*as Search from"../../search.js";import*as Selector from"../../selector.js";import*as Expression from"./expression.js";import*as Results from"./results.js";export class Instance extends Async.Instance{constructor({finder:s}){super(),this.finder=s,this.filter=new Selector.Instance({slot_order:Selector.Slot.Order.LANGUAGES_VERSIONS_BOOKS,does_smart_item_selection:!1,selection:new Data.Selection.Name({language:Language.Name.ENGLISH})}),this.expression=new Expression.Instance({body:this}),this.results=new Results.Instance({body:this,filter_slot_order:this.filter.Settings().Current_Slot_Order().Value(),versions_results:new Map,is_showing_commands:!1}),this.is_waiting=!1,this.waiting_milliseconds_interval=100,this.waiting_percent_done=null,this.waiting_message_index=null,this.waiting_message_count=null,this.waiting_message_is_moving_forward=null,0,this.Add_Dependencies([this.filter,this.results])}Finder(){return this.finder}Filter(){return this.filter}Expression(){return this.expression}Results(){return this.results}Has_Empty_Results(){return this.Results().Tree().Root().Is_Empty()}Is_Waiting(){return this.is_waiting}Set_Is_Waiting(s){this.is_waiting=s,this.is_waiting?(this.waiting_percent_done=new Search.Percent_Done.Instance,this.waiting_message_index=0,this.waiting_message_count=8,this.waiting_message_is_moving_forward=!0):(this.waiting_percent_done=null,this.waiting_message_index=null,this.waiting_message_count=null,this.waiting_message_is_moving_forward=null)}Waiting_Milliseconds_Interval(){return this.waiting_milliseconds_interval}Waiting_Percent_Done(){return 0,0,this.waiting_percent_done}Waiting_Message(){0,0,0,0;const s=new Array(this.waiting_message_count);return s.fill(".",0,s.length),s[this.waiting_message_index]="📝",this.waiting_message_is_moving_forward?(this.waiting_message_index+=1,this.waiting_message_index>=this.waiting_message_count&&(this.waiting_message_index=this.waiting_message_count-2,this.waiting_message_is_moving_forward=!1)):(this.waiting_message_index-=1,this.waiting_message_index<0&&(this.waiting_message_index=1,this.waiting_message_is_moving_forward=!0)),`Searching ${s.join("")} ${this.Waiting_Percent_Done().Value()}%`}Search(){return __awaiter(this,void 0,void 0,(function*(){this.Set_Is_Waiting(!0);const s=this.Filter().File_Or_Versions(),e=this.Expression().Value();let i;if(s instanceof Data.File.Instance){const t=s,n=yield Search.Singleton().Data_File(t,e);if(n instanceof Search.Parser.Help)i=n;else if(i=new Map,n.length>0){const s=new Map;s.set(t,n),i.set(t.Version(),s)}}else i=yield Search.Singleton().Data_Versions(s,e,this.Waiting_Milliseconds_Interval(),this.Waiting_Percent_Done());if(i instanceof Search.Parser.Help)this.expression.Set_Help(i),this.results=new Results.Instance({body:this,filter_slot_order:this.filter.Settings().Current_Slot_Order().Value(),versions_results:new Map,is_showing_commands:!1});else{const s=e.includes(Search.Operator.META);this.expression.Set_Help(null),this.results=new Results.Instance({body:this,filter_slot_order:this.filter.Settings().Current_Slot_Order().Value(),versions_results:i,is_showing_commands:s})}this.Set_Is_Waiting(!1)}))}}