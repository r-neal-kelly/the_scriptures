import*as Utils from"../../../utils.js";import*as Part from"../part.js";import*as Column from"../column.js";export class Instance{constructor({type:t,value:s}){this.type=t,this.value=s,this.columns=[],this.margin_count=0}Update_Empty(){0,0,this.Push_Column(!1),this.columns[this.columns.length-1].Update_Empty()}Update_Point(t,{value:s,style:e,language:n}){0;const i=new Part.Point.Instance({index:0,value:s,style:e,language:n}),a=new Part.Point.Instance({index:0,value:s,style:e,language:n});this.columns.length<1&&this.Push_Column(!1),this.columns[this.columns.length-1].Update_Point(t,i,a)}Update_Letter(t,{value:s,style:e,language:n}){0;const i=new Part.Letter.Instance({index:0,value:s,style:e,language:n});this.columns.length<1&&this.Push_Column(!1),this.columns[this.columns.length-1].Update_Letter(t,i)}Update_Marker(t,{value:s,style:e,language:n}){0;const i=new Part.Marker.Instance({index:0,value:s,style:e,language:n});this.columns.length<1&&this.Push_Column(!1),this.columns[this.columns.length-1].Update_Marker(t,i)}Update_Word(t,{value:s,status:e,style:n,language:i}){0;const a=new Part.Word.Instance({index:0,value:s,status:e,style:n,language:i});this.columns.length<1&&this.Push_Column(!1),this.columns[this.columns.length-1].Update_Word(t,a)}Update_Break(t,{value:s,status:e,style:n,language:i,boundary:a}){0;const l=new Part.Break.Instance({index:0,value:s,status:e,style:n,language:i,boundary:a});this.columns.length<1&&this.Push_Column(!1),this.columns[this.columns.length-1].Update_Break(t,l)}Update_Command(t,{value:s,language:e}){0;const n=new Part.Command.Instance({index:0,value:s,language:e}),i=new Part.Command.Instance({index:0,value:s,language:e});(this.columns.length<1||i.Is_Column()||i.Is_Margin())&&this.Push_Column(i.Is_Margin()),this.columns[this.columns.length-1].Update_Command(t,n,i),i.Is_Margin()&&(this.margin_count+=1)}Push_Column(t){this.columns.push(new Column.Instance({index:this.columns.length,is_margin:t}))}Is_Finalized(){return Object.isFrozen(this.columns)}Finalize(){0,Object.freeze(this.columns);for(const t of this.columns)t.Finalize()}Type(){return 0,this.type}Value(){return 0,this.value}Has_Column_Index(t){return 0,0,t<this.Column_Count()}Column_Count(){return 0,this.columns.length}Column(t){return 0,0,this.columns[t]}Has_Margin(){return this.margin_count>0}Margin_Count(){return this.margin_count}Non_Margin_Count(){return this.Column_Count()-this.Margin_Count()}}