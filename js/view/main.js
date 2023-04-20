var __awaiter=this&&this.__awaiter||function(e,n,o,t){return new(o||(o=Promise))((function(i,r){function s(e){try{d(t.next(e))}catch(e){r(e)}}function a(e){try{d(t.throw(e))}catch(e){r(e)}}function d(e){var n;e.done?i(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(s,a)}d((t=t.apply(e,n||[])).next())}))};import*as Utils from"../utils.js";import*as Event from"../event.js";import*as Entity from"./entity.js";import*as Model from"../model/layout.js";import*as View from"./layout.js";import*as Data_Model from"../model/data.js";import*as Browser_Model from"../model/browser.js";import*as Browser_View from"./browser.js";import*as Finder_Model from"../model/finder.js";import*as Finder_View from"./finder.js";class Body extends Entity.Instance{constructor({model:e}){super({element:document.body,parent:null,event_grid:new Event.Grid}),this.model=e,this.Live()}On_Life(){return this.Add_CSS("\n                * {\n                    box-sizing: border-box;\n                    margin: 0;\n                    padding: 0;\n                }\n\n                *:focus {\n                    outline: 0;\n                }\n            "),this.Add_This_CSS("\n                .Body {\n                    width: 100vw;\n                    height: 100vh;\n\n                    background-color: black;\n\n                    font-family: sans-serif;\n                }\n            "),this.Window().addEventListener("beforeunload",function(e){this.Die()}.bind(this)),[]}On_Refresh(){this.Has_View()||(this.Abort_All_Children(),new View.Instance({model:()=>this.Model(),root:this}))}On_Reclass(){return["Body"]}Model(){return this.model}Window(){return window}Document(){return document}Has_View(){return this.Has_Child(0)&&this.Child(0)instanceof View.Instance}View(){return Utils.Assert(this.Has_View(),"Does not have a view."),this.Child(0)}}function Main(){return __awaiter(this,void 0,void 0,(function*(){const e=new Model.Instance,n=new Body({model:e}),o=[[Browser_Model.Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,"Genesis","English","KJV 1872-1888+","Chapter 01"],[Browser_Model.Body.Selector.Slot.Order.VERSIONS_LANGUAGES_BOOKS,"Jubilees","English","R. H. Charles 1913","Chapter 01"]];for(const[n,t,i,r,s]of o)e.Add_Program(new Model.Window.Program.Instance({model_class:Browser_Model.Instance,model_data:{selection:new Data_Model.Selection.Name({book:t,language:i,version:r,file:s}),selector_slot_order:n,is_selector_open:!1},view_class:Browser_View.Instance}));e.Add_Program(new Model.Window.Program.Instance({model_class:Finder_Model.Instance,model_data:void 0,view_class:Finder_View.Instance})),n.Refresh()}))}Main();import*as Data from"../model/data.js";import*as Search from"../model/search.js";!function(){__awaiter(this,void 0,void 0,(function*(){const e=new Search.Instance;yield e.Ready();const n=yield Data.Singleton().Book("Genesis").Language("English").Version("KJV 1872-1888+").File("Chapter 01").Text();window.search=function(o){return e.Text(n,o)}}))}();