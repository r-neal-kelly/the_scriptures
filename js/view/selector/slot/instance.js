import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Title from"./title.js";import*as Items from"./items.js";export class Instance extends Entity.Instance{constructor({slots:t,model:s}){super({element:"div",parent:t,event_grid:t.Event_Grid()}),this.model=s,this.Live()}On_Refresh(){this.Has_Title()&&this.Has_Items()||(this.Abort_All_Children(),new Title.Instance({slot:this,model:()=>this.Model()}),new Items.Instance({slot:this,model:()=>this.Model()}))}On_Reclass(){return["Slot"]}Model(){return this.model()}Event_Grid_ID(){return this.Slots().Event_Grid_ID()}Slots(){return this.Parent()}Is_Visible(){return this.Slots().Is_Visible()}Has_Title(){return this.Has_Child(0)&&this.Child(0)instanceof Title.Instance}Title(){return 0,this.Child(0)}Has_Items(){return this.Has_Child(1)&&this.Child(1)instanceof Items.Instance}Items(){return 0,this.Child(1)}}