import*as Utils from"../../utils.js";import*as Entity from"../entity.js";import*as Window from"./window.js";export class Instance extends Entity.Instance{constructor({model:t,layout:e}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Refresh(){const t=this.Model().Count(),e=this.Child_Count(),r=t-e;if(r<0)for(let t=e,n=e+r;t>n;)t-=1,this.Abort_Child(this.Child(t));else if(r>0)for(let t=e,n=e+r;t<n;t+=1)new Window.Instance({model:()=>this.Model().At(t),wall:this})}On_Reclass(){return["Wall"]}On_Restyle(){const t=this.Model().Count();return 1===t?"\n                grid-template-columns: repeat(1, 1fr);\n                grid-template-rows: repeat(1, 1fr);\n            ":2===t?"\n                grid-template-columns: repeat(2, 1fr);\n                grid-template-rows: repeat(1, 1fr);\n            ":3===t||4===t?"\n                grid-template-columns: repeat(2, 1fr);\n                grid-template-rows: repeat(2, 1fr);\n            ":5===t||6===t?"\n                grid-template-columns: repeat(3, 1fr);\n                grid-template-rows: repeat(2, 1fr);\n            ":"\n                grid-template-columns: auto;\n                grid-template-rows: auto;\n            "}Model(){return this.model()}Layout(){return this.Parent()}Window_With_Model(t){for(let e=0,r=this.Child_Count();e<r;e+=1){const r=this.Child(e);if(r.Model()===t)return r}return 0,this.Child(0)}}