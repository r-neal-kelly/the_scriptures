import*as Utils from"../../../../../utils.js";import*as Entity from"../../../../entity.js";import*as Branch from"./branch.js";export class Instance extends Entity.Instance{constructor({branch:e,model:t}){super({element:"div",parent:e,event_grid:e.Event_Grid()}),this.model=t,this.Live()}On_Life(){return[]}On_Refresh(){this.Element().textContent=this.Model().Name()}On_Reclass(){const e=this.Model(),t=[];return t.push("Branch_Name"),""===e.Name()?t.push("Hidden"):e.Is_Selected()&&t.push("Selected"),t}Model(){return this.model()}Has_Branch(){return this.Has_Child(0)&&this.Child(0)instanceof Branch.Instance}Branch(){return Utils.Assert(this.Has_Branch(),"Does not have Branch."),this.Child(0)}}