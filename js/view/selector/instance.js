var __awaiter=this&&this.__awaiter||function(n,e,t,o){return new(t||(t=Promise))((function(r,i){function s(n){try{d(o.next(n))}catch(n){i(n)}}function l(n){try{d(o.throw(n))}catch(n){i(n)}}function d(n){var e;n.done?r(n.value):(e=n.value,e instanceof t?e:new t((function(n){n(e)}))).then(s,l)}d((o=o.apply(n,e||[])).next())}))};import*as Utils from"../../utils.js";import*as Event from"../../event.js";import*as Events from"../events.js";import*as Entity from"../entity.js";import*as Slots from"./slots.js";export class Instance extends Entity.Instance{constructor({parent:n,model:e,event_grid_id:t,is_visible:o}){super({element:"div",parent:n,event_grid:n.Event_Grid()}),this.model=e,this.event_grid_id=t,this.is_visible=o,this.Live()}On_Life(){return this.Add_CSS("\n                .Selector {\n                    position: absolute;\n                    left: 0;\n                    top: 0;\n                    z-index: 1;\n\n                    height: 100%;\n\n                    background-color: hsl(0, 0%, 0%, 0.7);\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n                }\n\n                .Slots {\n                    display: grid;\n                    grid-template-rows: 1fr;\n                    grid-template-columns: repeat(4, 1fr);\n                    justify-content: start;\n\n                    width: 100%;\n                    height: 100%;\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n                }\n\n                .Slot {\n                    display: grid;\n                    grid-template-rows: auto auto;\n                    grid-template-columns: auto;\n                    align-content: start;\n\n                    width: 100%;\n                    height: 100%;\n                    padding: 0 3px;\n\n                    border-color: white;\n                    border-style: solid;\n                    border-width: 0 1px 0 0;\n\n                    overflow-x: hidden;\n                    overflow-y: hidden;\n                }\n\n                .Slot_Title {\n                    width: 100%;\n                \n                    overflow-x: hidden;\n                    overflow-y: hidden;\n\n                    background-color: transparent;\n                    color: white;\n\n                    border-color: white;\n                    border-style: solid;\n                    border-width: 0 0 1px 0;\n\n                    font-variant: small-caps;\n\n                    cursor: default;\n                    -webkit-user-select: none;\n                    -moz-user-select: none;\n                    -ms-user-select: none;\n                    user-select: none;\n                }\n\n                .Slot_Items {\n                    width: 100%;\n\n                    padding: 2px 2px;\n\n                    overflow-x: auto;\n                    overflow-y: auto;\n                }\n\n                .Slot_Item {\n                    width: 100%;\n                    padding: 2px 2px;\n                    \n                    overflow-x: hidden;\n                    overflow-y: hidden;\n\n                    background-color: transparent;\n                    color: white;\n\n                    cursor: pointer;\n                    -webkit-user-select: none;\n                    -moz-user-select: none;\n                    -ms-user-select: none;\n                    user-select: none;\n                }\n                \n                .Slot_Item_Selected {\n                    background-color: white;\n                    color: black;\n                }\n\n                .Invisible {\n                    display: none;\n                }\n            "),[new Event.Listener_Info({event_name:new Event.Name(Event.Prefix.AFTER,Events.SELECTOR_TOGGLE,this.Event_Grid_ID()),event_handler:this.After_Selector_Toggle,event_priority:0})]}On_Refresh(){this.Has_Slots()||(this.Abort_All_Children(),new Slots.Instance({selector:this,model:()=>this.Model()}))}On_Reclass(){return["Selector"]}After_Selector_Toggle(){return __awaiter(this,void 0,void 0,(function*(){this.Refresh()}))}Model(){return this.model()}Event_Grid_ID(){return this.event_grid_id()}Is_Visible(){return this.is_visible()}Has_Slots(){return this.Has_Child(0)&&this.Child(0)instanceof Slots.Instance}Slots(){return Utils.Assert(this.Has_Slots(),"Does not have slots."),this.Child(0)}}