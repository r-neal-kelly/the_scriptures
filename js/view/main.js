var __awaiter=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(i,s){function r(e){try{a(o.next(e))}catch(e){s(e)}}function l(e){try{a(o.throw(e))}catch(e){s(e)}}function a(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(r,l)}a((o=o.apply(e,n||[])).next())}))};import*as Utils from"../utils.js";import*as Event from"../event.js";import*as Entity from"./entity.js";import*as Model from"../model/layout.js";import*as View from"./layout.js";import*as Fonts_Model from"../model/fonts.js";import*as Data_Model from"../model/data.js";import*as Selector_Model from"../model/selector.js";import*as Browser_Model from"../model/browser.js";import*as Browser_View from"./browser.js";class Body extends Entity.Instance{constructor({model:e}){super({element:document.body,parent:null,event_grid:new Event.Grid}),this.model=e,this.Live()}On_Life(){return Utils.Create_Style_Element(Fonts_Model.Singleton().CSS_Definitions()),this.Add_CSS("\n                * {\n                    box-sizing: border-box;\n                    margin: 0;\n                    padding: 0;\n                }\n\n                *:focus {\n                    outline: 0;\n                }\n            "),this.Add_This_CSS("\n                .Body {\n                    width: 100vw;\n                    height: 100vh;\n\n                    background-color: black;\n\n                    font-family: sans-serif;\n                    font-size: 16px;\n                }\n            "),this.Window().addEventListener("beforeunload",function(e){this.Die()}.bind(this)),[]}On_Refresh(){this.Has_View()||(this.Abort_All_Children(),new View.Instance({model:()=>this.Model(),root:this}))}On_Reclass(){return["Body"]}Model(){return this.model}Window(){return window}Document(){return document}Has_View(){return this.Has_Child(0)&&this.Child(0)instanceof View.Instance}View(){return 0,this.Child(0)}}function Main(){return __awaiter(this,void 0,void 0,(function*(){const e=new Model.Instance,n=new Body({model:e}),t=[[Selector_Model.Slot.Order.LANGUAGES_VERSIONS_BOOKS,"Genesis","English","KJV 1872-1888","Chapter 01"],[Selector_Model.Slot.Order.VERSIONS_LANGUAGES_BOOKS,"Jubilees","English","R. H. Charles 1913","Chapter 01"]];let o=!0;for(const[n,i,s,r,l]of t)e.Add_Program(new Model.Window.Program.Instance({model_class:Browser_Model.Instance,model_data:{selection:new Data_Model.Selection.Name({book:i,language:s,version:r,file:l}),selector_slot_order:n,is_selector_open:!1},view_class:Browser_View.Instance,is_window_active:o})),o=!1;n.Refresh()}))}Main();