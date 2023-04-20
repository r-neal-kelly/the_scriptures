import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Line from"./line.js";export class Instance extends Entity.Instance{static Min_Line_Count(){return Instance.min_line_count}static Set_Min_Line_Count(n){Utils.Assert(n>=0,"min_line_count must be greater than or equal to 0."),Instance.min_line_count=n}constructor({text:n}){super(),this.text=n,this.lines=[];for(let t=0,e=n.Line_Count();t<e;t+=1)this.lines.push(new Line.Instance({buffer:this,index:t,text:n.Line(t)}));this.Add_Dependencies(this.lines)}Text(){return this.text}Line_Count(){return this.lines.length}Line_At(n){return Utils.Assert(n>-1,`line_index (${n}) must be greater than -1.`),n<this.Line_Count()?this.lines[n]:Instance.blank_line}}Instance.min_line_count=50,Instance.blank_line=new Line.Instance({buffer:null,index:null,text:null});