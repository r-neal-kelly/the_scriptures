import*as Utils from"../../../utils.js";import*as Entity from"../../entity.js";import*as Line from"./line.js";export class Instance extends Entity.Instance{static Min_Line_Count(){return Instance.min_line_count}static Set_Min_Line_Count(n){Utils.Assert(n>=0,"min_line_count must be greater than or equal to 0."),Instance.min_line_count=n}constructor({results:n,shows_commands:s}){super(),this.lines=[],this.shows_commands=s;for(let s=0,t=n.length;s<t;s+=1)this.lines.push(new Line.Instance({buffer:this,index:s,result:n[s]}));this.Add_Dependencies(this.lines)}Line_Count(){return this.lines.length}Line_At(n){return Utils.Assert(n>-1,`line_index (${n}) must be greater than -1.`),n<this.Line_Count()?this.lines[n]:Instance.blank_line}Shows_Commands(){return this.shows_commands}Toggle_Show_Commands(){this.shows_commands=!this.shows_commands}}Instance.min_line_count=50,Instance.blank_line=new Line.Instance({buffer:null,index:null,result:null});